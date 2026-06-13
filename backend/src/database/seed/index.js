import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { getPrisma } from '../../config/database.js';

dotenv.config();

const prisma = getPrisma();

/**
 * Seed Database with Sample Data
 */
async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.studentRecommendation.deleteMany({});
    await prisma.activity.deleteMany({});
    await prisma.lessonProgress.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.section.deleteMany({});
    await prisma.mentorStudent.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.studentProfile.deleteMany({});
    await prisma.mentorProfile.deleteMany({});
    await prisma.user.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Students
    console.log('👨‍🎓 Creating students...');
    const students = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        prisma.user.create({
          data: {
            id: uuidv4(),
            email: `student${i + 1}@example.com`,
            password: hashedPassword,
            firstName: `Student`,
            lastName: `${i + 1}`,
            role: 'STUDENT',
            studentProfile: {
              create: {
                totalStudyTime: Math.floor(Math.random() * 500),
                currentStreak: Math.floor(Math.random() * 10),
              },
            },
          },
          include: { studentProfile: true },
        })
      )
    );

    // Create Mentors
    console.log('👨‍🏫 Creating mentors...');
    const mentors = await Promise.all(
      Array.from({ length: 3 }, (_, i) =>
        prisma.user.create({
          data: {
            id: uuidv4(),
            email: `mentor${i + 1}@example.com`,
            password: hashedPassword,
            firstName: `Mentor`,
            lastName: `${i + 1}`,
            role: 'MENTOR',
            mentorProfile: {
              create: {
                specialty: ['Python', 'JavaScript', 'Machine Learning'][i],
              },
            },
          },
          include: { mentorProfile: true },
        })
      )
    );

    // Assign students to mentors
    console.log('🔗 Assigning students to mentors...');
    for (let i = 0; i < students.length; i++) {
      const mentorIndex = i % mentors.length;
      await prisma.mentorStudent.create({
        data: {
          mentorId: mentors[mentorIndex].mentorProfile.id,
          studentId: students[i].studentProfile.id,
        },
      });
    }

    // Create Courses
    console.log('📚 Creating courses...');
    const courses = await Promise.all(
      [
        { title: 'Introduction to Python', description: 'Learn Python basics' },
        { title: 'Web Development with React', description: 'Master React.js' },
        { title: 'Data Science Fundamentals', description: 'Data science essentials' },
        { title: 'JavaScript Advanced', description: 'Advanced JavaScript concepts' },
        { title: 'Machine Learning', description: 'ML algorithms and applications' },
        { title: 'Database Design', description: 'SQL and database design' },
        { title: 'API Development', description: 'Building RESTful APIs' },
        { title: 'Cloud Computing', description: 'AWS and Cloud services' },
      ].map((course) =>
        prisma.course.create({
          data: {
            id: uuidv4(),
            ...course,
          },
        })
      )
    );

    // Create Sections and Lessons
    console.log('📖 Creating sections and lessons...');
    const sections = [];
    const lessons = [];

    for (let courseIdx = 0; courseIdx < courses.length; courseIdx++) {
      const course = courses[courseIdx];

      for (let sectionIdx = 0; sectionIdx < 3; sectionIdx++) {
        const section = await prisma.section.create({
          data: {
            id: uuidv4(),
            courseId: course.id,
            title: `Section ${sectionIdx + 1}`,
            order: sectionIdx + 1,
          },
        });
        sections.push(section);

        // Create 2 lessons per section
        for (let lessonIdx = 0; lessonIdx < 2; lessonIdx++) {
          const lesson = await prisma.lesson.create({
            data: {
              id: uuidv4(),
              sectionId: section.id,
              title: `Lesson ${lessonIdx + 1}`,
              description: `Learn about lesson ${lessonIdx + 1}`,
              duration: 30 + Math.floor(Math.random() * 60),
              order: lessonIdx + 1,
            },
          });
          lessons.push(lesson);
        }
      }
    }

    // Create Enrollments and Progress
    console.log('📝 Creating enrollments and progress...');
    const enrollments = [];
    const progressRecords = [];

    for (const student of students) {
      // Enroll in 2-4 random courses
      const enrollmentCount = 2 + Math.floor(Math.random() * 3);
      const courseIndices = new Set();

      while (courseIndices.size < enrollmentCount) {
        courseIndices.add(Math.floor(Math.random() * courses.length));
      }

      for (const courseIdx of courseIndices) {
        const course = courses[courseIdx];
        const completion = Math.floor(Math.random() * 100);

        const enrollment = await prisma.enrollment.create({
          data: {
            id: uuidv4(),
            studentId: student.studentProfile.id,
            courseId: course.id,
            status: completion === 100 ? 'COMPLETED' : 'IN_PROGRESS',
            totalTimeSpent: Math.floor(Math.random() * 1000),
            completionPercent: completion,
          },
        });
        enrollments.push(enrollment);

        // Create lesson progress for each lesson in course
        for (const section of sections.filter((s) => s.courseId === course.id)) {
          for (const lesson of lessons.filter((l) => l.sectionId === section.id)) {
            const statusRandom = Math.random();
            let status = 'NOT_STARTED';
            if (statusRandom < 0.7) status = 'COMPLETED';
            else if (statusRandom < 0.9) status = 'IN_PROGRESS';

            const progress = await prisma.lessonProgress.create({
              data: {
                id: uuidv4(),
                enrollmentId: enrollment.id,
                lessonId: lesson.id,
                status,
                startedAt: status !== 'NOT_STARTED' ? new Date() : null,
                completedAt: status === 'COMPLETED' ? new Date() : null,
                timeSpent: Math.floor(Math.random() * 120),
              },
            });
            progressRecords.push(progress);
          }
        }
      }
    }

    // Create Activities
    console.log('🎯 Creating activity records...');
    const activityTypes = [
      'LESSON_STARTED',
      'LESSON_COMPLETED',
      'COURSE_STARTED',
      'LOGIN',
    ];

    for (const student of students) {
      for (let i = 0; i < 30; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - daysAgo);
        timestamp.setHours(Math.floor(Math.random() * 24));
        timestamp.setMinutes(Math.floor(Math.random() * 60));

        const randomEnrollment = enrollments.find((e) => e.studentId === student.studentProfile.id);
        const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];

        await prisma.activity.create({
          data: {
            id: uuidv4(),
            userId: student.id,
            courseId: randomEnrollment?.courseId || null,
            lessonId: randomLesson?.id || null,
            type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
            timestamp,
          },
        });
      }
    }

    // Create Recommendations
    console.log('💡 Creating recommendations...');
    for (const student of students) {
      for (let i = 0; i < 5; i++) {
        const lesson = lessons[Math.floor(Math.random() * lessons.length)];
        const reasons = [
          'incomplete_lesson',
          'least_completed_course',
          'most_recent_course',
        ];

        await prisma.studentRecommendation.create({
          data: {
            id: uuidv4(),
            studentId: student.studentProfile.id,
            lessonId: lesson.id,
            reason: reasons[Math.floor(Math.random() * reasons.length)],
            priority: Math.floor(Math.random() * 5),
          },
        });
      }
    }

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Sample Credentials:');
    console.log('Student: student1@example.com / password123');
    console.log('Mentor: mentor1@example.com / password123');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

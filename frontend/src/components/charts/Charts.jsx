import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';

const COLORS = ['#0f3460', '#e94560', '#16213e', '#ff9800', '#4caf50'];

export const LineChartComponent = ({ title, data, dataKey }) => (
  <Card sx={{ height: 300 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke="#0f3460" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const AreaChartComponent = ({ title, data, dataKey }) => (
  <Card sx={{ height: 300 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey={dataKey} fill="#0f3460" stroke="#0f3460" />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const BarChartComponent = ({ title, data, dataKey, xAxisKey }) => (
  <Card sx={{ height: 300 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill="#0f3460" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const PieChartComponent = ({ title, data, dataKey, nameKey }) => (
  <Card sx={{ height: 300 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={4}
            label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}
            labelLine={false}
            minAngle={20}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} course${value === 1 ? '' : 's'}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

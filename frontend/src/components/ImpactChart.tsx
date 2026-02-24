import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function ImpactChart() {
  const data = [
    { month: "Jan", jobs: 12 },
    { month: "Feb", jobs: 20 },
    { month: "Mar", jobs: 34 },
  ]

  return (
    <div className="glass p-6 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line dataKey="jobs" stroke="#16a34a" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

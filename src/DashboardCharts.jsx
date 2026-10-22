import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const STATUS_COLORS = ['#e7a43b', '#3985a8', '#4f9b77', '#7a8596', '#c45f58', '#6d89bd', '#9b6d9d'];

export default function DashboardCharts({ summary }) {
  const categoryData = Object.entries(summary.complaintsByCategory ?? {}).map(([name, count]) => ({
    name: name.replaceAll('_', ' '),
    count,
  }));
  const statusData = Object.entries(summary.complaintsByStatus ?? {})
    .filter(([, count]) => count > 0)
    .map(([name, count]) => ({ name: name.replaceAll('_', ' '), count }));

  return (
    <section className="dashboard-charts" aria-label="Complaint analytics">
      <article className="chart-panel">
        <h3>Complaints by category</h3>
        {categoryData.length ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData} margin={{ top: 8, right: 12, left: -16, bottom: 8 }}>
              <CartesianGrid stroke="#e8edf2" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-18} textAnchor="end" height={54} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="Complaints" fill="#3985a8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="muted">No category data yet.</p>}
      </article>
      <article className="chart-panel">
        <h3>Status distribution</h3>
        {statusData.length ? (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusData} dataKey="count" nameKey="name" innerRadius={54} outerRadius={86} paddingAngle={3}>
                {statusData.map((item, index) => (
                  <Cell key={item.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : <p className="muted">No status data yet.</p>}
        <ul className="chart-legend">
          {statusData.map((item, index) => (
            <li key={item.name}><span style={{ backgroundColor: STATUS_COLORS[index % STATUS_COLORS.length] }} />{item.name}: {item.count}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
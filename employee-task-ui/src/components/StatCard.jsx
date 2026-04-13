export default function StatCard({ label, value, icon, color = 'var(--accent)', sub }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 32, fontWeight: 700, color, fontFamily: 'var(--mono)' }}>{value ?? '—'}</div>
          {sub && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{sub}</div>}
        </div>
        <div style={{ fontSize: 28, opacity: .6 }}>{icon}</div>
      </div>
    </div>
  )
}

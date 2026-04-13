export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', marginTop: 16 }}>
      <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => onChange(page - 1)}>← Prev</button>
      <span style={{ fontSize: 13, color: 'var(--muted)', padding: '0 8px' }}>
        Page {page} of {totalPages}
      </span>
      <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => onChange(page + 1)}>Next →</button>
    </div>
  )
}

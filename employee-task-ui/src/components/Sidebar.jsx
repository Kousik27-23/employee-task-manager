import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/employees', icon: '👥', label: 'Employees' },
  { to: '/tasks',     icon: '✓',  label: 'Tasks' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: 'var(--surface)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      padding: '24px 0', position: 'sticky', top: 0
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 28px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--accent)', fontWeight: 700, letterSpacing: 1 }}>
          EM_TASK
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Management System</div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {nav.map(item => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
            fontSize: 14, fontWeight: 500, transition: 'all .15s',
            background: isActive ? 'rgba(79,142,247,.12)' : 'transparent',
            color: isActive ? 'var(--accent)' : 'var(--muted)',
            borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
          })}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{user?.username}</div>
        <div style={{ marginBottom: 12 }}>
          <span className={`badge badge-${user?.role?.toLowerCase()}`}>{user?.role}</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center' }}>
          Sign out
        </button>
      </div>
    </aside>
  )
}

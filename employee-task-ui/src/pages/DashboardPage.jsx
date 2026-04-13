import { useState, useEffect } from 'react'
import { employeeApi, taskApi } from '../api'

import StatCard from '../components/StatCard'

export default function DashboardPage() {
  const [empData, setEmpData] = useState(null)
  const [taskData, setTaskData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      employeeApi.getAll({ page: 1, pageSize: 1 }),
      employeeApi.getAll({ page: 1, pageSize: 1, isActive: true }),
      taskApi.getAll({ page: 1, pageSize: 1 }),
      taskApi.getAll({ page: 1, pageSize: 1, status: 'Pending' }),
      taskApi.getAll({ page: 1, pageSize: 1, status: 'InProgress' }),
      taskApi.getAll({ page: 1, pageSize: 1, status: 'Completed' }),
    ]).then(([all, active, allT, pending, inprog, done]) => {
      setEmpData({ total: all.totalCount, active: active.totalCount })
      setTaskData({ total: allT.totalCount, pending: pending.totalCount, inProgress: inprog.totalCount, completed: done.totalCount })
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: 'var(--muted)', padding: 40 }}>Loading...</div>

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Overview of your workforce and tasks</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Employees" value={empData?.total} icon="👥" color="var(--accent)" />
        <StatCard label="Active Employees" value={empData?.active} icon="✅" color="var(--success)" />
        <StatCard label="Total Tasks" value={taskData?.total} icon="📋" color="var(--accent2)" />
        <StatCard label="Pending" value={taskData?.pending} icon="⏳" color="var(--warning)" />
        <StatCard label="In Progress" value={taskData?.inProgress} icon="⚡" color="var(--accent)" />
        <StatCard label="Completed" value={taskData?.completed} icon="🎯" color="var(--success)" />
      </div>

      {taskData && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>Task Breakdown</div>
          <div style={{ display: 'flex', gap: 8, height: 12, borderRadius: 99, overflow: 'hidden', background: 'var(--border)' }}>
            {taskData.total > 0 && <>
              <div style={{ width: `${(taskData.completed / taskData.total) * 100}%`, background: 'var(--success)', transition: 'width .5s' }} />
              <div style={{ width: `${(taskData.inProgress / taskData.total) * 100}%`, background: 'var(--accent)' }} />
              <div style={{ width: `${(taskData.pending / taskData.total) * 100}%`, background: 'var(--warning)' }} />
            </>}
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
            {[
              { label: 'Completed', color: 'var(--success)', val: taskData.completed },
              { label: 'In Progress', color: 'var(--accent)', val: taskData.inProgress },
              { label: 'Pending', color: 'var(--warning)', val: taskData.pending },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                {item.label} ({item.val})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { taskApi, employeeApi } from '../api'
import { useAuth } from '../context/AuthContext'
import Pagination from '../components/Pagination'
import { useToast } from '../hooks/useToast'

const EMPTY_FORM = { title: '', description: '', employeeId: '', priority: 'Medium', dueDate: '' }

const statusClass = s => ({ Pending: 'badge-pending', InProgress: 'badge-inprogress', Completed: 'badge-completed', Cancelled: 'badge-cancelled' }[s] || '')
const priorityClass = p => ({ Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high' }[p] || '')

export default function TasksPage() {
  const { isManager, isAdmin } = useAuth()
  const { show, Toast } = useToast()
  const [data, setData] = useState(null)
  const [employees, setEmployees] = useState([])
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ status: '', priority: '', employeeId: '' })
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = useCallback(() => {
    const params = { page, pageSize: 10 }
    if (filters.status)     params.status     = filters.status
    if (filters.priority)   params.priority   = filters.priority
    if (filters.employeeId) params.employeeId = filters.employeeId
    taskApi.getAll(params).then(setData)
  }, [page, filters])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    employeeApi.getAll({ page: 1, pageSize: 100, isActive: true })
      .then(r => setEmployees(r.data || []))
  }, [])

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add') }
  const openEdit = task => {
    setForm({
      title: task.title, description: task.description,
      employeeId: task.employeeId, priority: task.priority,
      dueDate: task.dueDate?.slice(0, 10), status: task.status
    })
    setModal(task)
  }

  const save = async e => {
    e.preventDefault(); setSaving(true)
    try {
      if (modal === 'add') {
        await taskApi.create({ ...form, employeeId: parseInt(form.employeeId) })
        show('Task created')
      } else {
        await taskApi.update(modal.id, form)
        show('Task updated')
      }
      setModal(null); load()
    } catch (err) {
      show(err.response?.data?.message || 'Error saving task', 'error')
    } finally { setSaving(false) }
  }

  const confirmDelete = async () => {
    try {
      await taskApi.delete(deleteTarget.id)
      show('Task deleted'); setDeleteTarget(null); load()
    } catch { show('Failed to delete', 'error') }
  }

  const f = form
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div>
      <Toast />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Tasks</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>{data?.totalCount ?? '...'} total tasks</p>
        </div>
        {isManager && <button className="btn btn-primary" onClick={openAdd}>+ New Task</button>}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <select className="form-control" style={{ maxWidth: 160 }} value={filters.status} onChange={e => { setFilters(p => ({ ...p, status: e.target.value })); setPage(1) }}>
          <option value="">All Status</option>
          {['Pending','InProgress','Completed','Cancelled'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="form-control" style={{ maxWidth: 160 }} value={filters.priority} onChange={e => { setFilters(p => ({ ...p, priority: e.target.value })); setPage(1) }}>
          <option value="">All Priority</option>
          {['Low','Medium','High'].map(p => <option key={p}>{p}</option>)}
        </select>
        <select className="form-control" style={{ maxWidth: 200 }} value={filters.employeeId} onChange={e => { setFilters(p => ({ ...p, employeeId: e.target.value })); setPage(1) }}>
          <option value="">All Employees</option>
          {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.fullName}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th><th>Employee</th><th>Status</th>
                <th>Priority</th><th>Due Date</th><th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No tasks found</td></tr>
              )}
              {data?.data?.map(task => (
                <tr key={task.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{task.title}</div>
                    {task.description && <div style={{ fontSize: 12, color: 'var(--muted)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.description}</div>}
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{task.employeeName}</td>
                  <td><span className={`badge ${statusClass(task.status)}`}>{task.status}</span></td>
                  <td><span className={`badge ${priorityClass(task.priority)}`}>{task.priority}</span></td>
                  <td style={{ fontSize: 13, color: new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'var(--danger)' : 'var(--muted)' }}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(task)}>Edit</button>
                      {isAdmin && <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(task)}>Del</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 16px' }}>
          <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal !== null && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
              {modal === 'add' ? 'New Task' : 'Edit Task'}
            </div>
            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Title</label>
                  <input className="form-control" required value={f.title} onChange={e => set('title', e.target.value)} />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Description</label>
                  <textarea className="form-control" rows={3} value={f.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Assign To</label>
                  <select className="form-control" required value={f.employeeId} onChange={e => set('employeeId', e.target.value)} disabled={modal !== 'add'}>
                    <option value="">Select employee...</option>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.fullName} — {emp.department}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select className="form-control" value={f.priority} onChange={e => set('priority', e.target.value)}>
                    {['Low','Medium','High'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                {modal !== 'add' && (
                  <div className="form-group">
                    <label>Status</label>
                    <select className="form-control" value={f.status} onChange={e => set('status', e.target.value)}>
                      {['Pending','InProgress','Completed','Cancelled'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                )}
                <div className="form-group" style={{ gridColumn: modal === 'add' ? '1/-1' : undefined }}>
                  <label>Due Date</label>
                  <input className="form-control" type="date" required value={f.dueDate} onChange={e => set('dueDate', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>Delete Task?</div>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
              Permanently delete <strong style={{ color: 'var(--text)' }}>{deleteTarget.title}</strong>?
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

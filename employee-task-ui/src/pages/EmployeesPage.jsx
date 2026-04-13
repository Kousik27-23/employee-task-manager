import { useState, useEffect, useCallback } from 'react'
import { employeeApi } from '../api'
import { useAuth } from '../context/AuthContext'
import Pagination from '../components/Pagination'
import { useToast } from '../hooks/useToast'

const EMPTY_FORM = { fullName: '', email: '', department: '', designation: '', salary: '' }

export default function EmployeesPage() {
  const { isManager, isAdmin } = useAuth()
  const { show, Toast } = useToast()
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ department: '', isActive: '' })
  const [modal, setModal] = useState(null) // null | 'add' | {id, ...}
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = useCallback(() => {
    const params = { page, pageSize: 10 }
    if (filters.department) params.department = filters.department
    if (filters.isActive !== '') params.isActive = filters.isActive
    employeeApi.getAll(params).then(setData)
  }, [page, filters])

  useEffect(() => { load() }, [load])

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add') }
  const openEdit = emp => {
    setForm({ fullName: emp.fullName, email: emp.email, department: emp.department, designation: emp.designation, salary: emp.salary, isActive: emp.isActive })
    setModal(emp)
  }

  const save = async e => {
    e.preventDefault(); setSaving(true)
    try {
      if (modal === 'add') {
        await employeeApi.create({ ...form, salary: parseFloat(form.salary) })
        show('Employee added successfully')
      } else {
        await employeeApi.update(modal.id, { ...form, salary: parseFloat(form.salary) })
        show('Employee updated')
      }
      setModal(null); load()
    } catch (err) {
      show(err.response?.data?.message || 'Error saving employee', 'error')
    } finally { setSaving(false) }
  }

  const confirmDelete = async () => {
    try {
      await employeeApi.delete(deleteTarget.id)
      show('Employee deleted'); setDeleteTarget(null); load()
    } catch { show('Failed to delete', 'error') }
  }

  const f = form
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div>
      <Toast />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Employees</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>{data?.totalCount ?? '...'} total employees</p>
        </div>
        {isManager && <button className="btn btn-primary" onClick={openAdd}>+ Add Employee</button>}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input className="form-control" placeholder="Filter by department..." style={{ maxWidth: 220 }}
          value={filters.department} onChange={e => { setFilters(p => ({ ...p, department: e.target.value })); setPage(1) }} />
        <select className="form-control" style={{ maxWidth: 160 }}
          value={filters.isActive} onChange={e => { setFilters(p => ({ ...p, isActive: e.target.value })); setPage(1) }}>
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Department</th><th>Designation</th>
                <th>Salary</th><th>Status</th><th>Joined</th><th>Tasks</th>
                {isManager && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data?.data?.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No employees found</td></tr>
              )}
              {data?.data?.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{emp.fullName}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{emp.email}</div>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{emp.department}</td>
                  <td style={{ color: 'var(--muted)' }}>{emp.designation}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>₹{Number(emp.salary).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${emp.isActive ? 'badge-completed' : 'badge-cancelled'}`}>
                      {emp.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{new Date(emp.joinedAt).toLocaleDateString()}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{emp.totalTasks}</td>
                  {isManager && (
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(emp)}>Edit</button>
                        {isAdmin && <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(emp)}>Del</button>}
                      </div>
                    </td>
                  )}
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
              {modal === 'add' ? 'Add Employee' : 'Edit Employee'}
            </div>
            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Full Name</label>
                  <input className="form-control" required value={f.fullName} onChange={e => set('fullName', e.target.value)} />
                </div>
                <div className="form-group" style={{ gridColumn: modal === 'add' ? '1/-1' : undefined }}>
                  <label>Email</label>
                  <input className="form-control" type="email" required disabled={modal !== 'add'} value={f.email} onChange={e => set('email', e.target.value)} />
                </div>
                {modal !== 'add' && (
                  <div className="form-group">
                    <label>Status</label>
                    <select className="form-control" value={f.isActive} onChange={e => set('isActive', e.target.value === 'true')}>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label>Department</label>
                  <input className="form-control" required value={f.department} onChange={e => set('department', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <input className="form-control" required value={f.designation} onChange={e => set('designation', e.target.value)} />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Salary (₹)</label>
                  <input className="form-control" type="number" required min="0" value={f.salary} onChange={e => set('salary', e.target.value)} />
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
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>Delete Employee?</div>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
              This will permanently delete <strong style={{ color: 'var(--text)' }}>{deleteTarget.fullName}</strong> and all their tasks.
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

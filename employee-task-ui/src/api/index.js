import axios from 'axios'

const api = axios.create({
  baseURL: 'https://localhost:11961/api'
})

api.interceptors.request.use(cfg => {
  try {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}')

    if (auth.token)
      cfg.headers.Authorization = `Bearer ${auth.token}`

  } catch {}

  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {

    if (err.response?.status === 401) {

      localStorage.removeItem('auth')

      window.location.href = '/login'
    }

    return Promise.reject(err)
  }
)

// Auth
export const authApi = {
  login: dto =>
    api.post('/auth/login', dto).then(r => r.data),

  register: dto =>
    api.post('/auth/register', dto).then(r => r.data),
}

// Employees
export const employeeApi = {
  getAll: params =>
    api.get('/employees', { params }).then(r => r.data),

  getById: id =>
    api.get(`/employees/${id}`).then(r => r.data),

  create: dto =>
    api.post('/employees', dto).then(r => r.data),

  update: (id, dto) =>
    api.put(`/employees/${id}`, dto).then(r => r.data),

  delete: id =>
    api.delete(`/employees/${id}`),
}

// Tasks
export const taskApi = {
  getAll: params =>
    api.get('/tasks', { params }).then(r => r.data),

  getById: id =>
    api.get(`/tasks/${id}`).then(r => r.data),

  create: dto =>
    api.post('/tasks', dto).then(r => r.data),

  update: (id, dto) =>
    api.put(`/tasks/${id}`, dto).then(r => r.data),

  delete: id =>
    api.delete(`/tasks/${id}`),
}

export default api
# Employee & Task Management System

Full-stack app — ASP.NET Core 8 (backend) + React (frontend)

---

## Project Structure

```
EmployeeTaskManager/
├── EmployeeTaskApi/        ← .NET 8 Web API (open in Visual Studio)
│   ├── Controllers/        ← AuthController, EmployeesController, TasksController
│   ├── Services/           ← Business logic layer
│   ├── Repositories/       ← Data access layer (EF Core)
│   ├── Models/             ← Employee, TaskItem, User
│   ├── DTOs/               ← Request/Response objects
│   ├── Middleware/         ← Global exception handling
│   └── Data/               ← AppDbContext (SQL Server)
│
└── employee-task-ui/       ← React + Vite frontend
    └── src/
        ├── pages/          ← Login, Dashboard, Employees, Tasks
        ├── components/     ← Sidebar, StatCard, Pagination
        ├── api/            ← Axios API client
        ├── context/        ← JWT Auth context
        └── hooks/          ← useToast
```

---

## Backend Setup (Visual Studio)

### 1. Prerequisites
- Visual Studio 2022
- .NET 8 SDK
- SQL Server (LocalDB or full)



### 2. Run Migrations (Package Manager Console in Visual Studio)
```
Add-Migration InitialCreate
Update-Database
```
Or via terminal:
```bash
cd EmployeeTaskApi
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 3. Run
Press **F5** in Visual Studio → API runs on `https://localhost:7001`  
Swagger UI: `https://localhost:7001/swagger`

---

## Frontend Setup

### 1. Install dependencies
```bash
cd employee-task-ui
npm install
```

### 2. Check proxy port in vite.config.js
Make sure the port matches your .NET API:
```js
target: 'https://localhost:11961'   
```

### 3. Run
```bash
npm run dev
```
Opens at `http://localhost:5173`

---

## First Login

1. Register an Admin user via Swagger or Postman:
```
POST https://localhost:11961/api/auth/register
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "Admin@123",
  "role": 2        // 0=Employee, 1=Manager, 2=Admin
}
```
2. Login at `http://localhost:5173/login`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login + get token |
| GET | /api/employees | Any role | List employees (paginated) |
| POST | /api/employees | Admin/Manager | Add employee |
| PUT | /api/employees/{id} | Admin/Manager | Update employee |
| DELETE | /api/employees/{id} | Admin only | Delete employee |
| GET | /api/tasks | Any role | List tasks (paginated) |
| POST | /api/tasks | Admin/Manager | Create task |
| PUT | /api/tasks/{id} | Any role | Update task |
| DELETE | /api/tasks/{id} | Admin only | Delete task |

---

## Tech Stack

**Backend:** ASP.NET Core 8 · C# · Entity Framework Core · SQL Server · JWT Auth · BCrypt · Swagger  
**Frontend:** React 18 · Vite · React Router · Axios

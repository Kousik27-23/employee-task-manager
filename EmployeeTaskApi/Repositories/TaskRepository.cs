using EmployeeTaskApi.Data;
using EmployeeTaskApi.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeTaskApi.Repositories;

public interface ITaskRepository
{
    Task<(IEnumerable<TaskItem> Items, int Total)> GetAllAsync(
        int page, int pageSize, int? employeeId, TaskItemStatus? status, TaskPriority? priority);
    Task<TaskItem?> GetByIdAsync(int id);
    Task<IEnumerable<TaskItem>> GetByEmployeeIdAsync(int employeeId);
    Task<TaskItem> CreateAsync(TaskItem task);
    Task<TaskItem> UpdateAsync(TaskItem task);
    Task DeleteAsync(TaskItem task);
}

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _db;
    public TaskRepository(AppDbContext db) => _db = db;

    public async Task<(IEnumerable<TaskItem> Items, int Total)> GetAllAsync(
        int page, int pageSize, int? employeeId, TaskItemStatus? status, TaskPriority? priority)
    {
        var query = _db.Tasks.Include(t => t.Employee).AsQueryable();

        if (employeeId.HasValue)
            query = query.Where(t => t.EmployeeId == employeeId.Value);
        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);
        if (priority.HasValue)
            query = query.Where(t => t.Priority == priority.Value);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }

    public async Task<TaskItem?> GetByIdAsync(int id) =>
        await _db.Tasks.Include(t => t.Employee).FirstOrDefaultAsync(t => t.Id == id);

    public async Task<IEnumerable<TaskItem>> GetByEmployeeIdAsync(int employeeId) =>
        await _db.Tasks.Where(t => t.EmployeeId == employeeId).ToListAsync();

    public async Task<TaskItem> CreateAsync(TaskItem task)
    {
        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();
        return task;
    }

    public async Task<TaskItem> UpdateAsync(TaskItem task)
    {
        _db.Tasks.Update(task);
        await _db.SaveChangesAsync();
        return task;
    }

    public async Task DeleteAsync(TaskItem task)
    {
        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
    }
}

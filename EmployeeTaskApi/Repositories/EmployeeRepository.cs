using EmployeeTaskApi.Data;
using EmployeeTaskApi.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeTaskApi.Repositories;

public interface IEmployeeRepository
{
    Task<(IEnumerable<Employee> Items, int Total)> GetAllAsync(int page, int pageSize, string? department, bool? isActive);
    Task<Employee?> GetByIdAsync(int id);
    Task<Employee?> GetByEmailAsync(string email);
    Task<Employee> CreateAsync(Employee employee);
    Task<Employee> UpdateAsync(Employee employee);
    Task DeleteAsync(Employee employee);
}

public class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _db;
    public EmployeeRepository(AppDbContext db) => _db = db;

    public async Task<(IEnumerable<Employee> Items, int Total)> GetAllAsync(
        int page, int pageSize, string? department, bool? isActive)
    {
        var query = _db.Employees.Include(e => e.Tasks).AsQueryable();

        if (!string.IsNullOrWhiteSpace(department))
            query = query.Where(e => e.Department.ToLower().Contains(department.ToLower()));

        if (isActive.HasValue)
            query = query.Where(e => e.IsActive == isActive.Value);

        var total = await query.CountAsync();
        var items = await query
            .OrderBy(e => e.FullName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }

    public async Task<Employee?> GetByIdAsync(int id) =>
        await _db.Employees.Include(e => e.Tasks).FirstOrDefaultAsync(e => e.Id == id);

    public async Task<Employee?> GetByEmailAsync(string email) =>
        await _db.Employees.FirstOrDefaultAsync(e => e.Email == email);

    public async Task<Employee> CreateAsync(Employee employee)
    {
        _db.Employees.Add(employee);
        await _db.SaveChangesAsync();
        return employee;
    }

    public async Task<Employee> UpdateAsync(Employee employee)
    {
        _db.Employees.Update(employee);
        await _db.SaveChangesAsync();
        return employee;
    }

    public async Task DeleteAsync(Employee employee)
    {
        _db.Employees.Remove(employee);
        await _db.SaveChangesAsync();
    }
}

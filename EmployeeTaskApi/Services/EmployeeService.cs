using EmployeeTaskApi.DTOs;
using EmployeeTaskApi.Models;
using EmployeeTaskApi.Repositories;

namespace EmployeeTaskApi.Services;

public interface IEmployeeService
{
    Task<PagedResult<EmployeeResponseDto>> GetAllAsync(int page, int pageSize, string? department, bool? isActive);
    Task<EmployeeResponseDto> GetByIdAsync(int id);
    Task<EmployeeResponseDto> CreateAsync(CreateEmployeeDto dto);
    Task<EmployeeResponseDto> UpdateAsync(int id, UpdateEmployeeDto dto);
    Task DeleteAsync(int id);
}

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repo;
    public EmployeeService(IEmployeeRepository repo) => _repo = repo;

    public async Task<PagedResult<EmployeeResponseDto>> GetAllAsync(
        int page, int pageSize, string? department, bool? isActive)
    {
        var (items, total) = await _repo.GetAllAsync(page, pageSize, department, isActive);
        return new PagedResult<EmployeeResponseDto>
        {
            Data       = items.Select(MapToDto),
            Page       = page,
            PageSize   = pageSize,
            TotalCount = total
        };
    }

    public async Task<EmployeeResponseDto> GetByIdAsync(int id)
    {
        var emp = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Employee with ID {id} not found.");
        return MapToDto(emp);
    }

    public async Task<EmployeeResponseDto> CreateAsync(CreateEmployeeDto dto)
    {
        var existing = await _repo.GetByEmailAsync(dto.Email);
        if (existing != null)
            throw new InvalidOperationException($"Employee with email '{dto.Email}' already exists.");

        var employee = new Employee
        {
            FullName    = dto.FullName,
            Email       = dto.Email,
            Department  = dto.Department,
            Designation = dto.Designation,
            Salary      = dto.Salary
        };

        var created = await _repo.CreateAsync(employee);
        return MapToDto(created);
    }

    public async Task<EmployeeResponseDto> UpdateAsync(int id, UpdateEmployeeDto dto)
    {
        var emp = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Employee with ID {id} not found.");

        if (dto.FullName    != null) emp.FullName    = dto.FullName;
        if (dto.Department  != null) emp.Department  = dto.Department;
        if (dto.Designation != null) emp.Designation = dto.Designation;
        if (dto.Salary      != null) emp.Salary      = dto.Salary.Value;
        if (dto.IsActive    != null) emp.IsActive    = dto.IsActive.Value;

        var updated = await _repo.UpdateAsync(emp);
        return MapToDto(updated);
    }

    public async Task DeleteAsync(int id)
    {
        var emp = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Employee with ID {id} not found.");
        await _repo.DeleteAsync(emp);
    }

    private static EmployeeResponseDto MapToDto(Employee e) => new()
    {
        Id          = e.Id,
        FullName    = e.FullName,
        Email       = e.Email,
        Department  = e.Department,
        Designation = e.Designation,
        Salary      = e.Salary,
        JoinedAt    = e.JoinedAt,
        IsActive    = e.IsActive,
        TotalTasks  = e.Tasks.Count
    };
}

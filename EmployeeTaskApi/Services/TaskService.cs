using EmployeeTaskApi.DTOs;
using EmployeeTaskApi.Models;
using EmployeeTaskApi.Repositories;

namespace EmployeeTaskApi.Services;

public interface ITaskService
{
    Task<PagedResult<TaskResponseDto>> GetAllAsync(
        int page, int pageSize, int? employeeId, TaskItemStatus? status, TaskPriority? priority);
    Task<TaskResponseDto> GetByIdAsync(int id);
    Task<TaskResponseDto> CreateAsync(CreateTaskDto dto);
    Task<TaskResponseDto> UpdateAsync(int id, UpdateTaskDto dto);
    Task DeleteAsync(int id);
}

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repo;
    private readonly IEmployeeRepository _empRepo;
    public TaskService(ITaskRepository repo, IEmployeeRepository empRepo)
    {
        _repo    = repo;
        _empRepo = empRepo;
    }

    public async Task<PagedResult<TaskResponseDto>> GetAllAsync(
        int page, int pageSize, int? employeeId, TaskItemStatus? status, TaskPriority? priority)
    {
        var (items, total) = await _repo.GetAllAsync(page, pageSize, employeeId, status, priority);
        return new PagedResult<TaskResponseDto>
        {
            Data       = items.Select(MapToDto),
            Page       = page,
            PageSize   = pageSize,
            TotalCount = total
        };
    }

    public async Task<TaskResponseDto> GetByIdAsync(int id)
    {
        var task = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Task with ID {id} not found.");
        return MapToDto(task);
    }

    public async Task<TaskResponseDto> CreateAsync(CreateTaskDto dto)
    {
        var employee = await _empRepo.GetByIdAsync(dto.EmployeeId)
            ?? throw new KeyNotFoundException($"Employee with ID {dto.EmployeeId} not found.");

        var task = new TaskItem
        {
            Title       = dto.Title,
            Description = dto.Description,
            EmployeeId  = dto.EmployeeId,
            Priority    = dto.Priority,
            DueDate     = dto.DueDate
        };

        var created = await _repo.CreateAsync(task);
        created.Employee = employee;
        return MapToDto(created);
    }

    public async Task<TaskResponseDto> UpdateAsync(int id, UpdateTaskDto dto)
    {
        var task = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Task with ID {id} not found.");

        if (dto.Title       != null) task.Title       = dto.Title;
        if (dto.Description != null) task.Description = dto.Description;
        if (dto.Priority    != null) task.Priority    = dto.Priority.Value;
        if (dto.DueDate     != null) task.DueDate     = dto.DueDate.Value;

        if (dto.Status != null)
        {
            task.Status = dto.Status.Value;
            if (dto.Status == TaskItemStatus.Completed)
                task.CompletedAt = DateTime.UtcNow;
        }

        var updated = await _repo.UpdateAsync(task);
        return MapToDto(updated);
    }

    public async Task DeleteAsync(int id)
    {
        var task = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Task with ID {id} not found.");
        await _repo.DeleteAsync(task);
    }

    private static TaskResponseDto MapToDto(TaskItem t) => new()
    {
        Id           = t.Id,
        Title        = t.Title,
        Description  = t.Description,
        Status       = t.Status.ToString(),
        Priority     = t.Priority.ToString(),
        DueDate      = t.DueDate,
        CreatedAt    = t.CreatedAt,
        CompletedAt  = t.CompletedAt,
        EmployeeId   = t.EmployeeId,
        EmployeeName = t.Employee?.FullName ?? string.Empty
    };
}

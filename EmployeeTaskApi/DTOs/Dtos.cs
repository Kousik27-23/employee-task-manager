using System.ComponentModel.DataAnnotations;
using EmployeeTaskApi.Models;

namespace EmployeeTaskApi.DTOs;

// ── Auth ─────────────────────────────────────────────────────────────────

public class RegisterDto
{
    [Required] [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required] [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required] [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.Employee;
}

public class LoginDto
{
    [Required] [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

// ── Employee ─────────────────────────────────────────────────────────────

public class CreateEmployeeDto
{
    [Required] [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required] [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required] [MaxLength(100)]
    public string Department { get; set; } = string.Empty;

    [Required] [MaxLength(100)]
    public string Designation { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal Salary { get; set; }
}

public class UpdateEmployeeDto
{
    [MaxLength(100)]
    public string? FullName { get; set; }

    [MaxLength(100)]
    public string? Department { get; set; }

    [MaxLength(100)]
    public string? Designation { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? Salary { get; set; }

    public bool? IsActive { get; set; }
}

public class EmployeeResponseDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public decimal Salary { get; set; }
    public DateTime JoinedAt { get; set; }
    public bool IsActive { get; set; }
    public int TotalTasks { get; set; }
}

// ── Task ─────────────────────────────────────────────────────────────────

public class CreateTaskDto
{
    [Required] [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Required]
    public int EmployeeId { get; set; }

    public Models.TaskPriority Priority { get; set; } = Models.TaskPriority.Medium;

    [Required]
    public DateTime DueDate { get; set; }
}

public class UpdateTaskDto
{
    [MaxLength(200)]
    public string? Title { get; set; }

    public string? Description { get; set; }

    public Models.TaskItemStatus? Status { get; set; }

    public Models.TaskPriority? Priority { get; set; }

    public DateTime? DueDate { get; set; }
}

public class TaskResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
}

// ── Pagination ────────────────────────────────────────────────────────────

public class PagedResult<T>
{
    public IEnumerable<T> Data { get; set; } = Enumerable.Empty<T>();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}

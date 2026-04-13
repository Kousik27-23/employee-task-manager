using EmployeeTaskApi.DTOs;
using EmployeeTaskApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeTaskApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    public AuthController(IAuthService auth) => _auth = auth;

    /// Register a new user (Admin / Manager / Employee)
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var result = await _auth.RegisterAsync(dto);
        return Ok(result);
    }

    /// Login and receive a JWT token
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _auth.LoginAsync(dto);
        return Ok(result);
    }
}

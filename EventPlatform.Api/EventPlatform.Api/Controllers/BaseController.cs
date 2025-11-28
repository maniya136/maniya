using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventPlatform.Api.Controllers;

[ApiController]
[Authorize] // All derived controllers will require authorization by default
public abstract class BaseController : ControllerBase
{
    protected string? UserEmail => User?.Identity?.Name;
    
    protected string? GetUserId()
    {
        return User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
    
    protected string? GetUserEmail()
    {
        return User?.FindFirst(ClaimTypes.Email)?.Value;
    }
}

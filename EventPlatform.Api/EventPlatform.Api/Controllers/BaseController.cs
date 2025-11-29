using Microsoft.AspNetCore.Mvc;

namespace EventPlatform.Api.Controllers;

[ApiController]
// Base controller without authorization
public abstract class BaseController : ControllerBase
{
    protected string? UserEmail => null;
    
    protected string? GetUserId()
    {
        return null;
    }
    
    protected string? GetUserEmail()
    {
        return null;
    }
}

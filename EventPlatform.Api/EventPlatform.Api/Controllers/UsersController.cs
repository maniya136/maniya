using EventPlatform.Api.Models;
using EventPlatform.Api.Models.Dtos;
using EventPlatform.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using System.ComponentModel.DataAnnotations;
using MongoDB.Driver;
using Microsoft.Extensions.Logging;
using System.Text.RegularExpressions;
using System.Security.Claims;
using System.Linq;

namespace EventPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(UserService userService, ILogger<UsersController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                _logger.LogInformation("Login attempt for email: {Email}", loginDto?.Email);
            
                if (loginDto == null || string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
                {
                    return BadRequest(new { success = false, message = "Email and password are required" });
                }

                var email = loginDto.Email.Trim().ToLower();
                var user = await _userService.GetByEmailAsync(email);

                if (user == null)
                {
                    _logger.LogWarning("Login failed - user not found: {Email}", email);
                    return Unauthorized(new { success = false, message = "Invalid email or password" });
                }

                var inputPasswordHash = HashPassword(loginDto.Password);
                if (!string.Equals(user.Password, inputPasswordHash, StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogWarning("Login failed - invalid password for: {Email}", email);
                    return Unauthorized(new { success = false, message = "Invalid email or password" });
                }

                _logger.LogInformation("User logged in successfully: {Email}", email);

                return Ok(new
                {
                    success = true,
                    message = "Login successful",
                    user = new
                    {
                        id = user.Id,
                        userId = user.UserId,
                        name = user.Name,
                        email = user.Email,
                        phone = user.Phone,
                        role = user.Role
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for email: {Email}", loginDto?.Email);
                return StatusCode(500, new { success = false, message = "An error occurred during login" });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerUserDto)
        {
            try
            {
                _logger.LogInformation("Registration request received for email: {Email}", registerUserDto?.Email);
                
                // Validate input
                if (registerUserDto == null)
                {
                    _logger.LogWarning("Registration failed - Invalid request data");
                    return BadRequest(new { success = false, message = "Invalid request data" });
                }

                // Validate email format
                if (!IsValidEmail(registerUserDto.Email))
                {
                    _logger.LogWarning("Registration failed - Invalid email format: {Email}", registerUserDto.Email);
                    return BadRequest(new { success = false, message = "Invalid email format" });
                }
                
                // Validate password strength
                if (string.IsNullOrWhiteSpace(registerUserDto.Password) || registerUserDto.Password.Length < 6)
                {
                    _logger.LogWarning("Registration failed - Password must be at least 6 characters long");
                    return BadRequest(new { success = false, message = "Password must be at least 6 characters long" });
                }

                // Check if email already exists
                var existingUser = await _userService.GetByEmailAsync(registerUserDto.Email.Trim().ToLower());
                if (existingUser != null)
                {
                    _logger.LogWarning("Registration failed - Email already exists: {Email}", registerUserDto.Email);
                    return BadRequest(new { success = false, message = "Email already exists" });
                }

                // Create new user with all fields
                var user = new User
                {
                    Name = registerUserDto.Name?.Trim() ?? throw new ArgumentException("Name is required"),
                    Email = registerUserDto.Email.Trim().ToLower(),
                    Password = HashPassword(registerUserDto.Password),
                    Phone = registerUserDto.Phone?.Trim(),
                    Gender = registerUserDto.Gender,
                    DateOfBirth = registerUserDto.DateOfBirth,
                    Address = registerUserDto.Address?.Trim(),
                    City = registerUserDto.City?.Trim(),
                    Role = "User", // default role
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var createdUser = await _userService.CreateAsync(user);
                _logger.LogInformation("User registered successfully: {Email} (ID: {UserId})", user.Email, createdUser.Id);
                
                // Return success response with user data (without password)
                return Ok(new 
                { 
                    success = true,
                    message = "Registration successful",
                    user = new 
                    {
                        id = createdUser.Id,
                        name = createdUser.Name,
                        email = createdUser.Email,
                        phone = createdUser.Phone,
                        gender = createdUser.Gender,
                        dateOfBirth = createdUser.DateOfBirth,
                        address = createdUser.Address,
                        city = createdUser.City,
                        createdAt = createdUser.CreatedAt
                    }
                });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Registration validation error");
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration");
                return StatusCode(500, new { success = false, message = "An error occurred while registering the user." });
            }
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                // In a real application, you would get the current user's ID from the JWT token
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    // For testing, you can use a header as fallback
                    userId = Request.Headers["X-User-Id"].FirstOrDefault();
                }
                
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { success = false, message = "User not authenticated" });
                }

                var user = await _userService.GetByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { success = false, message = "User not found" });
                }

                return Ok(new 
                { 
                    success = true,
                    user = new 
                    {
                        id = user.Id,
                        userId = user.UserId,
                        name = user.Name,
                        email = user.Email,
                        phone = user.Phone,
                        gender = user.Gender,
                        dateOfBirth = user.DateOfBirth,
                        address = user.Address,
                        city = user.City,
                        role = user.Role,
                        createdAt = user.CreatedAt,
                        updatedAt = user.UpdatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving current user");
                return StatusCode(500, new { success = false, message = "An error occurred while retrieving user data" });
            }
        }

        [HttpGet("events/{userId}")]
        public async Task<IActionResult> GetUserEvents(int userId)
        {
            try
            {
                // In a real application, you would verify that the current user has permission to view these events
                var eventTypes = await _userService.GetUserEventsAsync(userId);
                
                return Ok(new 
                { 
                    success = true,
                    count = eventTypes.Count,
                    eventTypes = eventTypes.Select(et => new
                    {
                        id = et.Id,
                        eventTypeId = et.EventTypeId,
                        eventTypeName = et.EventTypeName
                    })
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving events for user ID: {UserId}", userId);
                return StatusCode(500, new { success = false, message = "An error occurred while retrieving user events" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserUpdateDto userUpdateDto)
        {
            try
            {
                if (userUpdateDto == null)
                {
                    return BadRequest(new { success = false, message = "Invalid request data" });
                }

                // In a real application, verify that the current user has permission to update this profile
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    // For testing, you can use a header as fallback
                    currentUserId = Request.Headers["X-User-Id"].FirstOrDefault();
                }

                if (!string.Equals(currentUserId, id, StringComparison.OrdinalIgnoreCase))
                {
                    return Forbid();
                }

                var updated = await _userService.UpdateUserAsync(id, userUpdateDto);
                if (!updated)
                {
                    return NotFound(new { success = false, message = "User not found" });
                }

                return Ok(new 
                { 
                    success = true,
                    message = "User updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user with ID: {UserId}", id);
                return StatusCode(500, new { success = false, message = "An error occurred while updating the user" });
            }
        }

        [HttpGet("{userId:int}")]
        public async Task<IActionResult> GetUser(int userId)
        {
            try
            {
                var user = await _userService.GetByUserIdAsync(userId);
               
                if (user == null)
                {
                    return NotFound(new { success = false, message = "User not found" });
                }

                return Ok(new 
                { 
                    success = true,
                    user = new 
                    {
                        id = user.Id,
                        userId = user.UserId,
                        name = user.Name,
                        email = user.Email,
                        phone = user.Phone,
                        gender = user.Gender,
                        dateOfBirth = user.DateOfBirth,
                        address = user.Address,
                        city = user.City,
                        role = user.Role,
                        createdAt = user.CreatedAt,
                        updatedAt = user.UpdatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user with UserId: {UserId}", userId);
                return StatusCode(500, new { success = false, message = "An error occurred while retrieving the user." });
            }
        }

        private string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
                throw new ArgumentException("Password cannot be empty", nameof(password));
                
            try
            {
                using var sha256 = SHA256.Create();
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error hashing password");
                throw new ApplicationException("Error processing password", ex);
            }
        }
        
        private bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;
                
            try
            {
                // Simple email validation
                return Regex.IsMatch(email, 
                    @"^[^@\s]+@[^@\s]+\.[^@\s]+$", 
                    RegexOptions.IgnoreCase, 
                    TimeSpan.FromMilliseconds(250));
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
        }
    }
}
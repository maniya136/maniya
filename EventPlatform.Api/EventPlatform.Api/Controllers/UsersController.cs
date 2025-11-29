using EventPlatform.Api.Models;
using EventPlatform.Api.Models.Dtos;
using EventPlatform.Api.Repositories;
using EventPlatform.Api.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace EventPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserRepository userRepository, ILogger<UsersController> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        // -----------------------------------------
        // LOGIN
        // -----------------------------------------
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null)
                return BadRequest(new { success = false, message = "Invalid request" });

            _logger.LogInformation("Login attempt for: {Email}", loginDto.Email);

            if (string.IsNullOrWhiteSpace(loginDto.Email) ||
                string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return BadRequest(new { success = false, message = "Email and password required" });
            }

            var email = loginDto.Email.Trim().ToLower();
            var user = await _userRepository.GetByEmailAsync(email);

            if (user == null)
                return Unauthorized(new { success = false, message = "Invalid email or password" });

            // Compare hashed passwords
            var hashed = HashPassword(loginDto.Password);
            if (!string.Equals(user.Password, hashed, StringComparison.OrdinalIgnoreCase))
            {
                return Unauthorized(new { success = false, message = "Invalid email or password" });
            }

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

        // -----------------------------------------
        // REGISTER
        // -----------------------------------------
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
        {
            if (dto == null)
                return BadRequest(new { success = false, message = "Invalid request" });

            if (!IsValidEmail(dto.Email))
                return BadRequest(new { success = false, message = "Invalid email" });

            if (string.IsNullOrEmpty(dto.Password) || dto.Password.Length < 6)
                return BadRequest(new { success = false, message = "Password must be at least 6 characters" });

            var existing = await _userRepository.GetByEmailAsync(dto.Email.Trim().ToLower());
            if (existing != null)
                return BadRequest(new { success = false, message = "Email already exists" });

            var user = new User
            {
                Name = dto.Name?.Trim(),
                Email = dto.Email.Trim().ToLower(),
                Password = HashPassword(dto.Password),
                Phone = dto.Phone?.Trim(),
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth,
                Address = dto.Address?.Trim(),
                City = dto.City?.Trim(),
                Role = "User",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await _userRepository.CreateAsync(user);

            return Ok(new
            {
                success = true,
                message = "Registration successful",
                user = new
                {
                    id = result.Id,
                    name = result.Name,
                    email = result.Email,
                    phone = result.Phone,
                    gender = result.Gender,
                    dateOfBirth = result.DateOfBirth,
                    address = result.Address,
                    city = result.City,
                    createdAt = result.CreatedAt
                }
            });
        }

        // -----------------------------------------
        // GET CURRENT USER
        // -----------------------------------------
        [HttpGet("me")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCurrentUser()
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? Request.Headers["X-User-Id"].FirstOrDefault();

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { success = false, message = "User not authenticated" });

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return NotFound(new { success = false, message = "User not found" });

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

        // -----------------------------------------
        // GET ALL USERS (ADMIN ONLY)
        // -----------------------------------------
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userRepository.GetAllUsersAsync();
                return Ok(new
                {
                    success = true,
                    count = users.Count(),
                    users = users.Select(u => new
                    {
                        id = u.Id,
                        userId = u.UserId,
                        name = u.Name,
                        email = u.Email,
                        phone = u.Phone,
                        role = u.Role,
                        createdAt = u.CreatedAt
                    })
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users");
                return StatusCode(500, new { success = false, message = "An error occurred while getting users" });
            }
        }

        // -----------------------------------------
        // GET USER BY USER ID (INT)
        // -----------------------------------------
        [HttpGet("{userId:int}")]
        public async Task<IActionResult> GetUser(int userId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            
            // If user is not authenticated
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized(new { success = false, message = "Authentication required" });

            var user = await _userRepository.GetByUserIdAsync(userId);
            if (user == null)
                return NotFound(new { success = false, message = "User not found" });

            // If user is not admin and trying to access another user's data
            if (!isAdmin && currentUserId != user.Id)
            {
                return Forbid("You don't have permission to access this resource");
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
                    role = user.Role,
                    createdAt = user.CreatedAt,
                    updatedAt = user.UpdatedAt
                }
            });
        }

        // -----------------------------------------
        // UPDATE USER
        // -----------------------------------------
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserUpdateDto dto)
        {
            if (dto == null)
                return BadRequest(new { success = false, message = "Invalid request" });

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                                ?? Request.Headers["X-User-Id"].FirstOrDefault();

            if (string.IsNullOrEmpty(currentUserId) || currentUserId != id)
                return Forbid();

            bool updated = await _userRepository.UpdateUserAsync(id, dto);

            if (!updated)
                return NotFound(new { success = false, message = "User not found" });

            return Ok(new { success = true, message = "User updated successfully" });
        }

        // -----------------------------------------
        // HELPER: PASSWORD HASHING
        // -----------------------------------------
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(bytes).Replace("-", "").ToLower();
        }

        // -----------------------------------------
        // HELPER: MAP USER TO DTO
        // -----------------------------------------
        private object MapToDto(User user)
        {
            if (user == null) return null;

            return new
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
            };
        }

        // -----------------------------------------
        // HELPER: EMAIL VALIDATION
        // -----------------------------------------
        private bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                // Simple regex for basic email validation
                return Regex.IsMatch(email,
                    @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                    RegexOptions.IgnoreCase);
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
        }
    }
}

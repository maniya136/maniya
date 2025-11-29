using System;
using System.ComponentModel.DataAnnotations;

namespace EventPlatform.Api.Models.Dtos
{
    public class UserDto
    {
        public string? Id { get; set; }
        public int UserId { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address format")]
        [StringLength(100, ErrorMessage = "Email cannot be longer than 100 characters")]
        public string Email { get; set; } = string.Empty;

        [StringLength(20, ErrorMessage = "Phone number cannot be longer than 20 characters")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        public string? Phone { get; set; }

        [StringLength(10, ErrorMessage = "Gender cannot be longer than 10 characters")]
        public string? Gender { get; set; }

        [DataType(DataType.Date)]
        public DateTime? DateOfBirth { get; set; }

        [StringLength(200, ErrorMessage = "Address cannot be longer than 200 characters")]
        public string? Address { get; set; }

        [StringLength(100, ErrorMessage = "City name cannot be longer than 100 characters")]
        public string? City { get; set; }

        [StringLength(50, ErrorMessage = "Role cannot be longer than 50 characters")]
        public string Role { get; set; } = "User";
    }
}

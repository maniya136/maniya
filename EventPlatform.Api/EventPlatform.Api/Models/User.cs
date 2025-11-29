using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EventPlatform.Api.Models
{
    [BsonIgnoreExtraElements]
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("userId")]
        public int UserId { get; set; }

        [BsonElement("name")]
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("email")]
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address format")]
        [StringLength(100, ErrorMessage = "Email cannot be longer than 100 characters")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("password")]
        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long")]
        [JsonIgnore] // Don't include password in JSON responses
        public string Password { get; set; } = string.Empty;

        [BsonElement("phone")]
        [StringLength(20, ErrorMessage = "Phone number cannot be longer than 20 characters")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        public string? Phone { get; set; }

        [BsonElement("gender")]
        [StringLength(10, ErrorMessage = "Gender cannot be longer than 10 characters")]
        public string? Gender { get; set; }

        [BsonElement("dateOfBirth")]
        [DataType(DataType.Date)]
        public DateTime? DateOfBirth { get; set; }

        [BsonElement("city")]
        [StringLength(100, ErrorMessage = "City name cannot be longer than 100 characters")]
        public string? City { get; set; }

        [BsonElement("address")]
        [StringLength(200, ErrorMessage = "Address cannot be longer than 200 characters")]
        public string? Address { get; set; }

        [BsonElement("role")]
        [StringLength(50, ErrorMessage = "Role cannot be longer than 50 characters")]
        [Required(ErrorMessage = "Role is required")]
        public string Role { get; set; } = "User";  // Default role

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime? UpdatedAt { get; set; }
    }
}

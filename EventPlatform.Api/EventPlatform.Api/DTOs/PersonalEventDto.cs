using System;
using System.ComponentModel.DataAnnotations;

namespace EventPlatform.Api.DTOs
{
    public class CreatePersonalEventDto
    {
        [Required(ErrorMessage = "User ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "User ID must be a positive number")]
        public int UserId { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public DateTime StartDateTime { get; set; }
        
        public DateTime? EndDateTime { get; set; }
        
        [Required]
        public string Location { get; set; } = string.Empty;
        
        [Required]
        public int EventTypeId { get; set; }
        
        [Required(ErrorMessage = "At least one service is required")]
        [MinLength(1, ErrorMessage = "At least one service is required")]
        public List<int> ServiceIds { get; set; } = new List<int>();
        
        public string? Status { get; set; } = "Planned";
        public string? VendorId { get; set; }
    }

    public class UpdatePersonalEventDto
    {
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Start date/time is required")]
        public DateTime StartDateTime { get; set; }
        
        public DateTime? EndDateTime { get; set; }
        
        [Required(ErrorMessage = "Location is required")]
        public string Location { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Event type ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Event type ID must be a positive number")]
        public int EventTypeId { get; set; }
        
        [Required(ErrorMessage = "At least one service is required")]
        [MinLength(1, ErrorMessage = "At least one service is required")]
        public List<int> ServiceIds { get; set; } = new List<int>();
        
        public string? Status { get; set; }
        public string? VendorId { get; set; }
    }

    public class PersonalEventResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public int PersonalEventId { get; set; }
        [Required]
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public string Location { get; set; } = string.Empty;
        public int EventTypeId { get; set; }
        public List<int> ServiceIds { get; set; } = new List<int>();
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string Status { get; set; } = "Planned";
        public string? VendorId { get; set; }
    }
}

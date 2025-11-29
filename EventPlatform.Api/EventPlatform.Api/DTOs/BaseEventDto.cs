using System;
using System.ComponentModel.DataAnnotations;

namespace EventPlatform.Api.DTOs
{
    public abstract class BaseEventDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public DateTime StartDateTime { get; set; }
        
        public DateTime? EndDateTime { get; set; }
        
        [Required]
        public string Location { get; set; } = string.Empty;
        
        [Required]
        public int EventTypeId { get; set; }
        
        [Required]
        public int ServiceId { get; set; }
        
        public string? Status { get; set; }
        public int? MaxAttendees { get; set; }
        public bool? IsPublic { get; set; }
        public List<string>? Tags { get; set; }
        public string? ImageUrl { get; set; }
        public decimal? Price { get; set; }
        public string? Category { get; set; }
    }
}

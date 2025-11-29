using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using EventPlatform.Api.Validation;

    public class EventDtos
    {
    // ---------- CustomEvent DTOs ----------
    public class CreateCustomEventDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        [FutureDate(ErrorMessage = "Start date must be in the future")]
        public DateTime StartDateTime { get; set; }

        public DateTime? EndDateTime { get; set; } // optional

        [Required]
        public string Location { get; set; } = string.Empty;

        // User ID will be set from the authenticated user's token
        [Required]
        public string UserId { get; set; } = string.Empty;

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

    public class UpdateCustomEventDto
    {
        // All properties optional for partial update
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? StartDateTime { get; set; } // optional
        public DateTime? EndDateTime { get; set; } // optional
        public string? Location { get; set; }
        public int? EventTypeId { get; set; }
        public int? ServiceId { get; set; }
        public string? Status { get; set; }
        public int? MaxAttendees { get; set; }
        public bool? IsPublic { get; set; }
        public List<string>? Tags { get; set; }
        public string? ImageUrl { get; set; }
        public decimal? Price { get; set; }
        public string? Category { get; set; }
    }

    public class CustomEventResponseDto
    {
        public string? Id { get; set; }
        public int CustomEventId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public string Location { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public int EventTypeId { get; set; }
        public int ServiceId { get; set; }
        public string Status { get; set; } = string.Empty;
        public int? MaxAttendees { get; set; }
        public bool IsPublic { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public string? ImageUrl { get; set; }
        public decimal? Price { get; set; }
        public string? Category { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    // ---------- PersonalEvent DTOs ----------
    public class CreatePersonalEventDto
    {
        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public int EventTypeId { get; set; }

        [Required]
        public int ServiceId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime StartDateTime { get; set; }

        [Required]
        public DateTime EndDateTime { get; set; }

        [Required]
        public string Location { get; set; } = string.Empty;

        public string? Status { get; set; }
        public string? VendorId { get; set; }
    }

    public class PersonalEventResponseDto
    {
        public string? Id { get; set; }
        public int PersonalEventId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int EventTypeId { get; set; }
        public int ServiceId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public string Location { get; set; } = string.Empty;
        public string? Status { get; set; }
        public string? VendorId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}


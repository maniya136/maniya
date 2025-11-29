using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EventPlatform.Api.DTOs
{
    public class CreateCustomEventDto : BaseEventDto
    {
        // Can be either MongoDB ObjectId (string) or integer ID
        [Required]
        public string UserId { get; set; } = string.Empty;
    }

    public class CustomEventResponseDto : BaseEventDto
    {
        public string Id { get; set; } = string.Empty;
        public int CustomEventId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}

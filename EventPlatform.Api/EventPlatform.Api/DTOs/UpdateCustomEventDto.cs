using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EventPlatform.Api.DTOs
{
    public class UpdateCustomEventDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public string? Location { get; set; }
        public int EventTypeId { get; set; }
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

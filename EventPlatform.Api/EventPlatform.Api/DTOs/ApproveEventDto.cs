using System.ComponentModel.DataAnnotations;

namespace EventPlatform.Api.DTOs
{
    public class ApproveEventDto
    {
        [Required]
        public string EventId { get; set; } = string.Empty;
        
        [Required]
        public string ApprovedById { get; set; } = string.Empty;
        
        public string? Comments { get; set; }
        
        public bool IsApproved { get; set; } = true;
    }
}

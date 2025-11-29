using System.ComponentModel.DataAnnotations;

namespace EventPlatform.Api.DTOs
{
    public class ServiceSelectionDto
    {
        [Required(ErrorMessage = "At least one service ID is required")]
        [MinLength(1, ErrorMessage = "At least one service ID is required")]
        public List<int> ServiceIds { get; set; } = new List<int>();
    }
}

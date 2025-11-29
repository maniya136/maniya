using System;
using System.ComponentModel.DataAnnotations;

namespace EventPlatform.Api.Models.Dtos
{
    public class UserUpdateDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string Phone { get; set; } = string.Empty;
        
        public string Gender { get; set; } = string.Empty;
        
        public DateTime? DateOfBirth { get; set; }
        
        public string Address { get; set; } = string.Empty;
        
        public string City { get; set; } = string.Empty;
    }
}

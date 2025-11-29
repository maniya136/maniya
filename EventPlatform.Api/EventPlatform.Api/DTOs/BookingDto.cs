using System.ComponentModel.DataAnnotations;

namespace EventPlatform.Api.DTOs
{
    public class CreateBookingDto
    {
        [Required]
        public int EventId { get; set; }
        
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "At least one ticket is required")]
        public int NumberOfTickets { get; set; }
    }

    public class BookingResponseDto
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public int UserId { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public DateTime BookingDate { get; set; }
        public List<int> TicketIds { get; set; } = new List<int>();
    }
}

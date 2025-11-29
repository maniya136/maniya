using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace EventPlatform.Api.Models
{
    public class Ticket
    {
        [BsonId]
        [BsonRepresentation(BsonType.Int32)]
        public int Id { get; set; }

        [Required]
        [BsonElement("bookingId")]
        public int BookingId { get; set; }

        [Required]
        [BsonElement("eventId")]
        public int EventId { get; set; }

        [Required]
        [BsonElement("userId")]
        public int UserId { get; set; }

        [Required]
        [BsonElement("ticketType")]
        public string TicketType { get; set; }

        [Required]
        [BsonElement("price")]
        public decimal Price { get; set; }

        [Required]
        [BsonElement("status")]
        public string Status { get; set; } = "Valid";

        [Required]
        [BsonElement("ticketNumber")]
        public string TicketNumber { get; set; }

        [BsonElement("usedAt")]
        public DateTime? UsedAt { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime? UpdatedAt { get; set; }
    }

    public class TicketValidationRequest
    {
        [Required]
        public string TicketNumber { get; set; }

        [Required]
        public int EventId { get; set; }
    }

    public class TicketValidationResponse
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }
        public TicketDetails Ticket { get; set; }
    }

    public class TicketDetails
    {
        public int Id { get; set; }  // FIXED: int instead of string
        public string TicketNumber { get; set; }
        public string TicketType { get; set; }
        public string Status { get; set; }
        public int EventId { get; set; }
        public int UserId { get; set; }
        public DateTime? UsedAt { get; set; }
    }
}

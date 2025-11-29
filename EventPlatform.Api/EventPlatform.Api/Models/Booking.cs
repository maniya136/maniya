using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EventPlatform.Api.Models
{
    public class Booking
    {
        [BsonId]
        [BsonRepresentation(BsonType.Int32)]
        public int Id { get; set; }

        [Required]
        [BsonElement("eventId")]
        public int EventId { get; set; }

        [Required]
        [BsonElement("userId")]
        public int UserId { get; set; }

        [Required]
        [BsonElement("bookingDate")]
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;

        [Required]
        [BsonElement("status")]
        public string Status { get; set; } = "Confirmed"; // Confirmed, Cancelled, Completed

        [Required]
        [BsonElement("totalAmount")]
        public decimal TotalAmount { get; set; }

        [BsonElement("ticketIds")]
        public List<int> TicketIds { get; set; } = new List<int>();

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime? UpdatedAt { get; set; }
    }
}

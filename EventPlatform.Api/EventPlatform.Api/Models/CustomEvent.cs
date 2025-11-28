using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace EventPlatform.Api.Models
{
    public class CustomEvent
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("customEventId")]
        public int CustomEventId { get; set; }
        
        [BsonElement("title")]
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;
        
        [BsonElement("startDateTime")]
        [Required]
        public DateTime StartDateTime { get; set; }
        
        [BsonElement("endDateTime")]
        public DateTime? EndDateTime { get; set; }
        
        [BsonElement("location")]
        [Required]
        public string Location { get; set; } = string.Empty;
        
        [BsonElement("createdBy")]
        [Required]
        public string CreatedBy { get; set; } = string.Empty;
        
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [BsonElement("updatedAt")]
        public DateTime? UpdatedAt { get; set; }
        
        [BsonElement("status")]
        public string Status { get; set; } = "Draft"; // Draft, Published, Cancelled, Completed
        
        [BsonElement("maxAttendees")]
        public int? MaxAttendees { get; set; }
        
        [BsonElement("isPublic")]
        public bool IsPublic { get; set; } = true;
        
        [BsonElement("tags")]
        public List<string> Tags { get; set; } = new List<string>();
        
        [BsonElement("imageUrl")]
        public string? ImageUrl { get; set; }
        
        [BsonElement("price")]
        public decimal? Price { get; set; }
        
        [BsonElement("category")]
        public string? Category { get; set; } // e.g., Concert, Workshop, Conference, etc.
    }
}

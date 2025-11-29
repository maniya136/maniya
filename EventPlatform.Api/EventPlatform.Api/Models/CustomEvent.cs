using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EventPlatform.Api.Models
{
    public class CustomEvent
    {
        [BsonId]
        [BsonRepresentation(BsonType.Int32)]
        public int Id { get; set; }
        
        [BsonElement("createdBy")]
        public string? CreatedBy { get; set; }

        [BsonElement("customEventId")]
        public int CustomEventId { get; set; }
        
        [BsonElement("title")]
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;
        
        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;
        
        [BsonElement("startDateTime")]
        [Required(ErrorMessage = "Start date/time is required")]
        public DateTime StartDateTime { get; set; }
        
        [BsonElement("endDateTime")]
        public DateTime? EndDateTime { get; set; }
        
        [BsonElement("location")]
        [Required(ErrorMessage = "Location is required")]
        public string Location { get; set; } = string.Empty;
        
        [BsonElement("userId")]
        [Required(ErrorMessage = "User ID is required")]
        public int UserId { get; set; }
        
        [BsonElement("eventTypeId")]
        [Required(ErrorMessage = "Event type ID is required")]
        public int EventTypeId { get; set; }
        
        [BsonElement("serviceId")]
        [Required(ErrorMessage = "Service ID is required")]
        public int ServiceId { get; set; }
        
        [BsonElement("createdAt")]
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
        
        [BsonElement("updatedAt")]
        public DateTime? UpdatedAt { get; set; }
        
        [BsonElement("adminId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? AdminId { get; set; }
        
        [BsonElement("vendorId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? VendorId { get; set; }
        
        [BsonElement("status")]
        public string Status { get; set; } = "PendingAdminApproval";
        
        [BsonElement("maxAttendees")]
        public int? MaxAttendees { get; set; }
        
        [BsonElement("isPublic")]
        public bool IsPublic { get; set; } = true;
        
        [BsonElement("tags")]
        public List<string> Tags { get; set; } = new List<string>();
        
        [BsonElement("imageUrl")]
        public string? ImageUrl { get; set; }
        
        [BsonElement("price")]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be a positive number")]
        public decimal? Price { get; set; }
        
        [BsonElement("category")]
        public string? Category { get; set; }
    }
}
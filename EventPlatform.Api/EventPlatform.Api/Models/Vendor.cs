using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EventPlatform.Api.Models
{
    public class Vendor
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("vendorId")]
        public int VendorId { get; set; }
        
        [BsonElement("name")]
        public string Name { get; set; }
        
        [BsonElement("description")]
        public string Description { get; set; }
        
        [BsonElement("serviceTypes")]
        public List<string> ServiceTypes { get; set; } = new List<string>();
        
        [BsonElement("contactEmail")]
        public string ContactEmail { get; set; }
        
        [BsonElement("contactPhone")]
        public string ContactPhone { get; set; }
        
        [BsonElement("isActive")]
        public bool IsActive { get; set; } = true;
        
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [BsonElement("updatedAt")]
        public DateTime? UpdatedAt { get; set; }
        
        [BsonElement("rating")]
        public double Rating { get; set; } = 0;
        
        [BsonElement("totalRatings")]
        public int TotalRatings { get; set; } = 0;
    }
}

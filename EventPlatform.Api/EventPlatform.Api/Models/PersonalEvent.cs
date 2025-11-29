using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace EventPlatform.Api.Models
{
    public class PersonalEvent
    {
        private const string CounterCollectionName = "counters";
        private const string PersonalEventCounterId = "personalEventId";
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("personalEventId")]
        public int PersonalEventId { get; set; }
        
        [BsonElement("userId")]
        [Required]
        [BsonRepresentation(BsonType.Int32)]
        public int UserId { get; set; }
        
        [BsonElement("eventTypeId")]
        [Required]
        [BsonRepresentation(BsonType.Int32)]
        public int EventTypeId { get; set; }
        
        [BsonElement("serviceIds")]
        [Required]
        [BsonRepresentation(BsonType.Array)]
        public List<int> ServiceIds { get; set; } = new List<int>();
        
        [BsonElement("title")]
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [BsonElement("description")]
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [BsonElement("startDateTime")]
        public DateTime StartDateTime { get; set; }
        
        [BsonElement("endDateTime")]
        public DateTime EndDateTime { get; set; }
        
        [BsonElement("location")]
        [Required]
        public string Location { get; set; } = string.Empty;
        
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [BsonElement("updatedAt")]
        public DateTime? UpdatedAt { get; set; }
        
        [BsonElement("status")]
        public string Status { get; set; } = "Planned"; // Planned, In Progress, Completed, Cancelled
        
        [BsonElement("vendorId")]
        public string? VendorId { get; set; } // Reference to Vendor if any
        
        [BsonElement("serviceType")]
        [Obsolete("This property is deprecated. Use ServiceId instead.")]
        public string? ServiceType { get; set; } // Deprecated: Keeping for backward compatibility

        public static async Task<int> GetNextPersonalEventId(IMongoDatabase database)
        {
            var counters = database.GetCollection<CounterDocument>("counters");
            var filter = Builders<CounterDocument>.Filter.Eq("_id", "personalEventId");
            var update = Builders<CounterDocument>.Update.Inc("seq", 1);
            var options = new FindOneAndUpdateOptions<CounterDocument>
            {
                IsUpsert = true,
                ReturnDocument = ReturnDocument.After
            };

            var result = await counters.FindOneAndUpdateAsync(filter, update, options);
            return result.SequenceValue;
        }
        
        // Helper method to check if event contains a specific service
        public bool HasService(int serviceId)
        {
            return ServiceIds.Contains(serviceId);
        }
    }

    internal class CounterDocument
    {
        [BsonId]
        public string Id { get; set; } = string.Empty;
        [BsonElement("seq")]
        public int SequenceValue { get; set; } = 0;
    }
}

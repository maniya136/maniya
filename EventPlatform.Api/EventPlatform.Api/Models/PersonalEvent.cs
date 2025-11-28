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
        public string UserId { get; set; } = string.Empty;
        
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
        public string? ServiceType { get; set; } // e.g., "decoration", "catering", etc.

        public static async Task<int> GetNextPersonalEventId(IMongoDatabase database)
        {
            var filter = Builders<CounterDocument>.Filter.Eq(x => x.Id, PersonalEventCounterId);
            var update = Builders<CounterDocument>.Update.Inc(x => x.SequenceValue, 1);
            var options = new FindOneAndUpdateOptions<CounterDocument>
            {
                ReturnDocument = ReturnDocument.After,
                IsUpsert = true
            };

            var counter = await database.GetCollection<CounterDocument>(CounterCollectionName)
                .FindOneAndUpdateAsync(filter, update, options);

            return counter?.SequenceValue ?? 0;
        }
    }

    internal class CounterDocument
    {
        [BsonId]
        public string Id { get; set; } = string.Empty;
        public int SequenceValue { get; set; } = 0;
    }
}

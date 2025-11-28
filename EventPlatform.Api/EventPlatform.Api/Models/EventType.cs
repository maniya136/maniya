using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EventPlatform.Api.Models
{
    public class EventType
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonIgnoreIfDefault]
        public string? Id { get; set; }

        public int EventTypeId { get; set; }

        public string EventTypeName { get; set; } = string.Empty;
    }
}

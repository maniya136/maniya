using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EventPlatform.Api.Models
{
    public class Service
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonIgnoreIfDefault]
        public string? Id { get; set; }

        public int ServiceId { get; set; }

        public string ServiceName { get; set; } = string.Empty;

        public int EventTypeId { get; set; }
    }
}

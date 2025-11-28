using MongoDB.Bson.Serialization.Attributes;

namespace EventPlatform.Api.Models
{
    public class Counter
    {
        [BsonId]
        [BsonElement("_id")]
        public string Id { get; set; } = string.Empty;

        [BsonElement("sequence_value")]
        public int SequenceValue { get; set; }
    }
}

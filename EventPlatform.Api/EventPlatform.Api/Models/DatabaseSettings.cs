namespace EventPlatform.Api.Models
{
    public class DatabaseSettings
    {
        public string ConnectionString { get; set; } = "mongodb://localhost:27017";
        public string DatabaseName { get; set; } = "event_platform";
        public string PersonalEventsCollectionName { get; set; } = "PersonalEvents";
        public string VendorsCollectionName { get; set; } = "Vendors";
        public string CustomEventsCollectionName { get; set; } = "CustomEvents";
    }
}

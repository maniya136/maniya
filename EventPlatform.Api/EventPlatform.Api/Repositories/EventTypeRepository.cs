using EventPlatform.Api.Models;
using EventPlatform.Api.Repositories.Interfaces;
using MongoDB.Driver;

namespace EventPlatform.Api.Repositories
{
    public class EventTypeRepository : IEventTypeRepository
    {
        private readonly IMongoCollection<EventType> _eventTypes;
        private readonly IMongoCollection<Counter> _counters;

        public EventTypeRepository(IMongoDatabase database)
        {
            _eventTypes = database.GetCollection<EventType>("EventTypes");
            _counters = database.GetCollection<Counter>("counters");    
        }

        // Auto increment
        private async Task<int> GetNextSequenceValue(string name)
        {
            var result = await _counters.FindOneAndUpdateAsync(
                Builders<Counter>.Filter.Eq(c => c.Id, name),
                Builders<Counter>.Update.Inc(c => c.SequenceValue, 1),
                new FindOneAndUpdateOptions<Counter>
                {
                    ReturnDocument = ReturnDocument.After,
                    IsUpsert = true
                });

            return result.SequenceValue;
        }

        // CREATE
        public async Task CreateAsync(EventType type)
        {
            type.EventTypeId = await GetNextSequenceValue("eventTypeId");
            await _eventTypes.InsertOneAsync(type);
        }

        // GET ALL
        public async Task<List<EventType>> GetAllAsync()
        {
            return await _eventTypes.Find(_ => true).ToListAsync();
        }

        // GET BY ID
        public async Task<EventType?> GetByIdAsync(int eventTypeId)
        {
            return await _eventTypes.Find(x => x.EventTypeId == eventTypeId).FirstOrDefaultAsync();
        }

        // UPDATE
        public async Task UpdateAsync(int eventTypeId, EventType type)
        {
            var filter = Builders<EventType>.Filter.Eq(x => x.EventTypeId, eventTypeId);
            var update = Builders<EventType>.Update
                .Set(x => x.EventTypeName, type.EventTypeName);

            await _eventTypes.UpdateOneAsync(filter, update);
        }

        // DELETE
        public async Task DeleteAsync(int eventTypeId)
        {
            await _eventTypes.DeleteOneAsync(x => x.EventTypeId == eventTypeId);
        }
    }
}

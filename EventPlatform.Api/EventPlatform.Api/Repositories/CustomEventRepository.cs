using EventPlatform.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Repositories
{
    public class CustomEventRepository : ICustomEventRepository
    {
        private readonly IMongoCollection<CustomEvent> _customEventsCollection;
        private readonly IMongoCollection<Counter> _countersCollection;
        private const string CounterId = "customEvent";

        public CustomEventRepository(IMongoDatabase database, IOptions<DatabaseSettings> dbSettings)
        {
            if (dbSettings?.Value == null)
            {
                throw new ArgumentNullException(nameof(dbSettings), "Database settings cannot be null");
            }

            _customEventsCollection = database.GetCollection<CustomEvent>(
                dbSettings.Value.CustomEventsCollectionName ?? "CustomEvents");

            _countersCollection = database.GetCollection<Counter>("counters");

            // Create index for CustomEventId
            var indexKeys = Builders<CustomEvent>.IndexKeys.Ascending(e => e.CustomEventId);
            _customEventsCollection.Indexes.CreateOne(
                new CreateIndexModel<CustomEvent>(indexKeys, new CreateIndexOptions { Unique = true })
            );
        }

        private async Task<int> GetNextCustomEventId()
        {
            var filter = Builders<Counter>.Filter.Eq(c => c.Id, CounterId);
            var update = Builders<Counter>.Update.Inc(c => c.SequenceValue, 1);
            var options = new FindOneAndUpdateOptions<Counter>
            {
                IsUpsert = true,
                ReturnDocument = ReturnDocument.After
            };

            var counter = await _countersCollection.FindOneAndUpdateAsync(filter, update, options).ConfigureAwait(false);
            return counter?.SequenceValue ?? 1; // Default to 1 if counter is null
        }

        public async Task<IEnumerable<CustomEvent>> GetAllAsync()
        {
            return await _customEventsCollection
                .Find(_ => true)
                .SortByDescending(e => e.CreatedAt)
                .ToListAsync()
                .ConfigureAwait(false);
        }

        public async Task<CustomEvent> GetByIdAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                throw new ArgumentNullException(nameof(id), "Event ID cannot be null or empty");
            }

            return await _customEventsCollection
                .Find(e => e.Id == id)
                .FirstOrDefaultAsync()
                .ConfigureAwait(false);
        }

        public async Task<CustomEvent> GetByCustomEventIdAsync(int customEventId)
        {
            return await _customEventsCollection
                .Find(e => e.CustomEventId == customEventId)
                .FirstOrDefaultAsync()
                .ConfigureAwait(false);
        }

        public async Task<IEnumerable<CustomEvent>> GetByUserIdAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentNullException(nameof(userId), "User ID cannot be null or empty");
            }

            return await _customEventsCollection
                .Find(e => e.CreatedBy == userId)
                .SortByDescending(e => e.CreatedAt)
                .ToListAsync()
                .ConfigureAwait(false);
        }

        public async Task<CustomEvent> CreateAsync(CustomEvent customEvent)
        {
            if (customEvent == null)
            {
                throw new ArgumentNullException(nameof(customEvent));
            }

            customEvent.CustomEventId = await GetNextCustomEventId().ConfigureAwait(false);
            customEvent.CreatedAt = DateTime.UtcNow;
            await _customEventsCollection.InsertOneAsync(customEvent).ConfigureAwait(false);
            return customEvent;
        }

        public async Task<bool> UpdateAsync(CustomEvent customEvent)
        {
            if (customEvent == null)
            {
                throw new ArgumentNullException(nameof(customEvent));
            }

            customEvent.UpdatedAt = DateTime.UtcNow;
            var result = await _customEventsCollection.ReplaceOneAsync(
                e => e.Id == customEvent.Id,
                customEvent
            ).ConfigureAwait(false);
            
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                throw new ArgumentNullException(nameof(id), "Event ID cannot be null or empty");
            }

            var result = await _customEventsCollection
                .DeleteOneAsync(e => e.Id == id)
                .ConfigureAwait(false);
                
            return result.IsAcknowledged && result.DeletedCount > 0;
        }
    }
}

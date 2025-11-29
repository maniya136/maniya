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
        private const string UserCounterId = "user";

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

        private async Task<int> GetNextId(string counterId)
        {
            var filter = Builders<Counter>.Filter.Eq(c => c.Id, counterId);
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
            if (!int.TryParse(id, out int eventId))
                return null;

            return await GetByIdAsync(eventId);
        }

        public async Task<CustomEvent> GetByIdAsync(int id)
        {
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
            if (!int.TryParse(userId, out int userIdInt))
                return new List<CustomEvent>();

            return await GetByUserIdAsync(userIdInt);
        }

        public async Task<IEnumerable<CustomEvent>> GetByUserIdAsync(int userId)
        {
            return await _customEventsCollection
                .Find(e => e.UserId == userId)
                .SortByDescending(e => e.CreatedAt)
                .ToListAsync()
                .ConfigureAwait(false);
        }

        public async Task<CustomEvent> CreateAsync(CustomEvent customEvent)
        {
            if (customEvent == null)
                throw new ArgumentNullException(nameof(customEvent));

            // Set the auto-incrementing ID
            customEvent.Id = await GetNextId(CounterId);
            customEvent.CreatedAt = DateTime.UtcNow;
            
            await _customEventsCollection.InsertOneAsync(customEvent).ConfigureAwait(false);
            return customEvent;
        }

        public async Task<bool> UpdateAsync(CustomEvent customEvent)
        {
            if (customEvent == null)
                return false;

            customEvent.UpdatedAt = DateTime.UtcNow;
            var result = await _customEventsCollection
                .ReplaceOneAsync(e => e.Id == customEvent.Id, customEvent)
                .ConfigureAwait(false);

            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            if (!int.TryParse(id, out int eventId))
                return false;

            return await DeleteAsync(eventId);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var result = await _customEventsCollection
                .DeleteOneAsync(e => e.Id == id)
                .ConfigureAwait(false);

            return result.DeletedCount > 0;
        }

        public async Task<IEnumerable<CustomEvent>> GetUpcomingEventsAsync(DateTime currentDate)
        {
            return await _customEventsCollection
                .Find(e => e.StartDateTime > currentDate)
                .SortBy(e => e.StartDateTime)
                .ToListAsync()
                .ConfigureAwait(false);
        }

        public async Task<IEnumerable<CustomEvent>> GetOngoingEventsAsync(DateTime currentDate)
        {
            return await _customEventsCollection
                .Find(e => e.StartDateTime <= currentDate && 
                          (e.EndDateTime == null || e.EndDateTime >= currentDate))
                .SortBy(e => e.StartDateTime)
                .ToListAsync()
                .ConfigureAwait(false);
        }

        public async Task<IEnumerable<CustomEvent>> GetPastEventsAsync(DateTime currentDate)
        {
            return await _customEventsCollection
                .Find(e => e.EndDateTime < currentDate)
                .SortByDescending(e => e.EndDateTime)
                .ToListAsync()
                .ConfigureAwait(false);
        }
    }
}

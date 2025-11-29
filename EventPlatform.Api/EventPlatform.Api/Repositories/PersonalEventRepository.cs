using EventPlatform.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using MongoDB.Bson;

namespace EventPlatform.Api.Repositories
{
    public class PersonalEventRepository : IPersonalEventRepository
    {
        private readonly IMongoCollection<PersonalEvent> _personalEventsCollection;

        public PersonalEventRepository(
            IMongoDatabase database,
            IOptions<DatabaseSettings> dbSettings)
        {
            _personalEventsCollection = database.GetCollection<PersonalEvent>(
                dbSettings.Value.PersonalEventsCollectionName ?? "PersonalEvents");
        }

        public async Task<PersonalEvent> CreateAsync(PersonalEvent personalEvent)
        {
            // Set timestamps
            personalEvent.CreatedAt = DateTime.UtcNow;
            
            // Get next auto-incremented ID
            var database = _personalEventsCollection.Database;
            personalEvent.PersonalEventId = await PersonalEvent.GetNextPersonalEventId(database);
            
            await _personalEventsCollection.InsertOneAsync(personalEvent);
            return personalEvent;
        }

        public async Task<PersonalEvent> GetByIdAsync(string id)
        {
            return await _personalEventsCollection
                .Find(x => x.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<PersonalEvent>> GetByUserIdAsync(int userId) 
        {
            return await _personalEventsCollection
                .Find(x => x.UserId == userId)
                .ToListAsync();
        }

        public async Task<IEnumerable<PersonalEvent>> GetAllAsync()
        {
            return await _personalEventsCollection
                .Find(_ => true)
                .ToListAsync();
        }

        // In PersonalEventRepository.cs
public async Task<bool> UpdateAsync(PersonalEvent personalEvent)
{
    if (personalEvent == null)
    {
        throw new ArgumentNullException(nameof(personalEvent));
    }

    personalEvent.UpdatedAt = DateTime.UtcNow;
    var result = await _personalEventsCollection.ReplaceOneAsync(
        x => x.Id == personalEvent.Id, 
        personalEvent
    );

    return result.IsAcknowledged && result.ModifiedCount > 0;
}

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _personalEventsCollection
                .DeleteOneAsync(x => x.Id == id);

            return result.IsAcknowledged && result.DeletedCount > 0;
        }

        public async Task<bool> UserExists(int userId)
        {
            var count = await _personalEventsCollection
                .CountDocumentsAsync(x => x.UserId == userId);
                
            return count > 0;
        }

        public async Task<IEnumerable<PersonalEvent>> GetUpcomingEventsAsync(DateTime currentDate)
        {
            return await _personalEventsCollection
                .Find(x => x.StartDateTime > currentDate)
                .SortBy(x => x.StartDateTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<PersonalEvent>> GetOngoingEventsAsync(DateTime currentDate)
        {
            return await _personalEventsCollection
                .Find(x => x.StartDateTime <= currentDate && x.EndDateTime >= currentDate)
                .SortBy(x => x.StartDateTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<PersonalEvent>> GetPastEventsAsync(DateTime currentDate)
        {
            return await _personalEventsCollection
                .Find(x => x.EndDateTime < currentDate)
                .SortByDescending(x => x.StartDateTime)
                .ToListAsync();
        }
    }
}

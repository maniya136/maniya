using EventPlatform.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

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

        public async Task<IEnumerable<PersonalEvent>> GetByUserIdAsync(string userId)
        {
            return await _personalEventsCollection
                .Find(x => x.UserId == userId)
                .ToListAsync();
        }
    }
}

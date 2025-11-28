using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EventPlatform.Api.Models;
using MongoDB.Driver;

namespace EventPlatform.Api.Services
{
    public class PersonalEventService : IPersonalEventService
    {
        private readonly IMongoCollection<PersonalEvent> _personalEvents;
        private readonly IMongoDatabase _database;

        public PersonalEventService(IMongoDatabase database)
        {
            _database = database;
            _personalEvents = database.GetCollection<PersonalEvent>("personalEvents");
        }

        public async Task<PersonalEvent> CreatePersonalEventAsync(PersonalEvent personalEvent)
        {
            personalEvent.CreatedAt = DateTime.UtcNow;
            personalEvent.PersonalEventId = await PersonalEvent.GetNextPersonalEventId(_database);
            
            await _personalEvents.InsertOneAsync(personalEvent);
            return personalEvent;
        }

        public async Task<PersonalEvent> GetPersonalEventAsync(string id) =>
            await _personalEvents.Find<PersonalEvent>(e => e.Id == id).FirstOrDefaultAsync();

        public async Task<IEnumerable<PersonalEvent>> GetPersonalEventsByUserIdAsync(string userId) =>
            await _personalEvents.Find(e => e.UserId == userId).ToListAsync();

        public async Task UpdatePersonalEventAsync(string id, PersonalEvent personalEventIn)
        {
            personalEventIn.UpdatedAt = DateTime.UtcNow;
            await _personalEvents.ReplaceOneAsync(e => e.Id == id, personalEventIn);
        }

        public async Task DeletePersonalEventAsync(string id) =>
            await _personalEvents.DeleteOneAsync(e => e.Id == id);
    }
}

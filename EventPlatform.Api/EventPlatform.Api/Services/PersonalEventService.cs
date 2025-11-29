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

        // CREATE PERSONAL EVENT
        public async Task<PersonalEvent> CreatePersonalEventAsync(PersonalEvent personalEvent)
        {
            personalEvent.CreatedAt = DateTime.UtcNow;

            // Auto-Increment PersonalEventId (INT)
            personalEvent.PersonalEventId = await PersonalEvent.GetNextPersonalEventId(_database);

            await _personalEvents.InsertOneAsync(personalEvent);
            return personalEvent;
        }

        // GET PERSONAL EVENT BY STRING ID (OBJECTID)
        public async Task<PersonalEvent> GetPersonalEventAsync(string id)
        {
            return await _personalEvents
                .Find(e => e.Id == id)
                .FirstOrDefaultAsync();
        }

        // GET EVENTS BY USER ID (INT)
        public async Task<IEnumerable<PersonalEvent>> GetPersonalEventsByUserIdAsync(int userId)
        {
            return await _personalEvents
                .Find(e => e.UserId == userId)
                .ToListAsync();
        }

        // UPDATE PERSONAL EVENT
        public async Task UpdatePersonalEventAsync(string id, PersonalEvent personalEventIn)
        {
            personalEventIn.UpdatedAt = DateTime.UtcNow;

            await _personalEvents.ReplaceOneAsync(
                e => e.Id == id,
                personalEventIn
            );
        }

        // DELETE PERSONAL EVENT
        public async Task DeletePersonalEventAsync(string id)
        {
            await _personalEvents.DeleteOneAsync(e => e.Id == id);
        }
    }
}

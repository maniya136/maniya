using EventPlatform.Api.Models;
using EventPlatform.Api.Repositories.Interfaces;
using MongoDB.Driver;

namespace EventPlatform.Api.Repositories
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly IMongoCollection<Service> _services;
        private readonly IMongoCollection<Counter> _counters;

        public ServiceRepository(IMongoDatabase database)
        {
            _services = database.GetCollection<Service>("Services");
            _counters = database.GetCollection<Counter>("counters");
        }

        private async Task<int> GetNextSequenceAsync(string name)
        {
            var filter = Builders<Counter>.Filter.Eq(c => c.Id, name);
            var update = Builders<Counter>.Update.Inc(c => c.SequenceValue, 1);

            var options = new FindOneAndUpdateOptions<Counter>
            {
                ReturnDocument = ReturnDocument.After,
                IsUpsert = true
            };

            var result = await _counters.FindOneAndUpdateAsync(filter, update, options);
            return result.SequenceValue;
        }

        public async Task CreateAsync(Service service)
        {
            service.ServiceId = await GetNextSequenceAsync("serviceId");
            await _services.InsertOneAsync(service);
        }

        public async Task<List<Service>> GetAllAsync() =>
            await _services.Find(_ => true).ToListAsync();

        public async Task<Service?> GetByIdAsync(int id) =>
            await _services.Find(x => x.ServiceId == id).FirstOrDefaultAsync();

        public async Task<List<Service>> GetByEventTypeIdAsync(int eventTypeId) =>
            await _services.Find(x => x.EventTypeId == eventTypeId).ToListAsync();

        public async Task UpdateAsync(int id, Service service) =>
            await _services.ReplaceOneAsync(x => x.ServiceId == id, service);

        public async Task DeleteAsync(int id) =>
            await _services.DeleteOneAsync(x => x.ServiceId == id);
    }
}

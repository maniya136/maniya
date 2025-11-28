using EventPlatform.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace EventPlatform.Api.Services
{
    public interface ISequenceGeneratorService
    {
        Task<int> GetNextSequenceValue(string sequenceName);
    }

    public class SequenceGeneratorService : ISequenceGeneratorService
    {
        private readonly IMongoCollection<Counter> _countersCollection;

        public SequenceGeneratorService(
            IMongoDatabase database,
            IOptions<DatabaseSettings> dbSettings)
        {
            _countersCollection = database.GetCollection<Counter>("counters");
        }

        public async Task<int> GetNextSequenceValue(string sequenceName)
        {
            var filter = Builders<Counter>.Filter.Eq(x => x.Id, sequenceName);
            var update = Builders<Counter>.Update.Inc(x => x.SequenceValue, 1);
            
            var options = new FindOneAndUpdateOptions<Counter>
            {
                ReturnDocument = MongoDB.Driver.ReturnDocument.After,
                IsUpsert = true
            };

            var counter = await _countersCollection.FindOneAndUpdateAsync(filter, update, options);
            return counter?.SequenceValue ?? 1;
        }
    }
}

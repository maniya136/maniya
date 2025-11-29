using EventPlatform.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Repositories
{
    public class VendorRepository : IVendorRepository
    {
        private readonly IMongoCollection<Vendor> _vendorsCollection;
        private readonly IMongoCollection<PersonalEvent> _personalEventsCollection;
        private readonly IMongoCollection<Counter> _countersCollection;

        private readonly string _counterId = "vendor";

        public VendorRepository(IMongoDatabase database, IOptions<DatabaseSettings> dbSettings)
        {
            _vendorsCollection = database.GetCollection<Vendor>(
                dbSettings.Value.VendorsCollectionName);

            _personalEventsCollection = database.GetCollection<PersonalEvent>(
                dbSettings.Value.PersonalEventsCollectionName);

            _countersCollection = database.GetCollection<Counter>("counters");

            // Index creation for VendorId
            var indexKeys = Builders<Vendor>.IndexKeys.Ascending(v => v.VendorId);
            _vendorsCollection.Indexes.CreateOne(
                new CreateIndexModel<Vendor>(indexKeys, new CreateIndexOptions { Unique = true })
            );
        }

        // Auto-increment VendorId
        private async Task<int> GetNextVendorId()
        {
            var filter = Builders<Counter>.Filter.Eq(c => c.Id, _counterId);
            var update = Builders<Counter>.Update.Inc(c => c.SequenceValue, 1);
            var options = new FindOneAndUpdateOptions<Counter>
            {
                IsUpsert = true,
                ReturnDocument = ReturnDocument.After
            };

            var counter = await _countersCollection.FindOneAndUpdateAsync(filter, update, options);
            return counter.SequenceValue;
        }

        public async Task<IEnumerable<Vendor>> GetAllAsync()
        {
            return await _vendorsCollection.Find(_ => true).ToListAsync();
        }

        public async Task<Vendor> GetByIdAsync(string id)
        {
            return await _vendorsCollection.Find(v => v.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Vendor> GetByVendorIdAsync(int vendorId)
        {
            return await _vendorsCollection.Find(v => v.VendorId == vendorId).FirstOrDefaultAsync();
        }

        public async Task<Vendor> CreateAsync(Vendor vendor)
        {
            vendor.VendorId = await GetNextVendorId();
            await _vendorsCollection.InsertOneAsync(vendor);
            return vendor;
        }

        public async Task<bool> UpdateAsync(Vendor vendor)
        {
            var result = await _vendorsCollection.ReplaceOneAsync(
                v => v.Id == vendor.Id,
                vendor
            );

            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _vendorsCollection.DeleteOneAsync(v => v.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<IEnumerable<Vendor>> GetAvailableVendorsAsync(
            string serviceType, DateTime start, DateTime end)
        {
            // Vendors that offer the required service and are active
            var filter = Builders<Vendor>.Filter.And(
                Builders<Vendor>.Filter.In("serviceTypes", new[] { serviceType }),
                Builders<Vendor>.Filter.Eq(v => v.IsActive, true)
            );

            var allVendors = await _vendorsCollection.Find(filter).ToListAsync();
            var available = new List<Vendor>();

            foreach (var vendor in allVendors)
            {
                // Check for schedule conflicts
                bool conflict = await _personalEventsCollection
                    .Find(pe =>
                        pe.VendorId == vendor.Id &&
                        pe.StartDateTime < end &&
                        pe.EndDateTime > start)
                    .AnyAsync();

                if (!conflict)
                {
                    available.Add(vendor);
                }
            }

            return available;
        }
    }
}

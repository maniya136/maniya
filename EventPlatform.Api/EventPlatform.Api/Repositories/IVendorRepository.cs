using EventPlatform.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Repositories
{
    public interface IVendorRepository
    {
        Task<IEnumerable<Vendor>> GetAllAsync();
        Task<Vendor> GetByIdAsync(string id);
        Task<Vendor> GetByVendorIdAsync(int vendorId);
        Task<Vendor> CreateAsync(Vendor vendor);
        Task<bool> UpdateAsync(Vendor vendor);
        Task<bool> DeleteAsync(string id);
        Task<IEnumerable<Vendor>> GetAvailableVendorsAsync(string serviceType, DateTime start, DateTime end);
    }
}

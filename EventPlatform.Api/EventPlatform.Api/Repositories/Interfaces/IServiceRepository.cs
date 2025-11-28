using EventPlatform.Api.Models;

namespace EventPlatform.Api.Repositories.Interfaces
{
    public interface IServiceRepository
    {
        Task<List<Service>> GetAllAsync();
        Task<Service?> GetByIdAsync(int serviceId);
        Task<List<Service>> GetByEventTypeIdAsync(int eventTypeId);
        Task CreateAsync(Service service);
        Task UpdateAsync(int serviceId, Service service);
        Task DeleteAsync(int serviceId);
    }
}

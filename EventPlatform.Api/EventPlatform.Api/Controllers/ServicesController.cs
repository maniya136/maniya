using EventPlatform.Api.Models;
using EventPlatform.Api.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EventPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceRepository _repo;

        public ServicesController(IServiceRepository repo)
        {
            _repo = repo;
        }

        /// <summary>Get all services</summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _repo.GetAllAsync();
            return Ok(list);
        }

        /// <summary>Get service by ServiceId (int)</summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var service = await _repo.GetByIdAsync(id);
            if (service == null) return NotFound();
            return Ok(service);
        }

        /// <summary>Get services by EventTypeId</summary>
        [HttpGet("type/{eventTypeId}")]
        public async Task<IActionResult> GetByType(int eventTypeId)
        {
            var list = await _repo.GetByEventTypeIdAsync(eventTypeId);
            return Ok(list);
        }

        /// <summary>Create a new service</summary>
        /// <remarks>Request body sample shown in Swagger UI</remarks>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Service service)
        {
            // sanitize: ensure Id is null so Mongo sets _id automatically
            service.Id = null;
            await _repo.CreateAsync(service);
            return Ok(service);
        }

        /// <summary>Update existing service</summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Service service)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return NotFound();

            // keep Mongo _id unchanged (if provided), and set service.ServiceId to id
            service.Id = existing.Id;
            service.ServiceId = id;

            await _repo.UpdateAsync(id, service);
            return Ok(service);
        }

        /// <summary>Delete service by ServiceId</summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _repo.DeleteAsync(id);
            return Ok();
        }
    }
}

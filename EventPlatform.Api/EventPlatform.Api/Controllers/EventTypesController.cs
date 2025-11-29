using EventPlatform.Api.Models;
using EventPlatform.Api.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EventPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventTypesController : ControllerBase
    {
        private readonly IEventTypeRepository _repo;

        public EventTypesController(IEventTypeRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _repo.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _repo.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(EventType type)
        {
            await _repo.CreateAsync(type);
            return Ok(type);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, EventType type)
        {
            await _repo.UpdateAsync(id, type);
            return Ok(type);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repo.DeleteAsync(id);
            return Ok();
        }
    }
}

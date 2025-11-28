using EventPlatform.Api.Models;
using EventPlatform.Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CustomEventsController : ControllerBase
    {
        private readonly ICustomEventRepository _customEventRepository;

        public CustomEventsController(ICustomEventRepository customEventRepository)
        {
            _customEventRepository = customEventRepository;
        }

        // GET: api/CustomEvents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomEvent>>> GetCustomEvents()
        {
            var events = await _customEventRepository.GetAllAsync();
            return Ok(events);
        }

        // GET: api/CustomEvents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomEvent>> GetCustomEvent(string id)
        {
            var customEvent = await _customEventRepository.GetByIdAsync(id);
            
            if (customEvent == null)
            {
                return NotFound();
            }

            return customEvent;
        }

        // GET: api/CustomEvents/event/5
        [HttpGet("event/{customEventId}")]
        public async Task<ActionResult<CustomEvent>> GetCustomEventById(int customEventId)
        {
            var customEvent = await _customEventRepository.GetByCustomEventIdAsync(customEventId);
            
            if (customEvent == null)
            {
                return NotFound();
            }

            return customEvent;
        }

        // POST: api/CustomEvents
        [HttpPost]
        public async Task<ActionResult<CustomEvent>> CreateCustomEvent([FromBody] CustomEvent customEvent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Set created by from the authenticated user
            customEvent.CreatedBy = User.Identity?.Name ?? "system";
            
            var createdEvent = await _customEventRepository.CreateAsync(customEvent);
            
            return CreatedAtAction(
                nameof(GetCustomEvent), 
                new { id = createdEvent.Id }, 
                createdEvent
            );
        }

        // PUT: api/CustomEvents/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomEvent(string id, [FromBody] CustomEvent customEvent)
        {
            if (id != customEvent.Id)
            {
                return BadRequest("ID in URL does not match ID in the request body");
            }

            var existingEvent = await _customEventRepository.GetByIdAsync(id);
            if (existingEvent == null)
            {
                return NotFound();
            }

            // Preserve createdBy and createdAt
            customEvent.CreatedBy = existingEvent.CreatedBy;
            customEvent.CreatedAt = existingEvent.CreatedAt;
            customEvent.CustomEventId = existingEvent.CustomEventId;

            var result = await _customEventRepository.UpdateAsync(customEvent);
            if (!result)
            {
                return StatusCode(500, "Failed to update the event");
            }

            return NoContent();
        }

        // DELETE: api/CustomEvents/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomEvent(string id)
        {
            var customEvent = await _customEventRepository.GetByIdAsync(id);
            if (customEvent == null)
            {
                return NotFound();
            }

            var result = await _customEventRepository.DeleteAsync(id);
            if (!result)
            {
                return StatusCode(500, "Failed to delete the event");
            }

            return NoContent();
        }

        // GET: api/CustomEvents/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<CustomEvent>>> GetCustomEventsByUser(string userId)
        {
            var events = await _customEventRepository.GetByUserIdAsync(userId);
            return Ok(events);
        }
    }
}

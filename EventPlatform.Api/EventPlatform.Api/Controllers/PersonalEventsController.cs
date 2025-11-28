using EventPlatform.Api.Models;
using EventPlatform.Api.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonalEventsController : ControllerBase
    {
        private readonly IPersonalEventRepository _personalEventRepository;

        public PersonalEventsController(IPersonalEventRepository personalEventRepository)
        {
            _personalEventRepository = personalEventRepository;
        }

        // POST: api/PersonalEvents
        [HttpPost]
        public async Task<ActionResult<PersonalEvent>> CreatePersonalEvent(PersonalEvent personalEvent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdEvent = await _personalEventRepository.CreateAsync(personalEvent);
            return CreatedAtAction(nameof(GetPersonalEvent), new { id = createdEvent.Id }, createdEvent);
        }

        // GET: api/PersonalEvents/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<PersonalEvent>>> GetPersonalEventsByUser(string userId)
        {
            var events = await _personalEventRepository.GetByUserIdAsync(userId);
            return Ok(events);
        }

        // GET: api/PersonalEvents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PersonalEvent>> GetPersonalEvent(string id)
        {
            var personalEvent = await _personalEventRepository.GetByIdAsync(id);
            
            if (personalEvent == null)
            {
                return NotFound();
            }

            return personalEvent;
        }
    }
}

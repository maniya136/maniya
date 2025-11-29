using EventPlatform.Api.DTOs;
using EventPlatform.Api.Models;
using EventPlatform.Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EventPlatform.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous] // Changed from [Authorize] to allow anonymous access
    public class PersonalEventsController : ControllerBase
    {
        private readonly IPersonalEventRepository _personalEventRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<PersonalEventsController> _logger;

        public PersonalEventsController(
            IPersonalEventRepository personalEventRepository,
            IUserRepository userRepository,
            ILogger<PersonalEventsController> logger)
        {
            _personalEventRepository = personalEventRepository ?? throw new ArgumentNullException(nameof(personalEventRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // GET: api/PersonalEvents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonalEventResponseDto>>> GetAllPersonalEvents()
        {
            try
            {
                var events = await _personalEventRepository.GetAllAsync();
                var response = events.Select(MapToResponseDto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all personal events");
                return StatusCode(500, "An error occurred while retrieving personal events");
            }
        }

        // GET: api/PersonalEvents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PersonalEventResponseDto>> GetPersonalEvent(string id)
        {
            try
            {
                if (!ObjectId.TryParse(id, out _))
                    return BadRequest("Invalid event ID format");

                var personalEvent = await _personalEventRepository.GetByIdAsync(id);
                if (personalEvent == null)
                    return NotFound();

                return Ok(MapToResponseDto(personalEvent));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving personal event with ID: {id}");
                return StatusCode(500, "An error occurred while retrieving the personal event");
            }
        }

        // GET: api/PersonalEvents/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<PersonalEventResponseDto>>> GetPersonalEventsByUser(int userId)
        {
            try
            {
                var events = await _personalEventRepository.GetByUserIdAsync(userId);
                var response = events.Select(MapToResponseDto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving personal events for user ID: {userId}");
                return StatusCode(500, "An error occurred while retrieving personal events");
            }
        }

        // POST: api/PersonalEvents
        [HttpPost]
        public async Task<ActionResult<PersonalEventResponseDto>> CreatePersonalEvent([FromBody] CreatePersonalEventDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Validate user exists
                var userExists = await _userRepository.UserExists(createDto.UserId);
                if (!userExists)
                {
                    return BadRequest("Invalid UserId provided. User does not exist.");
                }

                var model = new PersonalEvent
                {
                    UserId = createDto.UserId,
                    Title = createDto.Title,
                    Description = createDto.Description,
                    StartDateTime = createDto.StartDateTime,
                    EndDateTime = createDto.EndDateTime ?? createDto.StartDateTime.AddHours(1),
                    Location = createDto.Location,
                    EventTypeId = createDto.EventTypeId,
                    ServiceIds = createDto.ServiceIds,
                    Status = createDto.Status ?? "Planned",
                    VendorId = createDto.VendorId,
                    CreatedAt = DateTime.UtcNow
                };

                var created = await _personalEventRepository.CreateAsync(model);
                return CreatedAtAction(nameof(GetPersonalEvent), new { id = created.Id }, MapToResponseDto(created));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating personal event");
                return StatusCode(500, "An error occurred while creating the personal event");
            }
        }

        // PUT: api/PersonalEvents/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePersonalEvent(string id, [FromBody] UpdatePersonalEventDto updateDto)
        {
            try
            {
                if (!ObjectId.TryParse(id, out _))
                    return BadRequest("Invalid event ID format");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var existingEvent = await _personalEventRepository.GetByIdAsync(id);
                if (existingEvent == null)
                    return NotFound();

                // Update the existing event with new values
                existingEvent.Title = updateDto.Title;
                existingEvent.Description = updateDto.Description;
                existingEvent.StartDateTime = updateDto.StartDateTime;
                existingEvent.EndDateTime = updateDto.EndDateTime ?? updateDto.StartDateTime.AddHours(1);
                existingEvent.Location = updateDto.Location;
                existingEvent.EventTypeId = updateDto.EventTypeId;
                existingEvent.ServiceIds = updateDto.ServiceIds;
                existingEvent.Status = updateDto.Status ?? existingEvent.Status;
                existingEvent.VendorId = updateDto.VendorId ?? existingEvent.VendorId;
                existingEvent.UpdatedAt = DateTime.UtcNow;

                var result = await _personalEventRepository.UpdateAsync(existingEvent);
                if (!result)
                    return StatusCode(500, "An error occurred while updating the personal event");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating personal event with ID: {id}");
                return StatusCode(500, "An error occurred while updating the personal event");
            }
        }

        // DELETE: api/PersonalEvents/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePersonalEvent(string id)
        {
            try
            {
                if (!ObjectId.TryParse(id, out _))
                    return BadRequest("Invalid event ID format");

                var existingEvent = await _personalEventRepository.GetByIdAsync(id);
                if (existingEvent == null)
                    return NotFound();

                var result = await _personalEventRepository.DeleteAsync(id);
                if (!result)
                    return StatusCode(500, "An error occurred while deleting the personal event");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting personal event with ID: {id}");
                return StatusCode(500, "An error occurred while deleting the personal event");
            }
        }

        // GET: api/PersonalEvents/upcoming
        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<PersonalEventResponseDto>>> GetUpcomingEvents()
        {
            try
            {
                var now = DateTime.UtcNow;
                var events = await _personalEventRepository.GetUpcomingEventsAsync(now);
                var response = events.Select(MapToResponseDto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving upcoming personal events");
                return StatusCode(500, "An error occurred while retrieving upcoming personal events");
            }
        }

        // GET: api/PersonalEvents/ongoing
        [HttpGet("ongoing")]
        public async Task<ActionResult<IEnumerable<PersonalEventResponseDto>>> GetOngoingEvents()
        {
            try
            {
                var now = DateTime.UtcNow;
                var events = await _personalEventRepository.GetOngoingEventsAsync(now);
                var response = events.Select(MapToResponseDto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving ongoing personal events");
                return StatusCode(500, "An error occurred while retrieving ongoing personal events");
            }
        }

        // GET: api/PersonalEvents/past
        [HttpGet("past")]
        public async Task<ActionResult<IEnumerable<PersonalEventResponseDto>>> GetPastEvents()
        {
            try
            {
                var now = DateTime.UtcNow;
                var events = await _personalEventRepository.GetPastEventsAsync(now);
                var response = events.Select(MapToResponseDto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving past personal events");
                return StatusCode(500, "An error occurred while retrieving past personal events");
            }
        }

        private static PersonalEventResponseDto MapToResponseDto(PersonalEvent personalEvent)
        {
            if (personalEvent == null)
                return null;

            return new PersonalEventResponseDto
            {
                Id = personalEvent.Id,
                PersonalEventId = personalEvent.PersonalEventId,
                UserId = personalEvent.UserId,
                Title = personalEvent.Title,
                Description = personalEvent.Description,
                StartDateTime = personalEvent.StartDateTime,
                EndDateTime = personalEvent.EndDateTime,
                Location = personalEvent.Location,
                EventTypeId = personalEvent.EventTypeId,
                ServiceIds = personalEvent.ServiceIds,
                Status = personalEvent.Status,
                VendorId = personalEvent.VendorId,
                CreatedAt = personalEvent.CreatedAt,
                UpdatedAt = personalEvent.UpdatedAt
            };
        }
    }
}

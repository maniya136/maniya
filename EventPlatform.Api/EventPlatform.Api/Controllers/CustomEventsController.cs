using EventPlatform.Api.DTOs;
using EventPlatform.Api.Models;
using EventPlatform.Api.Repositories;
using EventPlatform.Api.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EventPlatform.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomEventsController : ControllerBase
    {
        private readonly ICustomEventRepository _customEventRepository;
        private readonly IEventTypeRepository _eventTypeRepository;
        private readonly IServiceRepository _serviceRepository;
        private readonly ILogger<CustomEventsController> _logger;

        public CustomEventsController(
            ICustomEventRepository customEventRepository,
            IEventTypeRepository eventTypeRepository,
            IServiceRepository serviceRepository,
            ILogger<CustomEventsController> logger)
        {
            _customEventRepository = customEventRepository;
            _eventTypeRepository = eventTypeRepository;
            _serviceRepository = serviceRepository;
            _logger = logger;
        }

        // GET: api/CustomEvents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomEventResponseDto>>> GetCustomEvents()
        {
            var events = await _customEventRepository.GetAllAsync();
            return Ok(events.Select(MapToDto));
        }

        // GET: api/CustomEvents/upcoming
        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<CustomEventResponseDto>>> GetUpcomingEvents()
        {
            var events = await _customEventRepository.GetUpcomingEventsAsync(DateTime.UtcNow);
            return Ok(events.Where(e => e.IsPublic).Select(MapToDto));
        }

        // GET: api/CustomEvents/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomEventResponseDto>> GetCustomEvent(int id)
        {
            var customEvent = await _customEventRepository.GetByIdAsync(id);
            if (customEvent == null)
                return NotFound();

            return MapToDto(customEvent);
        }

        // GET: api/CustomEvents/event/{customEventId}
        [HttpGet("event/{customEventId}")]
        public async Task<ActionResult<CustomEventResponseDto>> GetCustomEventByCustomId(int customEventId)
        {
            var customEvent = await _customEventRepository.GetByCustomEventIdAsync(customEventId);
            if (customEvent == null)
                return NotFound();

            return MapToDto(customEvent);
        }

        // POST: api/CustomEvents/create
        [HttpPost("create")]
        public async Task<ActionResult<CustomEventResponseDto>> CreateCustomEvent([FromBody] CreateCustomEventDto createDto)
        {
            try
            {
                // Validate Event Type
                var eventType = await _eventTypeRepository.GetByIdAsync(createDto.EventTypeId);
                if (eventType == null)
                    return BadRequest("Invalid event type");

                // Validate Service
                if (createDto.ServiceId > 0)
                {
                    var service = await _serviceRepository.GetByIdAsync(createDto.ServiceId);
                    if (service == null)
                        return BadRequest("Invalid service ID");
                }

                // Validate User ID
                if (!int.TryParse(createDto.UserId, out int userId))
                    return BadRequest("Invalid user ID");

                var customEvent = new CustomEvent
                {
                    Title = createDto.Title,
                    Description = createDto.Description,
                    StartDateTime = createDto.StartDateTime,
                    EndDateTime = createDto.EndDateTime,
                    Location = createDto.Location,
                    UserId = userId,
                    EventTypeId = createDto.EventTypeId,
                    ServiceId = createDto.ServiceId > 0 ? createDto.ServiceId : 0,
                    Status = "Draft",
                    IsPublic = createDto.IsPublic ?? true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    MaxAttendees = createDto.MaxAttendees,
                    Tags = createDto.Tags,
                    ImageUrl = createDto.ImageUrl,
                    Price = createDto.Price,
                    Category = createDto.Category
                };

                await _customEventRepository.CreateAsync(customEvent);

                return CreatedAtAction(nameof(GetCustomEvent),
                    new { id = customEvent.Id }, MapToDto(customEvent));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating custom event");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/CustomEvents/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomEvent(int id, [FromBody] UpdateCustomEventDto updateDto)
        {
            try
            {
                var existingEvent = await _customEventRepository.GetByIdAsync(id);
                if (existingEvent == null)
                    return NotFound();

                // Validate event type
                if (updateDto.EventTypeId > 0)
                {
                    var eventType = await _eventTypeRepository.GetByIdAsync(updateDto.EventTypeId);
                    if (eventType == null)
                        return BadRequest("Invalid event type");
                    existingEvent.EventTypeId = updateDto.EventTypeId;
                }

                // Validate service
                if (updateDto.ServiceId > 0)
                {
                    var service = await _serviceRepository.GetByIdAsync(updateDto.ServiceId);
                    if (service == null)
                        return BadRequest("Invalid service ID");
                    existingEvent.ServiceId = updateDto.ServiceId;
                }

                if (!string.IsNullOrEmpty(updateDto.Title))
                    existingEvent.Title = updateDto.Title;

                if (!string.IsNullOrEmpty(updateDto.Description))
                    existingEvent.Description = updateDto.Description;

                if (updateDto.StartDateTime != default)
                    existingEvent.StartDateTime = updateDto.StartDateTime;

                if (updateDto.EndDateTime.HasValue)
                    existingEvent.EndDateTime = updateDto.EndDateTime;

                if (!string.IsNullOrEmpty(updateDto.Location))
                    existingEvent.Location = updateDto.Location;

                if (!string.IsNullOrEmpty(updateDto.Status))
                    existingEvent.Status = updateDto.Status;

                if (updateDto.MaxAttendees.HasValue)
                    existingEvent.MaxAttendees = updateDto.MaxAttendees;

                if (updateDto.IsPublic.HasValue)
                    existingEvent.IsPublic = updateDto.IsPublic.Value;

                if (updateDto.Tags != null)
                    existingEvent.Tags = updateDto.Tags;

                if (!string.IsNullOrEmpty(updateDto.ImageUrl))
                    existingEvent.ImageUrl = updateDto.ImageUrl;

                if (updateDto.Price.HasValue)
                    existingEvent.Price = updateDto.Price.Value;

                if (!string.IsNullOrEmpty(updateDto.Category))
                    existingEvent.Category = updateDto.Category;

                existingEvent.UpdatedAt = DateTime.UtcNow;

                var result = await _customEventRepository.UpdateAsync(existingEvent);
                if (!result) return StatusCode(500, "Failed to update");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating event");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/CustomEvents/approve/admin
        [HttpPost("approve/admin")]
        public async Task<IActionResult> ApproveByAdmin([FromBody] ApproveEventDto approveDto)
        {
            var customEvent = await _customEventRepository.GetByIdAsync(approveDto.EventId);
            if (customEvent == null)
                return NotFound("Event not found");

            if (customEvent.Status != "PendingAdminApproval")
                return BadRequest("Event not awaiting admin approval");

            customEvent.AdminId = approveDto.ApprovedById;
            customEvent.Status = approveDto.IsApproved ? "PendingVendorApproval" : "Rejected";
            customEvent.UpdatedAt = DateTime.UtcNow;

            var result = await _customEventRepository.UpdateAsync(customEvent);
            if (!result) return StatusCode(500, "Failed to update");

            return Ok(new
            {
                Status = customEvent.Status,
                Message = approveDto.IsApproved
                    ? "Approved by admin and sent to vendor"
                    : "Rejected by admin"
            });
        }

        // POST: api/CustomEvents/approve/vendor
        [HttpPost("approve/vendor")]
        public async Task<IActionResult> ApproveByVendor([FromBody] ApproveEventDto approveDto)
        {
            var customEvent = await _customEventRepository.GetByIdAsync(approveDto.EventId);
            if (customEvent == null)
                return NotFound("Event not found");

            if (customEvent.Status != "PendingVendorApproval")
                return BadRequest("Event not awaiting vendor approval");

            customEvent.VendorId = approveDto.ApprovedById;
            customEvent.Status = approveDto.IsApproved ? "Approved" : "Rejected";
            customEvent.UpdatedAt = DateTime.UtcNow;

            var result = await _customEventRepository.UpdateAsync(customEvent);
            if (!result) return StatusCode(500, "Failed to update");

            return Ok(new
            {
                Status = customEvent.Status,
                Message = approveDto.IsApproved
                    ? "Approved by vendor"
                    : "Rejected by vendor"
            });
        }

        // DELETE: api/CustomEvents/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomEvent(int id)
        {
            var customEvent = await _customEventRepository.GetByIdAsync(id);
            if (customEvent == null)
                return NotFound();

            var result = await _customEventRepository.DeleteAsync(id);
            if (!result)
                return StatusCode(500, "Failed to delete");

            return NoContent();
        }

        // GET: api/CustomEvents/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<CustomEventResponseDto>>> GetCustomEventsByUser(string userId)
        {
            if (!int.TryParse(userId, out int uid))
                return BadRequest("Invalid user id");

            var events = await _customEventRepository.GetByUserIdAsync(uid);
            return Ok(events.Select(MapToDto));
        }

        // GET: api/CustomEvents/ongoing
        [HttpGet("ongoing")]
        public async Task<ActionResult<IEnumerable<CustomEventResponseDto>>> GetOngoingEvents()
        {
            try
            {
                var events = await _customEventRepository.GetOngoingEventsAsync(DateTime.UtcNow);
                return Ok(events.Select(MapToDto));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving ongoing events");
                return StatusCode(500, "An error occurred while retrieving ongoing events");
            }
        }

        // GET: api/CustomEvents/past
        [HttpGet("past")]
        public async Task<ActionResult<IEnumerable<CustomEventResponseDto>>> GetPastEvents()
        {
            try
            {
                var events = await _customEventRepository.GetPastEventsAsync(DateTime.UtcNow);
                return Ok(events.Select(MapToDto));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving past events");
                return StatusCode(500, "An error occurred while retrieving past events");
            }
        }

        private CustomEventResponseDto MapToDto(CustomEvent customEvent)
        {
            return new CustomEventResponseDto
            {
                Id = customEvent.Id.ToString(),
                CustomEventId = customEvent.Id,
                Title = customEvent.Title,
                Description = customEvent.Description,
                StartDateTime = customEvent.StartDateTime,
                EndDateTime = customEvent.EndDateTime,
                Location = customEvent.Location,
                UserId = customEvent.UserId.ToString(),
                EventTypeId = customEvent.EventTypeId,
                ServiceId = customEvent.ServiceId,
                Status = customEvent.Status,
                MaxAttendees = customEvent.MaxAttendees,
                IsPublic = customEvent.IsPublic,
                Tags = customEvent.Tags ?? new List<string>(),
                ImageUrl = customEvent.ImageUrl,
                Price = customEvent.Price,
                Category = customEvent.Category,
                CreatedAt = customEvent.CreatedAt ?? DateTime.UtcNow,
                UpdatedAt = customEvent.UpdatedAt
            };
        }
    }
}

using EventPlatform.Api.DTOs;
using EventPlatform.Api.Models;
using EventPlatform.Api.Repositories;
using EventPlatform.Api.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Controllers
{
    [Route("api/personalevents/{eventId}/[controller]")]
    [ApiController]
    [Authorize]
    public class ServicesController : ControllerBase
    {
        private readonly IPersonalEventRepository _personalEventRepository;
        private readonly IServiceRepository _serviceRepository;
        private readonly ILogger<ServicesController> _logger;

        public ServicesController(
            IPersonalEventRepository personalEventRepository,
            IServiceRepository serviceRepository,
            ILogger<ServicesController> logger)
        {
            _personalEventRepository = personalEventRepository ?? throw new ArgumentNullException(nameof(personalEventRepository));
            _serviceRepository = serviceRepository ?? throw new ArgumentNullException(nameof(serviceRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // POST: api/personalevents/{eventId}/services/select
        [HttpPost("select")]
        public async Task<IActionResult> SelectServices(string eventId, [FromBody] ServiceSelectionDto selectionDto)
        {
            try
            {
                if (!ObjectId.TryParse(eventId, out _))
                    return BadRequest("Invalid event ID format");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Get the personal event
                var personalEvent = await _personalEventRepository.GetByIdAsync(eventId);
                if (personalEvent == null)
                    return NotFound("Personal event not found");

                // Validate services exist
                var invalidServiceIds = new List<int>();
                foreach (var serviceId in selectionDto.ServiceIds)
                {
                    var service = await _serviceRepository.GetByIdAsync(serviceId);
                    if (service == null)
                    {
                        invalidServiceIds.Add(serviceId);
                    }
                }

                if (invalidServiceIds.Count > 0)
                {
                    return BadRequest($"The following service IDs are invalid: {string.Join(", ", invalidServiceIds)}");
                }

                // Update the event with selected services
                personalEvent.ServiceIds = selectionDto.ServiceIds;
                personalEvent.UpdatedAt = DateTime.UtcNow;

                var result = await _personalEventRepository.UpdateAsync(personalEvent);
                if (!result)
                    return StatusCode(500, "An error occurred while updating the personal event");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error selecting services for event {eventId}");
                return StatusCode(500, "An error occurred while selecting services");
            }
        }

        // GET: api/personalevents/{eventId}/services/available
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<Service>>> GetAvailableServices(string eventId)
        {
            try
            {
                if (!ObjectId.TryParse(eventId, out _))
                    return BadRequest("Invalid event ID format");

                // Get the personal event
                var personalEvent = await _personalEventRepository.GetByIdAsync(eventId);
                if (personalEvent == null)
                    return NotFound("Personal event not found");

                // Get all services for the event's type
                var services = await _serviceRepository.GetByEventTypeIdAsync(personalEvent.EventTypeId);
                return Ok(services);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving available services for event {eventId}");
                return StatusCode(500, "An error occurred while retrieving available services");
            }
        }
    }
}

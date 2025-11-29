using System;
using System.Threading.Tasks;
using EventPlatform.Api.Models;
using EventPlatform.Api.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EventPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly ILogger<TicketsController> _logger;

        public TicketsController(ITicketRepository ticketRepository, ILogger<TicketsController> logger)
        {
            _ticketRepository = ticketRepository;
            _logger = logger;
        }

        [HttpPost("validate")]
        public async Task<ActionResult<TicketValidationResponse>> ValidateTicket(
            [FromBody] TicketValidationRequest request)
        {
            try
            {
                var ticket = await _ticketRepository.GetByTicketNumberAsync(request.TicketNumber);

                if (ticket == null)
                {
                    return Ok(new TicketValidationResponse
                    {
                        IsValid = false,
                        Message = "Ticket not found"
                    });
                }

                if (ticket.EventId != request.EventId)
                {
                    return Ok(new TicketValidationResponse
                    {
                        IsValid = false,
                        Message = "Ticket is not valid for this event"
                    });
                }

                if (ticket.Status != "Valid")
                {
                    return Ok(new TicketValidationResponse
                    {
                        IsValid = false,
                        Message = $"Ticket is {ticket.Status.ToLower()}"
                    });
                }

                // Mark ticket as used
                ticket.Status = "Used";
                ticket.UsedAt = DateTime.UtcNow;
                await _ticketRepository.UpdateAsync(ticket);

                return Ok(new TicketValidationResponse
                {
                    IsValid = true,
                    Message = "Ticket is valid and has been marked as used",
                    Ticket = new TicketDetails
                    {
                        Id = ticket.Id,
                        TicketNumber = ticket.TicketNumber,
                        TicketType = ticket.TicketType,
                        Status = ticket.Status,
                        EventId = ticket.EventId,
                        UserId = ticket.UserId,
                        UsedAt = ticket.UsedAt
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating ticket");

                return StatusCode(500, new TicketValidationResponse
                {
                    IsValid = false,
                    Message = "An error occurred while validating the ticket"
                });
            }
        }
    }
}

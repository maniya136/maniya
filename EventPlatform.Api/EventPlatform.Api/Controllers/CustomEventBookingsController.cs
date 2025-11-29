using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using EventPlatform.Api.DTOs;
using EventPlatform.Api.Models;
using EventPlatform.Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EventPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomEventBookingsController : ControllerBase
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly ICustomEventRepository _eventRepository;
        private readonly ITicketRepository _ticketRepository;
        private readonly ILogger<CustomEventBookingsController> _logger;

        public CustomEventBookingsController(
            IBookingRepository bookingRepository,
            ICustomEventRepository eventRepository,
            ITicketRepository ticketRepository,
            ILogger<CustomEventBookingsController> logger)
        {
            _bookingRepository = bookingRepository;
            _eventRepository = eventRepository;
            _ticketRepository = ticketRepository;
            _logger = logger;
        }

        [Authorize]
        [HttpPost("{eventId}/book")]
        public async Task<ActionResult<BookingResponseDto>> BookEvent(int eventId, [FromBody] CreateBookingDto createBookingDto)
        {
            try
            {
                // Get the current user's ID from the token
                if (!int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out int userId))
                {
                    return Unauthorized("Invalid user ID in token");
                }

                // Get the event
                var eventItem = await _eventRepository.GetByIdAsync(eventId);
                if (eventItem == null)
                {
                    return NotFound("Event not found");
                }

                // Check if event is in the future or ongoing
                if (eventItem.StartDateTime < DateTime.UtcNow)
                {
                    return BadRequest("Cannot book past events");
                }

                // Validate that the event has a price
                if (!eventItem.Price.HasValue)
                {
                    return BadRequest("Cannot book an event without a price");
                }

                // Create booking
                var booking = new Booking
                {
                    EventId = eventId,
                    UserId = userId,
                    Status = "Confirmed",
                    BookingDate = DateTime.UtcNow,
                    TotalAmount = eventItem.Price.Value * createBookingDto.NumberOfTickets,
                    CreatedAt = DateTime.UtcNow
                };

                // Create tickets
                var ticketIds = new List<int>();
                for (int i = 0; i < createBookingDto.NumberOfTickets; i++)
                {
                    var ticket = new Ticket
                    {
                        EventId = eventId,
                        UserId = userId,
                        BookingId = booking.Id, // Will be set after booking is created
                        TicketNumber = GenerateTicketNumber(),
                        Price = eventItem.Price.Value, // We've already validated that Price is not null
                        Status = "Valid",
                        CreatedAt = DateTime.UtcNow
                    };

                    var createdTicket = await _ticketRepository.CreateAsync(ticket);
                    ticketIds.Add(createdTicket.Id);
                }

                // Update booking with ticket IDs
                booking.TicketIds = ticketIds;
                var createdBooking = await _bookingRepository.CreateAsync(booking);

                // Update tickets with booking ID
                foreach (var ticketId in ticketIds)
                {
                    var ticket = await _ticketRepository.GetByIdAsync(ticketId);
                    if (ticket != null)
                    {
                        ticket.BookingId = createdBooking.Id;
                        await _ticketRepository.UpdateAsync(ticket);
                    }
                }

                // Map to DTO
                var response = new BookingResponseDto
                {
                    Id = createdBooking.Id,
                    EventId = createdBooking.EventId,
                    UserId = createdBooking.UserId,
                    Status = createdBooking.Status,
                    TotalAmount = createdBooking.TotalAmount,
                    BookingDate = createdBooking.BookingDate,
                    TicketIds = createdBooking.TicketIds
                };

                return CreatedAtAction(
                    nameof(GetBooking),
                    new { id = createdBooking.Id },
                    response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating booking for event {EventId}", eventId);
                return StatusCode(500, "An error occurred while creating the booking");
            }
        }

        [Authorize]
        [HttpGet("{id}", Name = "GetBooking")]
        public async Task<ActionResult<BookingResponseDto>> GetBooking(int id)
        {
            try
            {
                var booking = await _bookingRepository.GetByIdAsync(id);
                if (booking == null)
                {
                    return NotFound();
                }

                // Verify the requesting user is the owner of the booking
                if (!int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out int userId) || 
                    booking.UserId != userId)
                {
                    return Unauthorized("You don't have permission to view this booking");
                }

                return new BookingResponseDto
                {
                    Id = booking.Id,
                    EventId = booking.EventId,
                    UserId = booking.UserId,
                    Status = booking.Status,
                    TotalAmount = booking.TotalAmount,
                    BookingDate = booking.BookingDate,
                    TicketIds = booking.TicketIds
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving booking {BookingId}", id);
                return StatusCode(500, "An error occurred while retrieving the booking");
            }
        }

        private string GenerateTicketNumber()
        {
            return $"TKT-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}";
        }
    }
}

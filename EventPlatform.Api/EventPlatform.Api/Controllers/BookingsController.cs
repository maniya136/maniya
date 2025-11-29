using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EventPlatform.Api.Models;
using EventPlatform.Api.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EventPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly ILogger<BookingsController> _logger;

        public BookingsController(IBookingRepository bookingRepository, ILogger<BookingsController> logger)
        {
            _bookingRepository = bookingRepository;
            _logger = logger;
        }

        [HttpPost("book")]
        public async Task<ActionResult<Booking>> CreateBooking([FromBody] Booking booking)
        {
            try
            {
                var createdBooking = await _bookingRepository.CreateAsync(booking);
                return CreatedAtAction(nameof(GetBooking), new { id = createdBooking.Id }, createdBooking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating booking");
                return StatusCode(500, "An error occurred while creating the booking");
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetUserBookings(int userId)
        {
            try
            {
                var bookings = await _bookingRepository.GetByUserIdAsync(userId);
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user bookings");
                return StatusCode(500, "An error occurred while retrieving user bookings");
            }
        }

        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetEventBookings(int eventId)
        {
            try
            {
                var bookings = await _bookingRepository.GetByEventIdAsync(eventId);
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving event bookings");
                return StatusCode(500, "An error occurred while retrieving event bookings");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
            {
                return NotFound();
            }
            return booking;
        }
    }
}

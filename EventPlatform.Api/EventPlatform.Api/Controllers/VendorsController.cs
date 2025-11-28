using EventPlatform.Api.Models;
using EventPlatform.Api.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendorsController : ControllerBase
    {
        private readonly IVendorRepository _vendorRepository;

        public VendorsController(IVendorRepository vendorRepository)
        {
            _vendorRepository = vendorRepository;
        }

        // GET: api/Vendors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vendor>>> GetVendors()
        {
            var vendors = await _vendorRepository.GetAllAsync();
            return Ok(vendors);
        }

        // GET: api/Vendors/available?serviceId=decoration&start=2023-01-01T10:00:00&end=2023-01-01T18:00:00
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<Vendor>>> GetAvailableVendors(
            [FromQuery] string serviceId,
            [FromQuery] DateTime start,
            [FromQuery] DateTime end)
        {
            if (string.IsNullOrEmpty(serviceId))
            {
                return BadRequest("Service ID is required");
            }

            if (start >= end)
            {
                return BadRequest("End time must be after start time");
            }

            var availableVendors = await _vendorRepository.GetAvailableVendorsAsync(serviceId, start, end);
            return Ok(availableVendors);
        }

        // GET: api/Vendors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Vendor>> GetVendor(string id)
        {
            var vendor = await _vendorRepository.GetByIdAsync(id);
            
            if (vendor == null)
            {
                return NotFound();
            }

            return Ok(vendor);
        }

        // GET: api/Vendors/vendorid/123
        [HttpGet("vendorid/{vendorId}")]
        public async Task<ActionResult<Vendor>> GetVendorByVendorId(int vendorId)
        {
            var vendor = await _vendorRepository.GetByVendorIdAsync(vendorId);
            
            if (vendor == null)
            {
                return NotFound();
            }

            return Ok(vendor);
        }

        // POST: api/Vendors
        [HttpPost]
        public async Task<ActionResult<Vendor>> CreateVendor([FromBody] Vendor vendor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdVendor = await _vendorRepository.CreateAsync(vendor);
            return CreatedAtAction(nameof(GetVendor), new { id = createdVendor.Id }, createdVendor);
        }

        // PUT: api/Vendors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVendor(string id, [FromBody] Vendor vendor)
        {
            if (id != vendor.Id)
            {
                return BadRequest("ID in URL does not match ID in the request body");
            }

            var existingVendor = await _vendorRepository.GetByIdAsync(id);
            if (existingVendor == null)
            {
                return NotFound();
            }

            var updated = await _vendorRepository.UpdateAsync(vendor);
            if (!updated)
            {
                return StatusCode(500, "Failed to update vendor");
            }

            return NoContent();
        }

        // PUT: api/Vendors/vendorid/123
        [HttpPut("vendorid/{vendorId}")]
        public async Task<IActionResult> UpdateVendorByVendorId(int vendorId, [FromBody] Vendor vendor)
        {
            try
            {
                if (vendorId != vendor.VendorId)
                {
                    return BadRequest("Vendor ID in URL does not match Vendor ID in the request body");
                }

                var existingVendor = await _vendorRepository.GetByVendorIdAsync(vendorId);
                if (existingVendor == null)
                {
                    return NotFound("Vendor not found");
                }

                // Preserve the original ID and timestamps
                vendor.Id = existingVendor.Id;
                vendor.CreatedAt = existingVendor.CreatedAt;
                vendor.UpdatedAt = DateTime.UtcNow;
                
                var updated = await _vendorRepository.UpdateAsync(vendor);
                if (!updated)
                {
                    return StatusCode(500, "Failed to update vendor. The data might be the same as existing.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating the vendor: {ex.Message}");
            }
        }

        // DELETE: api/Vendors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVendor(string id)
        {
            var vendor = await _vendorRepository.GetByIdAsync(id);
            if (vendor == null)
            {
                return NotFound();
            }

            var deleted = await _vendorRepository.DeleteAsync(id);
            if (!deleted)
            {
                return StatusCode(500, "Failed to delete vendor");
            }

            return NoContent();
        }

        // DELETE: api/Vendors/vendorid/123
        [HttpDelete("vendorid/{vendorId}")]
        public async Task<IActionResult> DeleteVendorByVendorId(int vendorId)
        {
            var vendor = await _vendorRepository.GetByVendorIdAsync(vendorId);
            if (vendor == null)
            {
                return NotFound();
            }

            var deleted = await _vendorRepository.DeleteAsync(vendor.Id);
            if (!deleted)
            {
                return StatusCode(500, "Failed to delete vendor");
            }

            return NoContent();
        }
    }
}

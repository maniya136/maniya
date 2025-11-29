using System;
using System.ComponentModel.DataAnnotations;

namespace EventPlatform.Api.Validation
{
    public class FutureDateAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value == null) return true; // Let Required handle null values
            
            if (value is DateTime date)
            {
                return date > DateTime.UtcNow;
            }
            
            return false;
        }

        public override string FormatErrorMessage(string name)
        {
            return $"The {{0}} field must be a future date.";
        }
    }
}

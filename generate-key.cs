using System;
using System.Security.Cryptography;
using System.Text;

class Program
{
    static void Main()
    {
        // Generate a secure random key
        var key = new byte[32]; // 256 bits
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(key);
        }
        
        // Convert to base64 for use in appsettings.json
        var base64Key = Convert.ToBase64String(key);
        Console.WriteLine("Generated JWT Key (add this to appsettings.json):");
        Console.WriteLine(base64Key);
    }
}

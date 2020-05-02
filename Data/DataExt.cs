using Domain.Identity;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Data
{
    internal static class DataExt
    { public static int CalculateAge(this DateTime theDateTime) =>
            theDateTime.AddYears(DateTime.Today.Year - theDateTime.Year) > DateTime.Today
                ? (DateTime.Today.Year - theDateTime.Year) - 1
                : DateTime.Today.Year - theDateTime.Year;
    }
}
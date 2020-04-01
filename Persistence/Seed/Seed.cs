using Domain;
using Domain.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Persistence.Seed
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext context, UserManager<AppUser> userManager)
        {
            if (!await context.Users.AnyAsync())
            {
                var userData = File.ReadAllText(@"../Persistence/Seed/generated.json");
                var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

                foreach (var userToSeed in users.Select(user => new AppUser
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    DisplayName = user.DisplayName,
                    DateOfBirth = user.DateOfBirth,
                    Gender = user.Gender,
                    Created = user.Created,
                    LastActive = user.LastActive,
                    Introduction = user.Introduction,
                    LookingFor = user.LookingFor,
                    City = user.City,
                    Country = user.Country,
                    Photos = new List<Photo>
                    {
                        new Photo
                        {
                            Id = Guid.NewGuid().ToString(),
                            Description = user.Photos.FirstOrDefault()?.Description,
                            Url = user.Photos.FirstOrDefault()?.Url,
                            IsMain = true,
                            Status = true
                        }
                    }
                }))
                {
                    await userManager.CreateAsync(userToSeed, "96a@Ks5@Q");
                }

                await context.SaveChangesAsync();
            }
        }
    }
}
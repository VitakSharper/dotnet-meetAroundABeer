﻿using Microsoft.AspNetCore.Identity;
using System;

namespace Domain.Identity
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Gender { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
    }
}
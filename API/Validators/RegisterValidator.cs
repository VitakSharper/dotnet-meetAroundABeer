using Data.Dtos;
using FluentValidation;

namespace API.Validators
{
    public class RegisterValidator : AbstractValidator<UserForRegisterDto>
    {
        public RegisterValidator()
        {
            RuleFor(u => u.Username).NotEmpty();
            RuleFor(u => u.DisplayName).NotEmpty();
            RuleFor(u => u.Email).NotEmpty().EmailAddress();
            RuleFor(u => u.Country).NotEmpty();
            RuleFor(u => u.Gender).NotEmpty();
            RuleFor(u => u.City).NotEmpty();
            RuleFor(u => u.Password).Password();
        }
    }
}
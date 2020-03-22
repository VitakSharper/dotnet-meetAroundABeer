using Data.Dtos;
using FluentValidation;

namespace API.Validators
{
    public class UserValidator : AbstractValidator<UserForLoginDto>
    {
        public UserValidator()
        {
            RuleFor(p => p.Email).NotEmpty().EmailAddress();
            RuleFor(p => p.Password).NotEmpty();
        }
    }
}
using Data.Dtos;
using FluentValidation;

namespace API.Validators
{
    public class UserValidator : AbstractValidator<UserForRegisterDto>
    {
        public UserValidator()
        {
            RuleFor(p => p.Username).NotEmpty();
            RuleFor(p => p.Password).Password();
        }
    }
}
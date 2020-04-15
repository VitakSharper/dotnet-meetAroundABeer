using Data.Dtos;
using FluentValidation;

namespace API.Validators
{
    public class UserUpdateValidator : AbstractValidator<UserForUpdateDto>
    {
        public UserUpdateValidator()
        {
            RuleFor(r => r.City).NotEmpty();
            RuleFor(r => r.Country).NotEmpty();
        }
    }
}
using FluentValidation;

namespace API.Validators
{
    internal static class ValidatorsExt
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder) =>
            ruleBuilder
                .NotEmpty()
                .MinimumLength(6).WithMessage("Password must be at least 6 characters.")
                .Matches("[A-Z]").WithMessage("Password must contain 1 uppercase letter.")
                .Matches("[a-z]").WithMessage("Password must have at least 1 lowercase character.")
                .Matches("[0-9]").WithMessage("Password must contain at least one number.")
                .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain non alphanumeric.");
    }
}
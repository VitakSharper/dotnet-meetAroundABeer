using Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<AppUser>
    {
        public void Configure(EntityTypeBuilder<AppUser> builder)
        {
            builder.Property(p => p.City)
                .HasMaxLength(50);
            builder.Property(p => p.Country)
                .HasMaxLength(50);
            builder.Property(p => p.Gender)
                .HasMaxLength(15);
            builder.Property(p => p.DisplayName)
                .HasMaxLength(50);
            builder.HasMany(p => p.Photos)
                .WithOne(u => u.User).IsRequired()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
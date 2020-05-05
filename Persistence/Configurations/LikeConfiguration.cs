using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configurations
{
    public class LikeConfiguration : IEntityTypeConfiguration<Like>
    {
        public void Configure(EntityTypeBuilder<Like> builder)
        {
            builder.HasKey(k => new {k.LikerId, k.LikeeId});

            builder.HasOne(k => k.Likee)
                .WithMany(k => k.Likers)
                .HasForeignKey(u => u.LikeeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(k => k.Liker)
                .WithMany(k => k.Likees)
                .HasForeignKey(f => f.LikerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
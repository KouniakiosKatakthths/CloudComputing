using CloudComputing.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace CloudComputing.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(x =>
            {
                //Primary key
                x.HasKey(u => u.Id);

                //Require username
                x.Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(128);

                //Require unique username
                x.HasIndex(u => u.Username)
                .IsUnique();

                //Require password
                x.Property(u => u.PasswordHash) 
                .IsRequired()
                .HasMaxLength(128);

                //Enforce Role
                x.Property(u => u.Role)
                .IsRequired()
                .HasDefaultValue(UserRoles.User)
                .HasConversion<string>();
            });
        }
    }
}

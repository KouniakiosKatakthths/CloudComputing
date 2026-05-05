using CloudComputing.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace CloudComputing.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
    }
}

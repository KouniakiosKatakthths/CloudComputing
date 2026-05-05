using Microsoft.EntityFrameworkCore;

namespace CloudComputing.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        
    }
}

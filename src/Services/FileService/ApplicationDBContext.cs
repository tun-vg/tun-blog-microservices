using Microsoft.EntityFrameworkCore;

namespace FileService;

public class ApplicationDBContext : DbContext
{
    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
    {
    }

    public DbSet<Entities.File> Files { get; set; }
}

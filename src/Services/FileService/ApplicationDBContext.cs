using Microsoft.EntityFrameworkCore;

namespace FileService;

public class ApplicationDBContext : DbContext
{
    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseMySql("Server=localhost;Database=post_service;User=root;Password=123456789;",
                new MySqlServerVersion(new Version(8, 0, 23)));
        }
    }

    public DbSet<Entities.File> Files { get; set; }
}

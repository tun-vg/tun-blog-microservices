using Microsoft.EntityFrameworkCore;
using UserService.Entities;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
    public DbSet<UserProfileExtend> UserProfileExtends { get; set; }
    
    public DbSet<UserFollow>  UserFollows { get; set; }
    
}
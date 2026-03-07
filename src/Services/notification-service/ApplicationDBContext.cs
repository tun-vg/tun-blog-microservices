using Microsoft.EntityFrameworkCore;
using NotificationService.Entities;

namespace NotificationService;

public class ApplicationDBContext : DbContext
{
    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
    {
    }

    public DbSet<Notification> Notifications { get; set; }
    
    public DbSet<UserSubscription> UserSubscriptions { get; set; }
}

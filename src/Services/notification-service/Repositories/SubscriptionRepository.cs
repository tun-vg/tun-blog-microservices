using Microsoft.EntityFrameworkCore;
using NotificationService.Entities;

namespace NotificationService.Repositories;

public class SubscriptionRepository : ISubscriptionRepository
{
    private readonly ApplicationDBContext _context;
    
    public SubscriptionRepository(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<bool> CheckSubscription(string email)
    {
        var userSubscription = await _context.UserSubscriptions.Where(u => u.Email == email).FirstOrDefaultAsync();
        return userSubscription != null;
    }

    public async Task Subscribe(string email)
    {
        UserSubscription userSubscription = new UserSubscription
        {
            UserSubscriptionId = Guid.NewGuid(),
            Email = email
        };
        await _context.UserSubscriptions.AddAsync(userSubscription);
        await _context.SaveChangesAsync();
    }

    public async Task Unsubscribe(string email)
    {
        var userSubscription = await _context.UserSubscriptions.Where(u => u.Email == email).FirstOrDefaultAsync();
        
        if (userSubscription == null) throw new Exception("UserSubscription not found");
        
        _context.UserSubscriptions.Remove(userSubscription);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<UserSubscription>> GetAllSubcribers()
    {
        var subcribers = await _context.UserSubscriptions
            .AsNoTracking()
            .ToListAsync();

        return subcribers;
    }
}
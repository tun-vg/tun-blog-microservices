using NotificationService.Entities;

namespace NotificationService.Repositories;

public interface ISubscriptionRepository
{
    Task<bool> CheckSubscription(string email);
    
    Task Subscribe(string email);
    
    Task Unsubscribe(string email);

    Task<IEnumerable<UserSubscription>> GetAllSubcribers();
}
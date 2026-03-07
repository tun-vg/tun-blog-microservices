namespace NotificationService.Services;

public interface IUserSubscriptionService
{
    Task<bool> IsSubscribed(string email);
    
    Task Subscribe(string email);
    
    Task Unsubscribe(string email);
}
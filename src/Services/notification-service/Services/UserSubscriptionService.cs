using NotificationService.Repositories;

namespace NotificationService.Services;

public class UserSubscriptionService : IUserSubscriptionService
{
    private readonly ISubscriptionRepository _subscriptionRepository;

    public UserSubscriptionService(ISubscriptionRepository subscriptionRepository)
    {
        _subscriptionRepository = subscriptionRepository;
    }

    public async Task<bool> IsSubscribed(string email)
    {
        return await _subscriptionRepository.CheckSubscription(email);
    }
    
    public async Task Subscribe(string email)
    {
        await _subscriptionRepository.Subscribe(email);
    }

    public async Task Unsubscribe(string email)
    {
        await _subscriptionRepository.Unsubscribe(email);
    }
}
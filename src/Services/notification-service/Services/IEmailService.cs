using NotificationService.Dtos;
using NotificationService.Messages;

namespace NotificationService.Services;

public interface IEmailService
{
    Task PublishMessageEmailAsync();
    
    Task SendEmailToSubscriberAsync(EmailMessage emailMessage);
}
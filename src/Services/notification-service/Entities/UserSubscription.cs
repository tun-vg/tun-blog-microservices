using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NotificationService.Entities;

[Table("user_subscription")]
public class UserSubscription
{
    [Key]
    public Guid UserSubscriptionId { get; set; }
    
    [EmailAddress]
    public string? Email { get; set; }
}
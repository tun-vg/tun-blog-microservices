using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NotificationService.Entities;

[Table("notification")]
public class Notification
{
    [Key]
    public Guid NotificationId { get; set; } = Guid.Empty;

    public Guid UserId { get; set; } = Guid.Empty;

    public string ContentVi { get; set; } = string.Empty;

    public string ContentEn { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool Status { get; set; }

    public bool Disable { get; set; }

    public string Link { get; set; } = string.Empty;
}

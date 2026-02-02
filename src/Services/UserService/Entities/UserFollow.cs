using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Entities;

[Table("user_follow")]
public class UserFollow
{
    [Key]
    public Guid UserFollowId { get; set; }
    
    public string? FollowerId { get; set; }
    
    public string? FollowingId { get; set; }
    
    public DateTime CreatedAt { get; set; }
}
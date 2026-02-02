using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Entities;

[Table("user_profile_extend")]
public class UserProfileExtend
{
    [Key]
    public Guid UserProfileExtendId { get; set; }
    
    public string? UserId { get; set; }
    
    public int FollowersCount { get; set; }
    
    public int FollowingCount { get; set; }
    
    public string? AvatarUrl { get; set; }
    
    public DateTime CreatedAt { get; set; }
    
    public DateTime UpdatedAt { get; set; }
}
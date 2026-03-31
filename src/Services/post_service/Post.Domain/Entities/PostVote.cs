using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Post.Domain.Entities;

[Table("post_vote")]
public class PostVote
{
    [Key]
    public Guid PostVoteId { get; set; } = Guid.NewGuid();
    
    public Guid PostId { get; set; } = Guid.Empty;
    
    public Post? Post { get; set; }
    
    public Guid UserId { get; set; } = Guid.Empty;
    
    public byte TypeVote { get; set; }

    public DateTime? CreatedAt { get; set; }
}
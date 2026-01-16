using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace comment_service.Entities;

[Table("comment_reaction")]
public class CommentReaction
{
    [Key]
    public Guid CommentReactionId { get; set; }

    public Guid CommentId { get; set; }

    [JsonIgnore]
    public Comment? Comment { get; set; }

    public Guid UserId { get; set; }
}

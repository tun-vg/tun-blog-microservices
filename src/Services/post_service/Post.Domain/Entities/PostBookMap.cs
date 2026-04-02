using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Post.Domain.Entities;

[Table("post_book_mark")]
public class PostBookMark
{
    [Key]
    public Guid PostBookMarkId { get; set; }
    
    public Guid UserId { get; set; }
    
    public Guid PostId { get; set; }
    
    public DateTime CreatedAt { get; set; }
}
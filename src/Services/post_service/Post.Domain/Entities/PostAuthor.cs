using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Post.Domain.Entities;

[Table("post_author")]
public class PostAuthor
{
    [Key]
    public Guid PostAuthorId { get; set; } = Guid.Empty;

    public Guid AuthorId { get; set; } = Guid.Empty;
    
    public string Email { get; set; } = string.Empty;
    
    public string UserName { get; set; } = string.Empty;
    
    public string FirstName { get; set; } = string.Empty;
    
    public string LastName { get; set; } = string.Empty;
    
    public string AvatarUrl { get; set; } = string.Empty;
}
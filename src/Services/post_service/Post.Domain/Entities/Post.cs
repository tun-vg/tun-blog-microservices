using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Domain.Entities;

[Table("post")]
public class Post : BaseEntity
{
    [Key]
    public Guid PostId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public Guid AuthorId { get; set; }

    public Guid CategoryId { get; set; }

    public Category? Category { get; set; }

    public bool Approved { get; set; }

    public int Point { get; set; }

    public int UpPoint { get; set; }

    public int DownPoint { get; set; }

    public int ViewCount { get; set; }

    public double ReadingTime { get; set; }

    public byte Status { get; set; }

    public ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();
    
    public Post() { }

    public Post(Guid postId, string title, string slug, string content, Guid authorId, Guid categoryId, bool approved, int point, int upPoint, int downPoint, int viewCount, double readingTime, byte status, DateTime? updateAt)
    {
        PostId = postId;
        Title = title;
        Slug = slug;
        Content = content;
        AuthorId = authorId;
        CategoryId = categoryId;
        Approved = approved;
        Point = point;
        UpPoint = upPoint;
        DownPoint = downPoint;
        ViewCount = viewCount;
        ReadingTime = readingTime;
        Status = status;
        base.CreatedAt = DateTime.UtcNow;
        base.UpdatedAt = updateAt;
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Post.Domain.Entities;

namespace Post.Application.Dtos;

public class PostDto
{
    public Guid PostId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Slug { get; set; }

    public string Content { get; set; } = string.Empty;

    public Guid AuthorId { get; set; }

    public Guid CategoryId { get; set; }

    public int Approved { get; set; }

    public int ViewCount { get; set; }

    public int Point { get; set; }

    public int UpPoint { get; set; }

    public int DownPoint { get; set; }

    public int ReadingTime { get; set; }

    public ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public string? ImageUrl { get; set; }
}
using Post.Application.Dtos;

namespace Post.API.Dtos;

public class CreatePostRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid AuthorId { get; set; }
    public Guid CategoryId { get; set; }
    public ICollection<TagDto> PostTags { get; set; } = new List<TagDto>();
    public IFormFile? Image { get; set; }
}

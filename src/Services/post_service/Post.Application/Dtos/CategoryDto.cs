namespace Post.Application.Dtos;

public class CategoryDto
{
    public Guid CategoryId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public List<TagDto> Tags { get; set; } = new List<TagDto>();
}
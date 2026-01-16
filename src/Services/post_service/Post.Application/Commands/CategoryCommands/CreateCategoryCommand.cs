using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;

namespace Post.Application.Commands.CategoryCommands;

public class CreateCategoryCommand : IRequest<Result>
{
    public string Name { get; set; } = string.Empty;
    
    public string Slug { get; set; } = string.Empty;
    
    public List<TagDto> Tags { get; set; } = new List<TagDto>();
}
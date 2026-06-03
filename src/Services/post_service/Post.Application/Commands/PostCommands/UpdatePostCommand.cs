using System;
using System.Collections.Generic;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;

namespace Post.Application.Commands.PostCommands;

public class UpdatePostCommand : IRequest<Result>
{
    public Guid PostId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid CategoryId { get; set; } = Guid.Empty;
    public ICollection<TagDto> PostTags { get; set; } = new List<TagDto>();
}

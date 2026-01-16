using MediatR;
using Microsoft.AspNetCore.Http;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Application.Commands.PostCommands;

public class CreatePostCommand : IRequest<Result>
{
    public string Title { get; set; } = string.Empty;

    public string? Slug { get; set; }

    public string Content { get; set; } = string.Empty;

    public Guid AuthorId { get; set; } = Guid.Empty;

    public Guid CategoryId { get; set; } = Guid.Empty;

    public ICollection<TagDto> PostTags { get; set; } = new List<TagDto>();

    public byte[] ImageBytes { get; set; } = Array.Empty<byte>();

    public string? ImageFileName { get; set; }
}

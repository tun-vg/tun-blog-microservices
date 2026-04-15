using MediatR;
using Post.Application.Dtos;
using Post.Contract.Attributes;

namespace Post.Application.Queries.PostQueries;

[Cached("posts-top:size={Size}", 86400)]
public class GetTopPostsQuery : IRequest<List<PostDto>>
{
    public int Size { get; set; }
}
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Attributes;

namespace Post.Application.Queries.PostQueries;

[Cached("book-mark-posts:user={UserId}:page={Page}:size={PageSize}")]
public class GetBookMarkPostsQuery : IRequest<PagedResult<PostDto>>
{
    public int Page { get; set; }
    
    public int PageSize { get; set; }
    
    public Guid UserId { get; set; }
}
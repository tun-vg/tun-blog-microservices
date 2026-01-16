using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Attributes;

namespace Post.Application.Queries.PostQueries;

[Cached("posts:page={Page}:size={PageSize}:search={Search}:sort={SortBy}:desc={IsDescending}", 600)]
public class GetPostsQuery : IRequest<PagedResult<PostDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public string? SortBy { get; set; } = "CreatedAt";
    public bool IsDescending { get; set; } = false;

    public GetPostsQuery(int page, int pageSize, string? search, string? sortBy, bool isDescending)
    {
        Page = page;
        PageSize = pageSize;
        Search = search;
        SortBy = sortBy;
        IsDescending = isDescending;
    }
}

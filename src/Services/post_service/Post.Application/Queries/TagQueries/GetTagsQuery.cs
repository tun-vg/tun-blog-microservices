using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Attributes;

namespace Post.Application.Queries.TagQueries;

[Cached("tags:page={Page}:size={PageSize}:search={Search}:sort={SortBy}:desc={IsDescending}", 600)]
public class GetTagsQuery : IRequest<PagedResult<TagDto>>
{
    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 10;

    public string? Search { get; set; }

    public string? SortBy { get; set; } = "CreatedAt";

    public bool IsDescending { get; set; } = false;

    public GetTagsQuery(int page, int pageSize, string? search, string? sortBy, bool isDescending)
    {
        Page = page;
        PageSize = pageSize;
        Search = search;
        SortBy = sortBy;
        IsDescending = isDescending;
    }
}

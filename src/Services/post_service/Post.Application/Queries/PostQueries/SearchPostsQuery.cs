using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Application.Queries.PostQueries;

[Cached("post:search={Search}:type={Type}:page={Page}:PageSize={PageSize}", 600)]
public class SearchPostsQuery : IRequest<PagedResult<Object>>
{
    public string? Search { get; set; }

    public string? Type { get; set; }

    public int Page { get; set; }

    public int PageSize { get; set; }
}

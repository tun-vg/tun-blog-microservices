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

[Cached("posts-user:{UserId}", 600)]
public class GetPostsByUserIdQuery : IRequest<PagedResult<PostDto>>
{
    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 15;

    public string UserId { get; set; }



    public GetPostsByUserIdQuery(int page, int pageSize, string userId)
    {
        Page = page;
        PageSize = pageSize;
        UserId = userId;
    }
}

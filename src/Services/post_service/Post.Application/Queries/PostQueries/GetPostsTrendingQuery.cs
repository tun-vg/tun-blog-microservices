using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Attributes;

namespace Post.Application.Queries.PostQueries;

[Cached("posts-trending:month={Month}:year={Year}:size={Size}", 600)]
public class GetPostsTrendingQuery : IRequest<PagedResult<PostDto>>
{
    public int Month { get; set; }

    public int Year { get; set; }

    public int Size { get; set; }

    public GetPostsTrendingQuery(int month, int year, int size)
    {
        Month = month;
        Year = year;
        Size = size;
    }
}

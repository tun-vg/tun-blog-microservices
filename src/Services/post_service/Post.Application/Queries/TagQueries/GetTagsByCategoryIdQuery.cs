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

[Cached("tag:by-category:{CategoryId}", 600)]
public class GetTagsByCategoryIdQuery : IRequest<PagedResult<TagDto>>
{
    public Guid? CategoryId { get; set; }

    public GetTagsByCategoryIdQuery(Guid? categoryId)
    {
        CategoryId = categoryId;
    }

}

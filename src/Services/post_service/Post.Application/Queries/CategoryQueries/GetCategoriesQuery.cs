using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Attributes;

namespace Post.Application.Queries.CategoryQueries;

[Cached("categories:getAll", 600)]
public class GetCategoriesQuery : IRequest<PagedResult<CategoryDto>>
{

}

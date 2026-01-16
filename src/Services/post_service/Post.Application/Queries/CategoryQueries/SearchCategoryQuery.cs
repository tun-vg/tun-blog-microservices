using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Contract.Abstractions;

namespace Post.Application.Queries.CategoryQueries;

public class SearchCategoryQuery : IRequest<Result>
{
    public string CategoryName { get; set; } = string.Empty;
}

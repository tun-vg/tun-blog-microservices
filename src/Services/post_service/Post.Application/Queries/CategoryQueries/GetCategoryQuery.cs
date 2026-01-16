using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Contract.Abstractions;

namespace Post.Application.Queries.CategoryQueries;

public class GetCategoryQuery : IRequest<Result>
{
    public Guid CategoryId { get; set; } = Guid.Empty;

    public GetCategoryQuery(Guid categoryId)
    {
        CategoryId = categoryId;
    }
}

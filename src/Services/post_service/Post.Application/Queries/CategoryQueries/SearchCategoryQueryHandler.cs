using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;

namespace Post.Application.Queries.CategoryQueries;

public class SearchCategoryQueryHandler : IRequestHandler<SearchCategoryQuery, Result>
{
    private readonly ICategoryRepository _categoryRepository;

    public SearchCategoryQueryHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<Result> Handle(SearchCategoryQuery request, CancellationToken cancellationToken)
    {
        var resultSearched = await _categoryRepository.SearchCategoryByName(request.CategoryName);
        return Result.Success(resultSearched);
    }
}

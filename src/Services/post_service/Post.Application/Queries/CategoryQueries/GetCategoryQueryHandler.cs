using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;

namespace Post.Application.Queries.CategoryQueries;

public class GetCategoryQueryHandler : IRequestHandler<GetCategoryQuery, Result>
{
    private readonly ICategoryRepository _categoryRepository;

    private readonly IMapper _mapper;

    public GetCategoryQueryHandler(ICategoryRepository categoryRepository, IMapper mapper)
    {
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<Result> Handle(GetCategoryQuery request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetById(request.CategoryId);
        if (category is null)
        {
            return Result.Failure(new Error("404", "Not found!"));
        }
        return Result.Success(_mapper.Map<CategoryDto>(category));
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;
using Post.Domain.Entities;

namespace Post.Application.Commands.CategoryCommands;

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, Result>
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public UpdateCategoryCommandHandler(ICategoryRepository categoryRepository, IMapper mapper)
    {
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<Result> Handle(UpdateCategoryCommand command, CancellationToken cancellationToken)
    {
        Category category = new Category
        {
            CategoryId = command.CategoryId,
            Name = command.Name
        };
        await _categoryRepository.UpdateCategory(category);
        return Result.Success(category);
    }
}

using AutoMapper;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;
using Post.Domain.Entities;

namespace Post.Application.Commands.CategoryCommands;

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Result>
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly ITagRepository _tagRepository;
    private readonly IMapper _mapper;
    
    public CreateCategoryCommandHandler(ICategoryRepository categoryRepository, ITagRepository tagRepository, IMapper mapper)
    {
        _categoryRepository = categoryRepository;
        _tagRepository = tagRepository;
        _mapper = mapper;
    }

    public async Task<Result> Handle(CreateCategoryCommand command, CancellationToken cancellationToken)
    {
        Category category = new Category
        {
            Name = command.Name,
            Slug = command.Slug
        };

        await _categoryRepository.CreateCategory(category);

        foreach (var tagDto in command.Tags)
        {
            tagDto.CategoryId = category.CategoryId;
        }
        
        var tags = _mapper.Map<List<Tag>>(command.Tags);
        await _tagRepository.SaveTags(tags);
        var categoryDto = _mapper.Map<CategoryDto>(category);
        return Result.Success(categoryDto);
    }
}
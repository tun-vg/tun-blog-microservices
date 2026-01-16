using AutoMapper;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;
using Post.Contract.Services;
using Post.Domain.Entities;

namespace Post.Application.Commands.TagCommands;

public class CreateTagCommandHandler : IRequestHandler<CreateTagCommand, Result>
{
    private readonly ITagRepository _tagRepository;
    private readonly IMapper _mapper;
    private readonly ICacheVersionManager _cacheVersionManager;

    public CreateTagCommandHandler(ITagRepository tagRepository, IMapper mapper, ICacheVersionManager cacheVersionManager)
    {
        _tagRepository = tagRepository;
        _mapper = mapper;
        _cacheVersionManager = cacheVersionManager;
    }

    public async Task<Result> Handle(CreateTagCommand request, CancellationToken cancellationToken)
    {
        Tag tag = new Tag
        {
            TagId = new Guid(),
            Name = request.Name,
            Slug = request.Slug,
            CategoryId = request.CategoryId
        };
        await _tagRepository.SaveTag(tag);
        TagDto tagDto = _mapper.Map<TagDto>(tag);
        await _cacheVersionManager.BumpVersionAsync("gettags");
        return Result.Success(tagDto);
    }
}


using System.Xml.Serialization;
using MediatR;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;
using Post.Contract.Services;

namespace Post.Application.Commands.TagCommands;

public class UpdateTagCommandHandler : IRequestHandler<UpdateTagCommand, Result>
{
    private readonly ITagRepository _tagRepository;
    private readonly ICacheVersionManager _cacheVersionManager;

    public UpdateTagCommandHandler(ITagRepository tagRepository, ICacheVersionManager cacheVersionManager)
    {
        _tagRepository = tagRepository;
        _cacheVersionManager = cacheVersionManager;
    }

    public async Task<Result> Handle(UpdateTagCommand command, CancellationToken cancellationToken)
    {
        var tag = await _tagRepository.GetTagById(command.TagId);
        if (tag == null)
        {
            return Result.Failure(new Error("404", "Tag not found"));
        }
        tag.Name = command.Name;
        tag.Slug = command.Slug;
        await _tagRepository.UpdateTag(tag);

        await _cacheVersionManager.BumpVersionAsync("gettags");
        return Result.Success(tag);
    }
}

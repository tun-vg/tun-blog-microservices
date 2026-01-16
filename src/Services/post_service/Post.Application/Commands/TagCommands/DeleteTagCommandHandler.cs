using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;
using Post.Contract.Services;

namespace Post.Application.Commands.TagCommands;

public class DeleteTagCommandHandler : IRequestHandler<DeleteTagCommand, Result>
{
    private readonly ITagRepository _tagRepository;
    private readonly ICacheVersionManager _cacheVersionManager;

    public DeleteTagCommandHandler(ITagRepository tagRepository, ICacheVersionManager cacheVersionManager)
    {
        _tagRepository = tagRepository;
        _cacheVersionManager = cacheVersionManager;
    }

    public async Task<Result> Handle(DeleteTagCommand commnad, CancellationToken cancellationToken)
    {
        await _tagRepository.DeleteTag(commnad.TagId);
        await _cacheVersionManager.BumpVersionAsync("gettags");
        return Result.Success();
    }
}

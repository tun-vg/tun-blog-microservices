using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Contract.Repositories;

namespace Post.Application.Commands.PostCommands;

public class DeletePostCommandHandler : IRequestHandler<DeletePostCommand, bool>
{
    private readonly IPostRepository _postRepository;
    private readonly IPostTagRepository _postTagRepository;
    private readonly IPostBookMarkRepository _postBookMarkRepository;

    public DeletePostCommandHandler(
        IPostRepository postRepository,
        IPostTagRepository postTagRepository,
        IPostBookMarkRepository postBookMarkRepository)
    {
        _postRepository = postRepository;
        _postTagRepository = postTagRepository;
        _postBookMarkRepository = postBookMarkRepository;
    }

    public async Task<bool> Handle(DeletePostCommand command, CancellationToken cancellationToken)
    {
        await _postTagRepository.DeletePostTagByPostId(command.PostId);
        await _postBookMarkRepository.DeleteBookMarkByPostId(command.PostId);
        return await _postRepository.DeletePost(command.PostId);
    }
}

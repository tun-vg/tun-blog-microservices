using MediatR;
using Post.Application.Dtos;
using Post.Contract.Repositories;

namespace Post.Application.Commands.PostCommands;

public class DownVotePostCommandHandler : IRequestHandler<DownVotePostCommand, VotePostResponse>
{
    private readonly IPostRepository _postRepository;
    
    public DownVotePostCommandHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<VotePostResponse> Handle(DownVotePostCommand request, CancellationToken cancellationToken)
    {
        var(point, action) = await _postRepository.DownVotePost(request.PostId, request.UserId, request.Action);
        var result = new VotePostResponse()
        {
            Point = point,
            Action = (UpVoteAction)action
        };
        return result;
    }
}
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Repositories;

namespace Post.Application.Commands.PostCommands;

public class UpVotePostCommandHandler : IRequestHandler<UpVotePostCommand, VotePostResponse>
{
    private readonly IPostRepository _postRepository;
    
    public UpVotePostCommandHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<VotePostResponse> Handle(UpVotePostCommand request, CancellationToken cancellationToken)
    {
        var(point, action) = await _postRepository.UpVotePost(request.PostId, request.UserId);
        var result = new VotePostResponse()
        {
            Point = point,
            Action = (UpVoteAction)action
        };
        return result;
    }
}
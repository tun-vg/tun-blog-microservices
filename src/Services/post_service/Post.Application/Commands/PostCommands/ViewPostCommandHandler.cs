using MediatR;
using Post.Contract.Repositories;

namespace Post.Application.Commands.PostCommands;

public class ViewPostCommandHandler : IRequestHandler<ViewPostCommand>
{
    private readonly IPostRepository _postRepository;
    
    public ViewPostCommandHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }
    
    public async Task Handle(ViewPostCommand request, CancellationToken cancellationToken)
    {
        await _postRepository.ViewPost(request.PostId);
    }
}
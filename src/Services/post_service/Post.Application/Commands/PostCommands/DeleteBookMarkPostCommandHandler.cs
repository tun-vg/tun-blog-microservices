using MediatR;
using Post.Contract.Repositories;

namespace Post.Application.Commands.PostCommands;

public class DeleteBookMarkPostCommandHandler : IRequestHandler<DeleteBookMarkPostCommand, bool>
{
    private readonly IPostRepository _postRepository;
    
    public DeleteBookMarkPostCommandHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<bool> Handle(DeleteBookMarkPostCommand request, CancellationToken cancellationToken)
    {
        return await _postRepository.RemoveBookMarkPost(request.PostId, request.UserId);
    }
}
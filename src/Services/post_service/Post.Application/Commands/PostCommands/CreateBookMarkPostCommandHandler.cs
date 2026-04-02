using MediatR;
using Post.Contract.Repositories;

namespace Post.Application.Commands.PostCommands;

public class CreateBookMarkPostCommandHandler : IRequestHandler<CreateBookMarkPostCommand, bool>
{
    private readonly IPostRepository _postRepository;
    
    public CreateBookMarkPostCommandHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<bool> Handle(CreateBookMarkPostCommand request, CancellationToken cancellationToken)
    {
        return await _postRepository.AddBookMarkPost(request.PostId, request.UserId);
    }
}
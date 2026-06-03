using MediatR;
using Post.Contract.Repositories;

namespace Post.Application.Commands.PostCommands;

public class CreateBookMarkPostCommandHandler : IRequestHandler<CreateBookMarkPostCommand, bool>
{
    private readonly IPostBookMarkRepository _postBookMarkRepository;
    
    public CreateBookMarkPostCommandHandler(IPostBookMarkRepository postBookMarkRepository)
    {
        _postBookMarkRepository = postBookMarkRepository;
    }

    public async Task<bool> Handle(CreateBookMarkPostCommand request, CancellationToken cancellationToken)
    {
        return await _postBookMarkRepository.AddBookMarkPost(request.PostId, request.UserId);
    }
}
using MediatR;
using Post.Contract.Repositories;

namespace Post.Application.Commands.PostCommands;

public class DeleteBookMarkPostCommandHandler : IRequestHandler<DeleteBookMarkPostCommand, bool>
{
    private readonly IPostBookMarkRepository _postBookMarkRepository;
    
    public DeleteBookMarkPostCommandHandler(IPostBookMarkRepository postBookMarkRepository)
    {
        _postBookMarkRepository = postBookMarkRepository;
    }

    public async Task<bool> Handle(DeleteBookMarkPostCommand request, CancellationToken cancellationToken)
    {
        return await _postBookMarkRepository.RemoveBookMarkPost(request.PostId, request.UserId);
    }
}
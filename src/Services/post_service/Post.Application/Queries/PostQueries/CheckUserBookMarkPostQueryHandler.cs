using MediatR;
using Post.Contract.Repositories;

namespace Post.Application.Queries.PostQueries;

public class CheckUserBookMarkPostQueryHandler : IRequestHandler<CheckUserBookMarkPostQuery, bool>
{
    private readonly IPostBookMarkRepository _postBookMarkRepository;
    
    public CheckUserBookMarkPostQueryHandler(IPostBookMarkRepository postBookMarkRepository)
    {
        _postBookMarkRepository = postBookMarkRepository;
    }

    public async Task<bool> Handle(CheckUserBookMarkPostQuery request, CancellationToken cancellationToken)
    {
        return await _postBookMarkRepository.CheckUserBookMarkPost(request.PostId,request.UserId);
    }
}
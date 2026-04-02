using AutoMapper;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Repositories;

namespace Post.Application.Queries.PostQueries;

public class CheckUserBookMarkPostQueryHandler : IRequestHandler<CheckUserBookMarkPostQuery, bool>
{
    private readonly IPostRepository _postRepository;
    private readonly IMapper _mapper;

    public CheckUserBookMarkPostQueryHandler(IPostRepository postRepository, IMapper mapper)
    {
        _postRepository = postRepository;
        _mapper = mapper;
    }

    public async Task<bool> Handle(CheckUserBookMarkPostQuery request, CancellationToken cancellationToken)
    {
        return await _postRepository.CheckUserBookMarkPost(request.PostId,request.UserId);
    }
}
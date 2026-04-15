using AutoMapper;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Repositories;

namespace Post.Application.Queries.PostQueries;

public class GetTopPostsQueryHandler : IRequestHandler<GetTopPostsQuery, List<PostDto>>
{
    private readonly IPostRepository _postRepository;
    private readonly IMapper _mapper;
    
    public GetTopPostsQueryHandler(IPostRepository postRepository, IMapper mapper)
    {
        _postRepository = postRepository;
        _mapper = mapper;
    }

    public async Task<List<PostDto>> Handle(GetTopPostsQuery request, CancellationToken cancellationToken)
    {
        var topPosts = await _postRepository.GetTopPosts(request.Size);
        return _mapper.Map<List<PostDto>>(topPosts);
    }
}
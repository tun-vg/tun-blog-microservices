using AutoMapper;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;

namespace Post.Application.Queries.PostQueries;

public class GetBookMarkPostsQueryHandler : IRequestHandler<GetBookMarkPostsQuery, PagedResult<PostDto>>
{
    private readonly IPostRepository _postRepository;
    private readonly IMapper _mapper;
    
    public GetBookMarkPostsQueryHandler(IPostRepository postRepository, IMapper mapper)
    {
        _postRepository = postRepository;
        _mapper = mapper;
    }

    public async Task<PagedResult<PostDto>> Handle(GetBookMarkPostsQuery request, CancellationToken cancellationToken)
    {
        var (posts, totalCount) = await _postRepository.GetBookMarkPostsByUserId(request.Page, request.PageSize, request.UserId);
        var postDtos = _mapper.Map<List<PostDto>>(posts);
        return PagedResult<PostDto>.Create(postDtos, request.Page, request.PageSize, totalCount);
    }
}
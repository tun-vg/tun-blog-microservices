using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;
using Post.Domain.Entities;

namespace Post.Application.Queries.PostQueries;

public class GetPostByIdQueryHandler : IRequestHandler<GetPostByIdQuery, Result>
{
    private readonly IPostRepository _postRepository;
    private readonly IPostTagRepository _postTagRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public GetPostByIdQueryHandler(IPostRepository postRepository, IPostTagRepository postTagRepository, ICategoryRepository categoryRepository, IMapper mapper)
    {
        _postRepository = postRepository;
        _postTagRepository = postTagRepository;
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }
    public async Task<Result> Handle(GetPostByIdQuery request, CancellationToken cancellationToken)
    {
        Post.Domain.Entities.Post post = await _postRepository.GetPostById(request.PostId);
        List<PostTag> postTags = await _postTagRepository.GetPostTagsByPostId(request.PostId);
        //Category category = await _categoryRepository.GetById(post.CategoryId);
        post.PostTags = postTags;
        //post.Category.CategoryId = category.CategoryId;
        //post.Category.Name = category.Name;
        return Result.Success(post);
    }
}

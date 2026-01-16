using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;
using Post.Contract.Services;

namespace Post.Application.Commands.PostCommands;

public class UpdatePostCommandHandler : IRequestHandler<UpdatePostCommand, Result>
{
    private readonly IPostRepository _postRepository;
    private readonly ICacheVersionManager _cacheVersionManager;

    public UpdatePostCommandHandler(IPostRepository postRepository, ICacheVersionManager cacheVersionManager)
    {
        _postRepository = postRepository;
        _cacheVersionManager = cacheVersionManager;
    }

    public async Task<Result> Handle(UpdatePostCommand request, CancellationToken cancellationToken)
    {
        var post = await _postRepository.GetPostById(request.PostId);
        if (post == null)
        {
            return Result.Failure(new Error("404", "Post not found"));
        }
        post.Title = request.Title;
        post.Slug = request.Slug;
        post.Content = request.Content;
        post.CategoryId = request.CategoryId;
        await _postRepository.UpdatePost(post);

        await _cacheVersionManager.BumpVersionAsync("getposts");

        return Result.Success();
    }
}

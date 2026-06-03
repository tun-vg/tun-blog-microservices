using System;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;
using Post.Contract.Services;
using Post.Domain.Entities;

namespace Post.Application.Commands.PostCommands;

public class UpdatePostCommandHandler : IRequestHandler<UpdatePostCommand, Result>
{
    private readonly IPostRepository _postRepository;
    private readonly ICacheVersionManager _cacheVersionManager;
    private readonly IPostTagRepository _postTagRepository;

    public UpdatePostCommandHandler(
        IPostRepository postRepository, 
        ICacheVersionManager cacheVersionManager,
        IPostTagRepository postTagRepository)
    {
        _postRepository = postRepository;
        _cacheVersionManager = cacheVersionManager;
        _postTagRepository = postTagRepository;
    }

    public async Task<Result> Handle(UpdatePostCommand request, CancellationToken cancellationToken)
    {
        var post = await _postRepository.GetPostById(request.PostId);
        if (post == null)
        {
            return Result.Failure(new Error("404", "Post not found"));
        }
        
        post.Title = request.Title;
        post.Slug = CreatePostCommandHandler.ToSlug(request.Title);
        post.Content = request.Content;
        post.CategoryId = request.CategoryId;
        await _postRepository.UpdatePost(post);

        // Check if PostTags have changed
        await UpdatePostTagsIfChanged(request.PostId, request.PostTags);

        await _cacheVersionManager.BumpVersionAsync("getposts");

        return Result.Success();
    }

    private async Task UpdatePostTagsIfChanged(Guid postId, ICollection<TagDto> newPostTags)
    {
        // Get old tags from database
        var oldPostTags = await _postTagRepository.GetPostTagsByPostId(postId);
        
        // Get TagIds from new and old tags
        var oldTagIds = oldPostTags.Select(pt => pt.TagId).ToHashSet();
        var newTagIds = newPostTags.Select(pt => pt.TagId).ToHashSet();

        // Check if tags have changed
        bool tagsChanged = !oldTagIds.SetEquals(newTagIds);

        if (tagsChanged)
        {
            // Delete all old tags for this post
            await _postTagRepository.DeletePostTagByPostId(postId);

            // Add new tags
            if (newPostTags.Any())
            {
                var postTagsToAdd = newPostTags.Select(tagDto => new PostTag
                {
                    PostTagId = Guid.NewGuid(),
                    PostId = postId,
                    TagId = tagDto.TagId
                }).ToList();

                await _postTagRepository.SavePostTag(postTagsToAdd);
            }
        }
    }
}

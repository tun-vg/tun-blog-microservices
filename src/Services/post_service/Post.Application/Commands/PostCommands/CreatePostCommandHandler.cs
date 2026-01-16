using AutoMapper;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;
using Post.Contract.Services;
using Post.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Post.Application.Commands.PostCommands;

public class CreatePostCommandHandler : IRequestHandler<CreatePostCommand, Result>
{
    private readonly IPostRepository _postRepository;
    private readonly ITagRepository _tagRepository;
    private readonly IPostTagRepository _postTagRepository;
    private readonly IFileGrpcClient _fileGrpcClient;
    private readonly IMapper _mapper;

    public CreatePostCommandHandler(IPostRepository postRepository, ITagRepository tagRepository, IPostTagRepository postTagRepository, IFileGrpcClient fileGrpcClient, IMapper mapper)
    {
        _postRepository = postRepository;
        _tagRepository = tagRepository;
        _postTagRepository = postTagRepository;
        _fileGrpcClient = fileGrpcClient;
        _mapper = mapper;
    }

    public async Task<Result> Handle (CreatePostCommand command, CancellationToken cancellationToken)
    {
        Post.Domain.Entities.Post post = new Domain.Entities.Post
        {
            Title = command.Title,
            Slug = ToSlug(command.Title),
            Content = command.Content,
            AuthorId = command.AuthorId,
            CategoryId = command.CategoryId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _postRepository.SavePost(post);

        string? imageUrl = null;

        imageUrl = command.ImageBytes.Length > 0
            ? await _fileGrpcClient.UploadAsync(command.ImageBytes, command.ImageFileName ?? "", "posts", $"post-{post.PostId}")
            : null;

        List<PostTag> postTags = new List<PostTag>();
        foreach (var tagDto in command.PostTags)
        {
            Tag? tag = await _tagRepository.GetTagById(tagDto.TagId);
            if (tag != null)
            {
                postTags.Add(new PostTag
                {
                    PostId = post.PostId,
                    TagId = tag!.TagId,
                    TagName = tag != null ? tag.Name : ""
                });
            }
        }
        await _postTagRepository.SavePostTag(postTags);

        PostDto postDto = _mapper.Map<PostDto>(post);
        postDto.ImageUrl = imageUrl;
        var postTagDtos = _mapper.Map<List<PostTag>>(postTags);
        postDto.PostTags = postTagDtos;
        return Result.Success(postDto);
    }

    public static string ToSlug(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        // Bỏ dấu (normalize)
        string normalized = input.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();

        foreach (var c in normalized)
        {
            UnicodeCategory uc = CharUnicodeInfo.GetUnicodeCategory(c);
            if (uc != UnicodeCategory.NonSpacingMark)
            {
                sb.Append(c);
            }
        }

        string noDiacritics = sb.ToString()
            .Replace("đ", "d")
            .Replace("Đ", "D");

        // Thay khoảng trắng bằng gạch ngang
        string slug = Regex.Replace(noDiacritics, @"\s+", "-");

        // Chỉ giữ lại chữ cái, số và dấu '-'
        slug = Regex.Replace(slug, @"[^a-zA-Z0-9\-]", "");

        // Đưa về lowercase
        slug = slug.ToLowerInvariant();

        // Xử lý nhiều dấu '-' liên tiếp
        slug = Regex.Replace(slug, @"-+", "-").Trim('-');

        return slug;
    }
}

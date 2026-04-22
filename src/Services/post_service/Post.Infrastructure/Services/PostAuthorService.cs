using Post.Contract.Messages;
using Post.Contract.Repositories;
using Post.Contract.Services;
using Post.Domain.Entities;

namespace Post.Infrastructure.Services;

public class PostAuthorService : IPostAuthorService
{
    private readonly IPostAuthorRepository _postAuthorRepository;

    public PostAuthorService(IPostAuthorRepository postAuthorRepository)
    {
        _postAuthorRepository = postAuthorRepository;
    }

    public async Task UpdatePostAuthor(PostAuthorUpdatedEvent postAuthorUpdatedEvent)
    {
        var author = await _postAuthorRepository.GetPostAuthorByUserId(postAuthorUpdatedEvent.UserId);
        if (author.PostAuthorId != Guid.Empty)
        {
            author.Email = postAuthorUpdatedEvent.Email;
            author.FirstName = postAuthorUpdatedEvent.FirstName;
            author.LastName = postAuthorUpdatedEvent.LastName;
            author.AvatarUrl = postAuthorUpdatedEvent.AvatarUrl;
            await _postAuthorRepository.UpdatePostAuthor(author);
        }
    }
}
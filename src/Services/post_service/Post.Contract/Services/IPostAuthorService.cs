using Post.Contract.Messages;

namespace Post.Contract.Services;

public interface IPostAuthorService
{
    Task UpdatePostAuthor(PostAuthorUpdatedEvent postAuthorUpdatedEvent);
}
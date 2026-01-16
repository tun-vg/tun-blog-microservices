using comment_service.Common.Interfaces;
using comment_service.Entities;

namespace comment_service.Application.Commands;

public class CreateCommentCommand : ICommand<Comment>
{
    public string Content { get; set; }
    
    public Guid AuthorId { get; set; }
    
    public Guid PostId { get; set; }

    public Guid? UpperCommentId { get; set; }

    public CreateCommentCommand(string content, Guid authorId, Guid postId, Guid? upperCommentId)
    {
        Content = content;
        AuthorId = authorId;
        PostId = postId;
        UpperCommentId = upperCommentId;
    }
}
using comment_service.Common.Interfaces;
using comment_service.Entities;
using comment_service.IntegrationEvents;
using comment_service.Messaging.RabbitMQ;
using System.Text;
using System.Text.Json;

namespace comment_service.Application.Commands;

public class CreateCommentCommandHandler : ICommandHandler<CreateCommentCommand, Comment>
{
    private readonly ApplicationDBContext _context;
    private readonly ICacheVersionManagement _cacheVersionManagement;
    private readonly IRabbitMqProducer _rabbitMqProducer;

    public CreateCommentCommandHandler(ApplicationDBContext context, ICacheVersionManagement cacheVersionManagement, IRabbitMqProducer rabbitMqProducer)
    {
        _context = context;
        _cacheVersionManagement = cacheVersionManagement;
        _rabbitMqProducer = rabbitMqProducer;
    }

    public async Task<Comment> Handle(CreateCommentCommand command, CancellationToken cancellationToken)
    {
        Comment comment = new Comment
        {
            CommentId = Guid.NewGuid(),
            Content = command.Content,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            PostId = command.PostId,
            AuthorId = command.AuthorId,
            UpperCommentId = command.UpperCommentId
        };
        await _context.Comments.AddAsync(comment, cancellationToken);
        
        if (command.UpperCommentId != null)
        {
            var commentParent = await _context.Comments.FindAsync(command.UpperCommentId);
            if (commentParent != null)
            {
                commentParent.CommentReplyCount += 1;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        if (command.UpperCommentId == null)
        {
            await _cacheVersionManagement.BumpCacheVersionAsync($"GetCommentsByPostId:Post={command.PostId}");
        } else
        {
            await _cacheVersionManagement.BumpCacheVersionAsync($"GetCommentRepliesByCommentId:Comment={command.UpperCommentId}");
        }

        CommentCreatedEvent commentCreatedEvent = new CommentCreatedEvent
        {
            CommentId = comment.CommentId,
            PostId = comment.PostId,
            UserId = Guid.Empty,
            AuthorId = comment.AuthorId,
            CreatedAt = comment.CreatedAt
        };

        await _rabbitMqProducer.PublishAsync("created_comment", JsonSerializer.SerializeToUtf8Bytes(commentCreatedEvent));

        return comment;
    }
}
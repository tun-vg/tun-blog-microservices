using comment_service.Common.Interfaces;
using comment_service.Entities;
using System.Transactions;

namespace comment_service.Application.Commands;

public class LikeCommentCommandHandler : ICommandHandler<LikeCommentCommand, bool>
{
    private readonly ApplicationDBContext _context;

    public LikeCommentCommandHandler(ApplicationDBContext context)
    {
        _context = context;
    }

    //public async Task<bool> Handle(LikeCommentCommand command, CancellationToken cancellationToken)
    //{
    //    using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

    //    var comment = await _context.Comments.FindAsync(command.CommentId);
    //    if (comment == null)
    //    {
    //        throw new Exception("Comment not found");
    //    }
    //    else
    //    {
    //        comment.LikedCount++;
    //    }

    //    CommentReaction reaction = new CommentReaction
    //    {
    //        CommentReactionId = Guid.NewGuid(),
    //        CommentId = command.CommentId,
    //        UserId = command.UserId
    //    };

    //    await _context.CommentReactions.AddAsync(reaction, cancellationToken);
    //    var result = await _context.SaveChangesAsync(cancellationToken);
    //    await transaction.CommitAsync(cancellationToken);

    //    return result > 0;
    //}

    public async Task<bool> Handle(LikeCommentCommand command, CancellationToken cancellationToken)
    {
        using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        var comment = await _context.Comments.FindAsync(command.CommentId);
        if (comment == null)
            throw new Exception("Comment not found");

        // Tăng like
        comment.LikedCount++;

        // Thêm reaction
        var reaction = new CommentReaction
        {
            CommentReactionId = Guid.NewGuid(),
            CommentId = command.CommentId,
            UserId = command.UserId
        };

        await _context.CommentReactions.AddAsync(reaction, cancellationToken);

        // 👉 CHỈ save 1 lần
        var result = await _context.SaveChangesAsync(cancellationToken);

        await transaction.CommitAsync(cancellationToken);

        return result > 0;
    }
}

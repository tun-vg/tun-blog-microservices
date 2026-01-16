using comment_service.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace comment_service.Dtos
{
    public class CommentDto
    {
        public Guid CommentId { get; set; }

        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public Guid PostId { get; set; }

        public Guid AuthorId { get; set; }

        public int LikedCount { get; set; }

        public ICollection<CommentReaction> CommentReactions { get; set; } = new List<CommentReaction>();

        [NotMapped]
        public ICollection<Comment> CommentReplies { get; set; } = new List<Comment>();

        public Guid? UpperCommentId { get; set; }

        public int CommentReplyCount { get; set; }
    }
}

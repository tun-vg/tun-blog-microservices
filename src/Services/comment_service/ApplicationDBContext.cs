using comment_service.Entities;
using Microsoft.EntityFrameworkCore;

namespace comment_service;

public class ApplicationDBContext : DbContext
{
    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
    {
    }
    public DbSet<Comment> Comments { get; set; }

    public DbSet<CommentReaction> CommentReactions { get; set; }
}

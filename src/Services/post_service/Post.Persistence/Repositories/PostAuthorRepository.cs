using Microsoft.EntityFrameworkCore;
using Post.Contract.Repositories;
using Post.Domain.Entities;

namespace Post.Persistence.Repositories;

public class PostAuthorRepository : IPostAuthorRepository
{
    private readonly ApplicationDBContext _context;
    
    public PostAuthorRepository(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<PostAuthor> GetPostAuthorByUserId(string userId)
    {
        var author = await _context.PostAuthors
            .Where(pa => pa.AuthorId.ToString() == userId && 
                         _context.Posts.Any(p => p.AuthorId == pa.AuthorId))
            .FirstOrDefaultAsync();

        return author;
    }

    public async Task CreatePostAuthor(PostAuthor postAuthor)
    {
        await _context.PostAuthors.AddAsync(postAuthor);
        await _context.SaveChangesAsync();
    }

    public async Task UpdatePostAuthor(PostAuthor postAuthor)
    {
        var author = await _context.PostAuthors
            .Where(pa => pa.AuthorId == postAuthor.AuthorId)
            .FirstOrDefaultAsync();
        if (author != null)
        {
            author.Email = postAuthor.Email;
            author.FirstName = postAuthor.FirstName;
            author.LastName = postAuthor.LastName;
            author.AvatarUrl = postAuthor.AvatarUrl;
            await _context.SaveChangesAsync();
        }
        // else log author null
    }
}
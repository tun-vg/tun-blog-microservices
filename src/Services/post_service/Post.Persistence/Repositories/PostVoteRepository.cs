using Microsoft.EntityFrameworkCore;
using Post.Contract.Repositories;
using Post.Domain.Entities;

namespace Post.Persistence.Repositories;

public class PostVoteRepository : IPostVoteRepository
{
    private readonly ApplicationDBContext _context;
    
    public PostVoteRepository(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<List<PostVote>> GetPostVotes(Guid postId)
    {
        var postVotes = await _context.PostVotes
            .AsNoTracking()
            .Where(v => v.PostId == postId).ToListAsync();
        return postVotes;
    }
    
    public async Task<PostVote> GetPostVote(Guid postId, Guid userId, int typeVote)
    {
        var postVost = await _context.PostVotes.Where(v => v.PostId == postId && v.UserId == userId && v.TypeVote == typeVote).FirstOrDefaultAsync();
        return postVost;
    }

    public async Task AddPostVote(PostVote postVote)
    {
        await _context.PostVotes.AddAsync(postVote);
        await _context.SaveChangesAsync();
    }

    public async Task RemovePostVote(Guid postId, Guid userId, int typeVote)
    {
        var postVost = await _context.PostVotes.Where(v => v.PostId == postId && v.UserId == userId && v.TypeVote == typeVote).FirstOrDefaultAsync();
        if (postVost != null)
        {
            _context.PostVotes.Remove(postVost);
            await _context.SaveChangesAsync();
        }
    }
}
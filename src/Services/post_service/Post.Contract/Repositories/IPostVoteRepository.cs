using Post.Domain.Entities;

namespace Post.Contract.Repositories;

public interface IPostVoteRepository
{
    Task<List<PostVote>> GetPostVotes(Guid postId);
    
    Task<PostVote> GetPostVote(Guid postId, Guid userId, int typeVote);
    
    Task AddPostVote(PostVote postVote);
    
    Task RemovePostVote(Guid postId, Guid userId, int type);
}
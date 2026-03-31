namespace Post.Application.Dtos;

public class VotePostResponse
{
    public int Point { get; set; }
    
    public UpVoteAction Action { get; set; }
}

public enum UpVoteAction
{
    None = 0,   
    Up = 1,
    Down = 2,
    UnUp = 3,
    UnDown = 4
}
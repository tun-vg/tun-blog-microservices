using MediatR;
using Post.Application.Dtos;

namespace Post.Application.Queries.PostQueries;

public class CheckUserBookMarkPostQuery : IRequest<bool>
{
    public Guid PostId { get; set; }
    
    public Guid UserId { get; set; }
}
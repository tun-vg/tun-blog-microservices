using comment_service.Application.Commands;
using comment_service.Application.Queries;
using comment_service.Dispatcher;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace comment_service.Controllers;

[ApiController]
[Route("[controller]")]
public class CommentController : ControllerBase
{
    private readonly ICommandDispatcher _commandDispatcher;
    private readonly IQueryDispatcher _queryDispatcher;

    public CommentController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher)
    {
        _commandDispatcher = commandDispatcher;
        _queryDispatcher = queryDispatcher;
    }

    [HttpGet]
    [Route("/post/{postId}/comments")]
    public async Task<IActionResult> GetCommentByPostId(Guid postId, [FromQuery] bool hot)
    {
        GetCommentsByPostIdQuery query = new GetCommentsByPostIdQuery(postId, hot);
        var result = await _queryDispatcher.Send(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateComment(CreateCommentCommand command)
    {
        var result = await _commandDispatcher.Send(command);
     
        return Ok(result);
    }

    [HttpPost("/like-comment")]
    public async Task<IActionResult> LikeComment(LikeCommentCommand command)
    {
        var result = await _commandDispatcher.Send(command);

        return Ok(result);
    }

    [HttpGet("/comment-replies/{commentId}")]
    public async Task<IActionResult> GetCommentRepliesByCommentId(Guid commentId)
    {
        GetCommentRepliesByCommentIdQuery query = new GetCommentRepliesByCommentIdQuery(commentId);
        var result = await _queryDispatcher.Send(query);
        return Ok(result);
    }

    [HttpPost("/unlike-comment")]
    public async Task<IActionResult> UnlikeComment(UnLikeCommentCommand command)
    {
        var result = await _commandDispatcher.Send(command);
        return Ok(result);
    }

}
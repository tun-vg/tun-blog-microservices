using MediatR;
using Microsoft.AspNetCore.Mvc;
using Post.API.Dtos;
using Post.Application.Commands.PostCommands;
using Post.Application.Queries.PostQueries;

namespace Post.API.Controllers;

[ApiController]
[Route("[controller]")]
public class PostController : ControllerBase
{
    private readonly IMediator _mediator;

    public PostController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("get-posts")]
    public async Task<IActionResult> GetPosts([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string? search, [FromQuery] string? sortBy, [FromQuery] bool isDescending)
    {
        GetPostsQuery query = new GetPostsQuery(page, pageSize, search, sortBy, isDescending);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("get-post/{postId}")]
    public async Task<IActionResult> GetPost(Guid postId)
    {
        GetPostByIdQuery query = new GetPostByIdQuery(postId);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("create-post")]
    public async Task<IActionResult> CreatePost([FromForm] CreatePostRequestDto dto)
    {
        using var ms = new MemoryStream();
        if (dto.Image != null)
            await dto.Image.CopyToAsync(ms);

        var command = new CreatePostCommand
        {
            Title = dto.Title,
            Content = dto.Content,
            AuthorId = dto.AuthorId,
            CategoryId = dto.CategoryId,
            PostTags = dto.PostTags,
            ImageBytes = ms.ToArray(),
            ImageFileName = dto.Image?.FileName
        };

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("update-post")]
    public async Task<IActionResult> UpdatePost([FromBody] UpdatePostCommand command)
    {
        if (command == null)
        {
            return BadRequest();
        }
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("delete-post/{postId}")]
    public async Task<IActionResult> DeletePost(Guid postId)
    {
        var result = await _mediator.Send(new DeletePostCommand(postId));
        return Ok(result);
    }

    [HttpGet("get-posts-trending")]
    public async Task<IActionResult> GetTopPosts([FromQuery] int month, [FromQuery] int year, [FromQuery] int size)
    {
        var result = await _mediator.Send(new GetPostsTrendingQuery(month, year, size));
        return Ok(result);
    }

    [HttpGet("get-posts-by-userId")]
    public async Task<IActionResult> GetPostsByUserId([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string userId)
    {
        var result = await _mediator.Send(new GetPostsByUserIdQuery(page, pageSize, userId));
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string search,
                                            [FromQuery] string type,
                                            [FromQuery] int page,
                                            [FromQuery] int pageSize)
    {
        var query = new SearchPostsQuery
        {
            Search = search,
            Type = type,
            Page = page,
            PageSize = pageSize
        };

        var result = await _mediator.Send(query);
        return Ok(result);
    }
}

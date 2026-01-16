using MediatR;
using Microsoft.AspNetCore.Mvc;
using Post.Domain.Entities;
using Post.Application.Queries.TagQueries;
using Post.Application.Commands.TagCommands;
using System.Threading.Tasks;

namespace Post.API.Controllers;

[Route("[controller]")]
public class TagController : ControllerBase
{
    private readonly IMediator _mediator;

    public TagController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetTags(
        [FromQuery] int page,
        [FromQuery] int pageSize,
        [FromQuery] string? search,
        [FromQuery] string? sortBy,
        [FromQuery] bool isDescending
    )
    {
        GetTagsQuery query = new GetTagsQuery(page, pageSize, search, sortBy, isDescending);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTag(Guid id)
    {
        GetTagQuery query = new GetTagQuery(id);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTag([FromBody] CreateTagCommand command)
    {
        if (command == null)
        {
            return BadRequest("Tag cannot be null!");
        }
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateTag([FromBody] UpdateTagCommand command)
    {
        if (command == null)
        {
            return BadRequest("Tag cannot be null!");
        }
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTag(Guid id)
    {
        DeleteTagCommand command = new DeleteTagCommand(id);
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("get-tags-by-category/{categoryId}")]
    public async Task<IActionResult> GetTagsByCategoryId(Guid categoryId)
    {
        GetTagsByCategoryIdQuery query = new GetTagsByCategoryIdQuery(categoryId);
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}

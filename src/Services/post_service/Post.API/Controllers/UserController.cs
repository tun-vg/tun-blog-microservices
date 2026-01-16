using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Post.API.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserController(IMediator mediator)
    {
        _mediator = mediator;
    }

    //[HttpGet("get-user")]
    //public async Task<ActionResult> GetUser([FromQuery] string username)
    //{
    //    var query = new Post.Application.Queries.UserQueries.GetUserByUserName
    //    {
    //        UserName = username
    //    };
    //    var result = await _mediator.Send(query);
    //    return Ok(result);
    //}


}

using MediatR;
using Post.Contract.Abstractions;
using Post.Contract.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Application.Queries.UserQueries;

public class GetUserByUserNameHandler : IRequestHandler<GetUserByUserName, Result>
{
    private readonly IKeycloakService _keycloakService;
    public GetUserByUserNameHandler(IKeycloakService keycloakService)
    {
        _keycloakService = keycloakService;
    }

    public async Task<Result> Handle(GetUserByUserName request, CancellationToken cancellationToken)
    {
        var result = await _keycloakService.GetUserByUsername<Object>(request.UserName);
        return Result.Success(result);
    }
}

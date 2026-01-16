using MediatR;
using Post.Contract.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Application.Queries.UserQueries;

public class GetUserByUserName : IRequest<Result>
{

    public string UserName { get; set; }
}

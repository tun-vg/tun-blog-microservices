using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Contract.Abstractions;

namespace Post.Application.Commands.CategoryCommands;

public class DeleteCategoryCommand : IRequest<Result>
{
    public Guid CategoryId { get; set; } = Guid.Empty;

    public DeleteCategoryCommand(Guid categoryId)
    {
        CategoryId = categoryId;
    }
}

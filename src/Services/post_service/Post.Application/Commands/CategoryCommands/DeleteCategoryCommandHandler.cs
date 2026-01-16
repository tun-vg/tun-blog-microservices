using MediatR;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;

namespace Post.Application.Commands.CategoryCommands;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, Result>
{
    private readonly ICategoryRepository _categoryRepository;
    public DeleteCategoryCommandHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }
    public async Task<Result> Handle(DeleteCategoryCommand command, CancellationToken cancellationToken)
    {
        if (command.CategoryId == Guid.Empty)
        {
            return Result.Failure(new Error("1", "Invalid Category ID"));
        }
        await _categoryRepository.DeleteCategory(command.CategoryId);
        return Result.Success();
    }
}

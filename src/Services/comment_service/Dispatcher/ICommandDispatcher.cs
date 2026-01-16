using comment_service.Common.Interfaces;

namespace comment_service.Dispatcher;

public interface ICommandDispatcher
{
    Task<TResult> Send<TResult>(ICommand<TResult> command, CancellationToken cancellationToken = default);
}
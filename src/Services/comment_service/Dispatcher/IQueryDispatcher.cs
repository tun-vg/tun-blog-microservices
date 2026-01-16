using comment_service.Common.Interfaces;

namespace comment_service.Dispatcher;

public interface IQueryDispatcher
{
    Task<TResult> Send<TResult>(IQuery<TResult> query, CancellationToken cancellationToken = default);
}
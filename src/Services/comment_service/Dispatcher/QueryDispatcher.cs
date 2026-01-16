using comment_service.Common.Interfaces;
using System.Collections;

namespace comment_service.Dispatcher;

public class QueryDispatcher : IQueryDispatcher
{
    private readonly IServiceProvider _serviceProvider;

    public QueryDispatcher(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public Task<TResult> Send<TResult>(IQuery<TResult> query, CancellationToken cancellationToken = default)
    {
        var handlerType = typeof(IQueryHandler<,>)
            .MakeGenericType(query.GetType(), typeof(TResult));

        dynamic? handler = _serviceProvider.GetService(handlerType)
                           ?? throw new InvalidOperationException($"Handler for {query.GetType().Name} not found!");
        
        //return handler.Handle((dynamic)query, cancellationToken);

        RequestHandlerDelegate<TResult> final = () => handler.Handle((dynamic)query, cancellationToken);

        var behaviorType = typeof(IPipelineBehavior<,>)
            .MakeGenericType(query.GetType(), typeof(TResult));
        var enumerableType = typeof(IEnumerable<>).MakeGenericType(behaviorType);
        var behaviorsObj = _serviceProvider.GetService(enumerableType) ?? Activator.CreateInstance(typeof(List<>).MakeGenericType(behaviorType));
        var behaviors = ((IEnumerable)behaviorsObj!).Cast<dynamic>().Reverse();
        foreach (var behavior in behaviors)
        {
            var next = final;
            final = () => behavior.Handle((dynamic)query, cancellationToken, next);
        }

        return final();
    }
}
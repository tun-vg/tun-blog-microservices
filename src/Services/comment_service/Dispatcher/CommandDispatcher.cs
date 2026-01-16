using System.Windows.Input;
using comment_service.Common.Interfaces;

namespace comment_service.Dispatcher;

public class CommandDispatcher : ICommandDispatcher
{
    private readonly IServiceProvider _serviceProvider;
    
    public CommandDispatcher(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public Task<TResult> Send<TResult>(ICommand<TResult> command, CancellationToken cancellationToken = default)
    {
        var handlerType = typeof(ICommandHandler<,>)
            .MakeGenericType(command.GetType(), typeof(TResult));

        dynamic? handler = _serviceProvider.GetService(handlerType)
                           ?? throw new InvalidOperationException($"Handler for {command.GetType().Name} not found!");
        
        return handler.Handle((dynamic)command, cancellationToken);
    }
}
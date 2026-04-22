using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Post.Contract.Messages;
using Post.Contract.Services;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Post.Infrastructure.RabbitMQ.Consumers;

public class PostAuthorUpdateConsumer : BackgroundService
{
    private IConnection _connection;
    private IChannel _channel;
    private readonly RabbitMqConfig _rabbitMqConfig;
    private readonly IServiceProvider _serviceProvider;

    public PostAuthorUpdateConsumer(RabbitMqConfig rabbitMqConfig, IServiceProvider serviceProvider)
    {
        _rabbitMqConfig = rabbitMqConfig;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new ConnectionFactory()
        {
            HostName = _rabbitMqConfig.RabbitMqConnection.HostName,
            UserName = _rabbitMqConfig.RabbitMqConnection.UserName,
            Password = _rabbitMqConfig.RabbitMqConnection.Password,
            Port = _rabbitMqConfig.RabbitMqConnection.Port
        };

        _connection = await factory.CreateConnectionAsync();
        _channel = await _connection.CreateChannelAsync();
        
        await _channel.ExchangeDeclareAsync(exchange: _rabbitMqConfig.RabbitMqExchange.User, type: ExchangeType.Fanout);
        
        await _channel.QueueDeclareAsync(
            queue: "updated_user",
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null
        );

        await _channel.QueueBindAsync(
            queue: "updated_user",
            exchange: _rabbitMqConfig.RabbitMqExchange.User,
            routingKey: "updated_user"
        );

        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = System.Text.Encoding.UTF8.GetString(body);
            PostAuthorUpdatedEvent postAuthorUpdatedEvent = System.Text.Json.JsonSerializer.Deserialize<PostAuthorUpdatedEvent>(message)!;

            using var scope = _serviceProvider.CreateScope();
            var _postAuthorService = scope.ServiceProvider.GetRequiredService<IPostAuthorService>();
            await _postAuthorService.UpdatePostAuthor(postAuthorUpdatedEvent);
        };
        
        await _channel.BasicConsumeAsync(
            queue: "updated_user",
            autoAck: true,
            consumer: consumer
        );
    }

    public override void Dispose()
    {
        _channel?.CloseAsync();
        _connection?.CloseAsync();
        base.Dispose();
    }
}
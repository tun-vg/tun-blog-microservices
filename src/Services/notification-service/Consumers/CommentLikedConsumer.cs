using System.Text;
using NotificationService.Messages;
using NotificationService.RabbitMQ;
using NotificationService.Services;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace NotificationService.Consumers;

public class CommentLikedConsumer : BackgroundService
{
    private IConnection? _connection;
    private IChannel? _channel;
    private readonly RabbitMqConfig _rabbitMqConfig;
    private readonly IServiceProvider _serviceProvider;

    public CommentLikedConsumer(RabbitMqConfig rabbitMqConfig, IServiceProvider serviceProvider)
    {
        _rabbitMqConfig = rabbitMqConfig;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new ConnectionFactory
        {
            HostName = _rabbitMqConfig.RabbitMqConnection.HostName,
            Port = _rabbitMqConfig.RabbitMqConnection.Port,
            UserName = _rabbitMqConfig.RabbitMqConnection.UserName,
            Password = _rabbitMqConfig.RabbitMqConnection.Password
        };

        _connection = await factory.CreateConnectionAsync();
        _channel = await _connection.CreateChannelAsync();

        await _channel.QueueDeclareAsync(
            queue: "liked_comment",
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null
        );

        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            CommentLikedEvent commentLikedEvent =
                System.Text.Json.JsonSerializer.Deserialize<CommentLikedEvent>(message);

            using var scope = _serviceProvider.CreateScope();
            var _notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
            await _notificationService.SendNotificationAsync(commentLikedEvent);
        };

        await _channel.BasicConsumeAsync(
            queue: "liked_comment",
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
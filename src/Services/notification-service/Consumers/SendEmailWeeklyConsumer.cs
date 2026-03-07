using System.Text;
using NotificationService.Messages;
using NotificationService.RabbitMQ;
using NotificationService.Services;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace NotificationService.Consumers;

public class SendEmailWeeklyConsumer : BackgroundService
{
    private IConnection? _connection;
    private IChannel? _channel;
    private readonly RabbitMqConfig _rabbitMqConfig;
    private readonly IServiceProvider _serviceProvider;
    
    public SendEmailWeeklyConsumer(RabbitMqConfig rabbitMqConfig, IServiceProvider serviceProvider)
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
            queue: "email_weekly",
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
            EmailMessage emailMessage = System.Text.Json.JsonSerializer.Deserialize<EmailMessage>(message);

            using var scope = _serviceProvider.CreateScope();
            var _emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            await _emailService.SendEmailToSubscriberAsync(emailMessage);
        };

        await _channel.BasicConsumeAsync(
            queue: "email_weekly",
            autoAck: true,
            consumer: consumer
        );
    }

    public override void Dispose()
    {
        _channel?.Dispose();
        _connection?.CloseAsync();
        base.Dispose();
    }
}
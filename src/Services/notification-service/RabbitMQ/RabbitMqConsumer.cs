using Microsoft.EntityFrameworkCore.Metadata;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

namespace NotificationService.RabbitMQ;

public class RabbitMqConsumer : BackgroundService
{
    private IConnection? _connection;
    private IChannel? _channel;
    private readonly RabbitMqConfig _rabbitMqConfig;

    public RabbitMqConsumer(RabbitMqConfig rabbitMqConfig)
    {
        _rabbitMqConfig = rabbitMqConfig;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new ConnectionFactory
        {
            HostName = _rabbitMqConfig.HostName,
            Port = _rabbitMqConfig.Port,
            UserName = _rabbitMqConfig.UserName,
            Password = _rabbitMqConfig.Password,
        };

        _connection = await factory.CreateConnectionAsync();
        _channel = await _connection.CreateChannelAsync();

        //_channel.ExchangeDeclareAsync(_rabbitMqConfig.ExchangeName, ExchangeType.Direct, true, false);

        await _channel.QueueDeclareAsync(queue: "created_comment",
                             durable: true,
                             exclusive: false,
                             autoDelete: false,
                             arguments: null);
        
        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            Console.WriteLine($" [x] Received {message}");
           
        };

        await _channel.BasicConsumeAsync(queue: "created_comment",
                             autoAck: true,
                             consumer: consumer);
    }

    public override void Dispose()
    {
        _channel?.CloseAsync();
        _connection?.CloseAsync();
        base.Dispose();
    }
}

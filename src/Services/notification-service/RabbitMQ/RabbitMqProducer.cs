using RabbitMQ.Client;

namespace NotificationService.RabbitMQ;

public class RabbitMqProducer : IRabbitMqProducer
{
    private readonly RabbitMqConfig _rabbitMqConfig;

    public RabbitMqProducer(RabbitMqConfig rabbitMqConfig)
    {
        _rabbitMqConfig = rabbitMqConfig;
    }
    
    public async Task PublishAsync(string queueName, byte[] messageBody)
    {
        var factory = new ConnectionFactory()
        {
            HostName = _rabbitMqConfig.RabbitMqConnection.HostName,
            UserName = _rabbitMqConfig.RabbitMqConnection.UserName,
            Password = _rabbitMqConfig.RabbitMqConnection.Password,
            Port = _rabbitMqConfig.RabbitMqConnection.Port
        };
        
        using var connection = await factory.CreateConnectionAsync();
        using var channel = await connection.CreateChannelAsync();
        
        await channel.ExchangeDeclareAsync(exchange: _rabbitMqConfig.RabbitMqExchange.Notification, type: ExchangeType.Fanout);

        await channel.QueueDeclareAsync(
            queue: queueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null
        );

        await channel.QueueBindAsync(
            queue: queueName,
            exchange: _rabbitMqConfig.RabbitMqExchange.Notification,
            routingKey: queueName
        );

        await channel.BasicPublishAsync(
            exchange: _rabbitMqConfig.RabbitMqExchange.Notification,
            routingKey: queueName,
            body: messageBody
        );
    }
}
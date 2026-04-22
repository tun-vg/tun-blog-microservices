using RabbitMQ.Client;

namespace UserService.RabbitMQ;

public class RabbitMqProducer : IRabbitMqProducer
{
    private readonly RabbitMqConfig _rabbitMqConfig;

    public RabbitMqProducer(RabbitMqConfig rabbitMqConfig)
    {
        _rabbitMqConfig = rabbitMqConfig;
    }

    public async Task PublishAsync(string queueName, byte[] messageBody)
    {
        // declaration factory
        // declaration connection
        // declaration channel
        // declaration exchange
        // declaration queue
        // queue bind
        // basic publish

        var factory = new ConnectionFactory()
        {
            HostName = _rabbitMqConfig.HostName,
            UserName = _rabbitMqConfig.UserName,
            Password = _rabbitMqConfig.Password,
            Port = _rabbitMqConfig.Port
        };

        var connection = await factory.CreateConnectionAsync();
        var channel = await connection.CreateChannelAsync();
        
        await channel.ExchangeDeclareAsync(exchange: _rabbitMqConfig.ExchangeName, type: ExchangeType.Fanout);

        await channel.QueueDeclareAsync(
            queue: queueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null
        );

        await channel.QueueBindAsync(
            queue: queueName,
            exchange: _rabbitMqConfig.ExchangeName,
            routingKey: queueName
        );

        await channel.BasicPublishAsync(
            exchange: _rabbitMqConfig.ExchangeName,
            routingKey: queueName,
            body: messageBody
        );
    }
}
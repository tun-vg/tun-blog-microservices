using RabbitMQ.Client;

namespace comment_service.Messaging.RabbitMQ;

public class RabbitMqProducer : IRabbitMqProducer
{
    private readonly RabbitMqConfig _rabbitMqConfig;

    public RabbitMqProducer(RabbitMqConfig rabbitMqConfig)
    {
        _rabbitMqConfig = rabbitMqConfig;
    }

    public async Task PublishAsync(string queueName, byte[] messageBody)
    {
        // Implementation for publishing message to RabbitMQ

        // step 1: get config from appsettings -> create RabbitMQConfig object - Done
        // step 2: create connection factory - done
        // step 3: create connection - done
        // step 4: create channel - done
        // -> simple setup rabitmq done

        // step 5: declare queue
        // stop 6: message and body
        // step 7: publish message to queue

        var factory = new ConnectionFactory()
        {
            HostName = _rabbitMqConfig.HostName,
            UserName = _rabbitMqConfig.UserName,
            Password = _rabbitMqConfig.Password,
            Port = _rabbitMqConfig.Port
        };
        using var connection = await factory.CreateConnectionAsync();
        using var channel = await connection.CreateChannelAsync();

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

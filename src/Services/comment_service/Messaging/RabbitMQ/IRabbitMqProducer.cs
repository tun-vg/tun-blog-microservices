namespace comment_service.Messaging.RabbitMQ;

public interface IRabbitMqProducer
{
    Task PublishAsync(string queueName, byte[] messageBody);
}

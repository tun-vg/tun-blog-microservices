namespace NotificationService.RabbitMQ;

public interface IRabbitMqProducer
{
    Task PublishAsync(string queueName, byte[] messageBody);
}
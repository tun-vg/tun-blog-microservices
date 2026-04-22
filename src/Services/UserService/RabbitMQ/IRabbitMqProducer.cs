namespace UserService.RabbitMQ;

public interface IRabbitMqProducer
{
    Task PublishAsync(string queueName, byte[] messageBody);
}
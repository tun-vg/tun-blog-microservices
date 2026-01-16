namespace comment_service.Messaging.RabbitMQ;

public class RabbitMqConfig
{
    public string HostName { get; set; } = string.Empty;

    public int Port { get; set; }

    public string UserName { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string ExchangeName { get; set; } = string.Empty;
}

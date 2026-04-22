namespace Post.Infrastructure.RabbitMQ;

public class RabbitMqConfig
{
    public RabbitMqConnection RabbitMqConnection { get; set; }
    
    public RabbitMqExchange RabbitMqExchange { get; set; }
}

public class RabbitMqConnection
{
    public string HostName { get; set; } = string.Empty;
    
    public int Port { get; set; }
    
    public string UserName { get; set; } = string.Empty;
    
    public string Password { get; set; } = string.Empty;
}

public class RabbitMqExchange
{
    public string User { get; set; } = string.Empty;
}
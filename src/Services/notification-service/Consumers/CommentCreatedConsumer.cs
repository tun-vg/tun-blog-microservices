using NotificationService.Messages;
using NotificationService.RabbitMQ;
using NotificationService.Services;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

namespace NotificationService.Consumers
{
    public class CommentCreatedConsumer : BackgroundService
    {

        private IConnection? _connection;
        private IChannel? _channel;
        private readonly RabbitMqConfig _rabbitMqConfig;
        private readonly IServiceProvider _serviceProvider;

        public CommentCreatedConsumer(RabbitMqConfig rabbitMqConfig, IServiceProvider serviceProvider)
        {
            _rabbitMqConfig = rabbitMqConfig;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var factory = new ConnectionFactory
            {
                HostName = _rabbitMqConfig.HostName,
                Port = _rabbitMqConfig.Port,
                UserName = _rabbitMqConfig.UserName,
                Password = _rabbitMqConfig.Password
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
                CommentCreatedEvent commentCreatedEvent = System.Text.Json.JsonSerializer.Deserialize<CommentCreatedEvent>(message)!;
                //var properties = commentCreatedEvent.GetType().GetProperties();
                //foreach (var prop in properties)
                //{
                //    var propName = prop.Name;
                //    var propValue = prop.GetValue(commentCreatedEvent);
                //    System.Diagnostics.Debug.WriteLine($"{propName}: {propValue}");
                //}

                using var scope = _serviceProvider.CreateScope();
                var _notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
                await _notificationService.SendNotificationAsync(commentCreatedEvent);
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
}

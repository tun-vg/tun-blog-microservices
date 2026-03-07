using System.Globalization;
using System.Text.Json;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using NotificationService.Commons;
using NotificationService.Dtos;
using NotificationService.Messages;
using NotificationService.RabbitMQ;
using NotificationService.Repositories;

namespace NotificationService.Services;

public class EmailService : IEmailService
{
    private readonly ISubscriptionRepository _subscriptionRepository;
    private readonly IRabbitMqProducer _rabbitMqProducer;
    private readonly MailSettings _mailSettings;
    private readonly IPostService _postService;
    private readonly CultureInfo viCulture = new CultureInfo("vi-VN");

    public EmailService(ISubscriptionRepository subscriptionRepository, IRabbitMqProducer rabbitMqProducer, MailSettings mailSettings, IPostService postService)
    {
        _subscriptionRepository = subscriptionRepository;
        _rabbitMqProducer = rabbitMqProducer;
        _mailSettings = mailSettings;
        _postService = postService;
    }

    public async Task PublishMessageEmailAsync()
    {
        var subcribers = await _subscriptionRepository.GetAllSubcribers();
        
        // var posts = new List<PostInfo>();
        // for (int i = 0; i <= 5; i++)
        // {
        //     posts.Add(new PostInfo()
        //     {
        //         PostId = Guid.NewGuid().ToString(),
        //         Title = $"Post {i}",
        //         ImageUrl = "https://res.cloudinary.com/dlsdr7vxp/image/upload/v1753544550/posts/meo.jpg"
        //     });
        // }
        
        var trendingPosts = await _postService.GetTrendingPostsAsync();
        
        foreach (var subcriber in subcribers)
        {
            try
            {
                var emailMessage = new EmailMessage()
                {
                    ToEmail = subcriber.Email,
                    FromEmail = "admin.tun.blog@gmail.com",
                    Posts = trendingPosts
                };
                
                await _rabbitMqProducer.PublishAsync("email_weekly", JsonSerializer.SerializeToUtf8Bytes(emailMessage));
                
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }

    public async Task SendEmailToSubscriberAsync(EmailMessage emailMessage)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail));
        email.To.Add(MailboxAddress.Parse(emailMessage.ToEmail));

        // Build subject with current week's date range (Mon–Sun)
        var today = DateTime.UtcNow;
        var daysFromMonday = today.DayOfWeek == DayOfWeek.Sunday ? 6 : (int)today.DayOfWeek - 1;
        var weekStart = today.AddDays(-daysFromMonday).Date;
        var weekEnd = weekStart.AddDays(6);
        string startStr = weekStart.ToString("dd MMM", viCulture);
        string endStr = weekEnd.ToString("dd MMM, yyyy", viCulture);
        email.Subject = $"Bài Viết Của Tuần | {startStr} – {endStr}";

        var hotPosts = emailMessage.Posts ?? Enumerable.Empty<PostDto>();

        // Build a card for each post
        var postsHtml = new System.Text.StringBuilder();
        foreach (var post in hotPosts)
        {
            postsHtml.Append($@"
                <div style=""margin-bottom:24px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;"">
                    <img src=""https://res.cloudinary.com/dlsdr7vxp/image/upload/v1772474952/notebook_otzttx.webp"" alt=""{post.Title}""
                         style=""width:100%;height:200px;object-fit:cover;"" />
                    <div style=""padding:16px;"">
                        <h3 style=""margin:0 0 10px;font-size:16px;color:#111827;"">{post.Title}</h3>
                        <a href=""http://localhost:5000/post/{post.PostId}/{post.Slug}""
                           style=""display:inline-block;padding:8px 16px;background:#4f46e5;color:#fff;
                                  text-decoration:none;border-radius:4px;font-size:14px;"">
                            Đọc Tiếp
                        </a>
                    </div>
                </div>");
        }

        var builder = new BodyBuilder();
        builder.HtmlBody = $@"<!DOCTYPE html>
<html>
<body style=""margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;"">
    <table width=""100%"" cellpadding=""0"" cellspacing=""0"">
        <tr>
            <td align=""center"" style=""padding:32px 16px;"">
                <table width=""600"" cellpadding=""0"" cellspacing=""0""
                       style=""background:#fff;border-radius:12px;overflow:hidden;max-width:600px;"">
                    <tr>
                        <td style=""background:#4f46e5;padding:24px 32px;"">
                            <h1 style=""margin:0;color:#fff;font-size:24px;"">Tun Blog</h1>
                            <p style=""margin:4px 0 0;color:#c7d2fe;font-size:14px;"">
                                Tóm Tắt Bài Viết Của Tuần &mdash; {startStr} &ndash; {endStr}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style=""padding:32px;"">
                            <p style=""margin:0 0 24px;color:#374151;font-size:15px;"">
                                Dưới đây là những bài viết nổi bật nhất tuần này được chọn lọc dành riêng cho bạn:
                            </p>
                            {postsHtml}
                        </td>
                    </tr>
                    <tr>
                        <td style=""background:#f9fafb;padding:20px 32px;text-align:center;"">
                            <p style=""margin:0;color:#9ca3af;font-size:12px;"">
                                Bạn nhận được email này vì bạn đã đăng ký theo dõi Tun Blog.
                                <a href=""http://localhost:5000/unSubscribe{emailMessage.ToEmail}"" style=""color:#6b7280;"">Hủy Đăng Ký</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
        email.Body = builder.ToMessageBody();
        
        using var smtp = new SmtpClient();
        try
        {
            await smtp.ConnectAsync(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_mailSettings.Mail, _mailSettings.Password);
            await smtp.SendAsync(email);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
        finally
        {
            await smtp.DisconnectAsync(true);
        }
    }
}
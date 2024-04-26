namespace Backend.Interface
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }
}

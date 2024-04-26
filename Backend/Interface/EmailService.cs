using System.Net.Mail;
using System.Net;

namespace Backend.Interface
{
    public class EmailService : IEmailService
    {
        private readonly string smtpUsername = "rajuaddada7673@gmail.com";
        private readonly string smtpPassword = "sottsokexdxlekjh";
        private readonly string smtpHost = "smtp.gmail.com";
        private readonly int smtpPort = 587;

        public string Email { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                using (SmtpClient client = new SmtpClient(smtpHost, smtpPort))
                {
                    client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                    client.EnableSsl = true;

                    MailMessage message = new MailMessage();
                    message.From = new MailAddress(smtpUsername);
                    message.To.Add(to);
                    message.Subject = subject;
                    message.Body = body;
                    message.IsBodyHtml = true;

                    await client.SendMailAsync(message);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to send email: " + ex.Message);
            }
        }
    }
}


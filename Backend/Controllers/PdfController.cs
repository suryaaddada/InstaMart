
//using Microsoft.AspNetCore.Mvc;
//using System.Net.Mail;
//using System.Net;
//using System.Web.Http;
//using Microsoft.AspNetCore.Http;


//namespace Backend.Controllers
//{
//    [System.Web.Http.Route("api/[controller]")]
//    [ApiController]
//    public class PdfController : ControllerBase
//    {
//        [System.Web.Http.HttpPost]
//        public async Task<IHttpActionResult> UploadPdf()
//        {
//            if (!Request.HasFormContentType)
//            {
//                return (IHttpActionResult)BadRequest("Unsupported media type.");
//            }

//            //var provider = new MultipartMemoryStreamProvider();
//            //await Request.Content.ReadAsMultipartAsync(provider);

//            var form = await Request.ReadFormAsync();

//            foreach (var file in form.Files)
//            {
//                var fileName = file.FileName.Trim('"');
//                using (var stream = file.OpenReadStream())
//                {
//                    var buffer = new byte[stream.Length];
//                    await stream.ReadAsync(buffer, 0, buffer.Length);

//                    // Save the PDF file or process it as needed
//                    // For example, you can save it to a folder
//                    // File.WriteAllBytes(Path.Combine("Path_to_save_pdf", fileName), buffer);

//                    // Send email with the PDF attachment
//                    await SendEmailWithAttachment(fileName, buffer);
//                }
//            }

//            return (IHttpActionResult)Ok("PDF received and processed successfully.");
//        }

//        private async Task SendEmailWithAttachment(string fileName, byte[] fileData)
//        {
//            try
//            {
//                // Configure SMTP client
//                SmtpClient client = new SmtpClient("smtp.example.com");
//                client.Port = 587;
//                client.Credentials = new NetworkCredential("your_email@example.com", "your_password");
//                client.EnableSsl = true;

//                // Create the email message
//                MailMessage message = new MailMessage();
//                message.From = new MailAddress("your_email@example.com");
//                message.To.Add("recipient@example.com");
//                message.Subject = "PDF Attachment";
//                message.Body = "This email contains a PDF attachment";

//                // Add attachment
//                MemoryStream memoryStream = new MemoryStream(fileData);
//                Attachment attachment = new Attachment(memoryStream, fileName);
//                message.Attachments.Add(attachment);

//                // Send the email
//                await client.SendMailAsync(message);

//                // Dispose attachment
//                attachment.Dispose();
//                memoryStream.Dispose();
//            }
//            catch (Exception ex)
//            {
//                // Handle exception
//                Console.WriteLine("Error sending email: " + ex.Message);
//            }
//        }
//    }
//}

using System;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web.Http;

namespace Backend.V1.Controllers
{
    [RoutePrefix("api/pdf")]
    public class PdfController : ApiController
    {
        [HttpPost]
        [Route("UploadPdf")]
        public async Task<IHttpActionResult> UploadPdf()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                return BadRequest("Unsupported media type.");
            }

            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);

            foreach (var file in provider.Contents)
            {
                var fileName = file.Headers.ContentDisposition.FileName.Trim('\"');
                var buffer = await file.ReadAsByteArrayAsync();

                // Save the PDF file or process it as needed
                // For example, you can save it to a folder
                // File.WriteAllBytes(Path.Combine("Path_to_save_pdf", fileName), buffer);

                // Send email with the PDF attachment
                await SendEmailWithAttachment(fileName, buffer);
            }

            return Ok("PDF received and processed successfully.");
        }

        private async Task SendEmailWithAttachment(string fileName, byte[] fileData)
        {
            try
            {
                // Configure SMTP client
                SmtpClient client = new SmtpClient("smtp.example.com");
                client.Port = 587;
                client.Credentials = new NetworkCredential("your_email@example.com", "your_password");
                client.EnableSsl = true;

                // Create the email message
                MailMessage message = new MailMessage();
                message.From = new MailAddress("your_email@example.com");
                message.To.Add("recipient@example.com");
                message.Subject = "PDF Attachment";
                message.Body = "This email contains a PDF attachment";

                // Add attachment
                MemoryStream memoryStream = new MemoryStream(fileData);
                Attachment attachment = new Attachment(memoryStream, fileName);
                message.Attachments.Add(attachment);

                // Send the email
                await client.SendMailAsync(message);

                // Dispose attachment
                attachment.Dispose();
                memoryStream.Dispose();
            }
            catch (Exception ex)
            {
                // Handle exception
                Console.WriteLine("Error sending email: " + ex.Message);
            }
        }
    }
}


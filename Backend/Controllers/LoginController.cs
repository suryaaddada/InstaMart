using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using System.Net.Mail;
using System.Net;
using Microsoft.EntityFrameworkCore;
using Backend.Interface;
using Microsoft.AspNetCore.Authorization;
using System.Data; 

namespace Backend.V1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   
    public class LoginController : ControllerBase
    {
       
        private readonly DBContext context; 
        private readonly IEmailService emailService;
        private readonly IJWTToken jwtToken;
        private readonly ILogger<LoginController> log;

        public LoginController( DBContext context,IEmailService service,IJWTToken token,ILogger<LoginController> logger)
        {
            
            this.context = context;
            emailService = service;
            jwtToken = token;
            log = logger;
        }

        [HttpPost("User Verification")]
        public IActionResult User_Verify([FromBody] Authentication data)
        {
            try
            {
                var user = context.Users.FirstOrDefault(e =>  e.Email == data.Email && e.Password == data.Password);
                if ( user != null )
                { 
                        var JWTtoken = jwtToken.Authenticate(data.Email,user.Role);
                        log.LogInformation($"User Verified with Provided Credentials for the email address {data.Email}");
                        return Ok(new { id = user.Id,role=user.Role, token = JWTtoken });
                    
                }
                else
                {
                    log.LogInformation($"The user could not be verified with the provided credentials for the email address {data.Email}.");
                    return BadRequest("Invalid Email and Password");
                }
            }
            catch (Exception ex)
            {
                log.LogError($"Exception occurred while login with  the provided credentials for the email address {data.Email}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("User_Email_Exists/{email}")]
        public async Task<IActionResult> User_Exists(string email)
        {
            try
            {
                var user =await  context.Users.FirstOrDefaultAsync(x => x.Email==email);
                if (user == null)
                {
                    log.LogInformation($"User Email exists checking for email {email} returns false");
                    return Ok(false);
                }
                log.LogInformation($"User Email exists checking for email {email} returns true");
                return Ok(true);
            }catch (Exception ex)
            {
                log.LogError($"User Email exists checking for email {email} returns exception.");
                return BadRequest(ex.Message);
            }
        } 


        [HttpPost("Vendor Verification")]
        public IActionResult Vendor_Verify([FromBody] Authentication data)
        {
            try
            {
                var user = context.Vendors.FirstOrDefault(e => e.Email == data.Email);
                if (user == null)
                {
                    log.LogInformation($"Vendor doesn't exist with  the provided credentials for the email address {data.Email}");
                    return BadRequest("Invalid Email");
                }
                else
                {
                    if (user.Password == data.Password)
                    {

                        var JWTtoken =jwtToken.Authenticate(data.Email,"Vendor");
                        log.LogInformation($"Vendor Verified with Provided Credentials for the email address {data.Email}");
                        return Ok(new { id = user.Id,role="Vendor", token = JWTtoken });
                    }
                    log.LogInformation($"The vendor could not be verified with the provided credentials for the email address {data.Email}.");
                    return BadRequest("Invalid Password");
                }
            }
            catch (Exception ex)
            {
                log.LogError($"Exception occurred while login with  the provided credentials for the email address {data.Email}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("Vendor_Email_Exists/{email}")]
        public IActionResult Vendor_Exists(string email)
        {
            try
            {
                var user = context.Vendors.Where(x => x.Email.Equals(email));
                if (user.Any())
                {
                    log.LogInformation($"Vendor Email exists checking for email {email} returns true");
                    return Ok(true); 
                }
                log.LogInformation($"Vendor Email exists checking for email {email} returns false");
                return Ok(false);
            }
            catch (Exception ex)
            {
                log.LogError($"Vendor Email exists checking for email {email} returns exception.");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "User,Admin")]
        //1,1
        [HttpPatch("ChangePassword/{id}")]
        public IActionResult ChangePassword(int id,string password)
        {
            var user = context.Users.Find(id);
            if (user==null)
            {
                log.LogInformation($"User doesn't exist to change the password for user id : {id}");
                return StatusCode(404, "User Not Found");
            }
            else
            {
                log.LogInformation($"User password changed successfully for user id : {id}");
                user.Password = password;
                context.SaveChanges();
                return Ok(user);
            }
            
        }
        
        //1
        [HttpPost("ForgotPassword")]
        public IActionResult ChangePassword(string email, string newPassword, string role)
        {
            try
            {
                if (role == "Users")
                {
                    var user = context.Users.FirstOrDefault(x => x.Email == email);
                    if (user != null)
                    {
                        log.LogInformation($"{role} password changed successfully for the email id :{email}");
                        user.Password = newPassword;
                        context.SaveChanges();
                        return Ok("Password changed successfully for user.");
                    }
                    else
                    {
                        log.LogInformation($"{role} doesn't exist to change password for the email id :{email}");
                        return StatusCode(404, "User not found.");
                    }
                }
                else if (role == "Vendors")
                {
                    var vendor = context.Vendors.FirstOrDefault(x => x.Email == email);
                    if (vendor != null)
                    {
                        vendor.Password = newPassword;
                        context.SaveChanges();
                        log.LogInformation($"{role} password changed successfully for the email id :{email}");
                        return Ok("Password changed successfully for vendor.");
                    }
                    else
                    {
                        log.LogInformation($"{role} doesn't exist to change password for the email id :{email}");
                        return StatusCode(404, "Vendor not found.");
                    }
                }
                else
                {
                    log.LogInformation($"Invalid role is provided"); 
                    return BadRequest("Invalid role provided.");
                }
            }
            catch (Exception ex)
            {
                log.LogError($"An Exception occurred while changing the password.");
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [HttpPost("Send an email")]
        public IActionResult SendEmailWithAttachment()
        {
            try
            {
                // Check if the request contains multipart/form-data
                //if (!Request.HasFormContentType)
                //    return BadRequest("Invalid request format.");

                // Configure SMTP client
                SmtpClient client = new SmtpClient("smtp.gmail.com");
                client.Port = 587;
                client.Credentials = new NetworkCredential("rajuaddada7673@gmail.com", "sottsokexdxlekjh");
                client.EnableSsl = true;
                client.UseDefaultCredentials = false;

                // Create the email message
                MailMessage message = new MailMessage();
                message.From = new MailAddress("rajuaddada7673@gmail.com");
                message.To.Add("rajuaddada7673@gmail.com");
                message.Subject = "User Logged in";
                message.Body = "Login successfully";

                // Read the PDF attachment from the request
                //var provider = new MultipartMemoryStreamProvider();
                //Request.Content.ReadAsMultipartAsync(provider).Wait();

                //foreach (var file in provider.Contents)
                //{
                //    string fileName = file.Headers.ContentDisposition.FileName.Trim('\"');
                //    Stream stream = file.ReadAsStreamAsync().Result;

                //    // Add attachment
                //    Attachment attachment = new Attachment(stream, fileName);
                //    message.Attachments.Add(attachment);
                //}

                // Send the email
                client.Send(message);

                // Dispose attachments
                foreach (var attachment in message.Attachments)
                {
                    attachment.Dispose();
                }

                return Ok("Email with attachment sent successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        
        [HttpPost("Send Otp")]
        public  async Task<IActionResult> Send_OTP(string email,string OTP)
        {
            try
            {
                await emailService.SendEmailAsync(email, "Password Reset", OTP);
                log.LogInformation($"OTP sent successfully to user for email id :{email}");
                return Ok("Email with OTP sent successfully.");
            }
            catch (Exception ex)
            {
                log.LogError($"An Exceptioin occurred while sending OTP to the email {email}");
                return BadRequest(ex.Message);
            }
        }

        
        //1
        [HttpPost("Sending Email")]
        public  async Task<IActionResult> Send_Email([FromBody] EmailService request)
        {
            try
            {
                
                await emailService.SendEmailAsync(request.Email, request.Subject, request.Body);
                log.LogInformation($"An Email sent successfully to the {request.Email} ");
                return Ok("Email sent successfully.");
            }
            catch (Exception ex)
            {
                log.LogError($"An Error Occurred while sending email to the {request.Email} ");
                return BadRequest(ex.Message);
            }
        }
    }
   
    
}

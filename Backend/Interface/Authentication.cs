using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Interface
{
    public class Authentication : IJWTToken
    {
        private readonly IConfiguration configuration;

        public string Email { get; set; }
        public string Password { get; set; }

        public Authentication()
        {
            
        }
        public Authentication(IConfiguration configuration)
        {
            this.configuration = configuration;
            
        }

      
        public object Authenticate(string email,string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(configuration["JWT:Key"]);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, email)
            };

            if (!string.IsNullOrEmpty(role))
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)

            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}

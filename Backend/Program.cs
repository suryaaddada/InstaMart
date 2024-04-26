using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Serilog.Filters;
using Serilog;
using Microsoft.OpenApi.Models;
using Backend.Interface;
using Asp.Versioning;
using Swashbuckle.AspNetCore.SwaggerUI;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
 
namespace Backend
{
    public class Program 
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            var configuration = new ConfigurationBuilder().SetBasePath(builder.Environment.ContentRootPath)
               .AddJsonFile("appsettings.json").Build();

            builder.Services.AddCors();
            builder.Services.AddDbContext<DBContext>(opt => opt.UseSqlServer(configuration.GetConnectionString("Data")));


            builder.Services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                var key = Encoding.UTF8.GetBytes(configuration["JWT:Key"]);
                o.SaveToken = true;
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidAudience = configuration["JWT:Audience"],
                    ValidIssuer = configuration["JWT:Issuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                };
            });
            var roles = configuration.GetSection("AuthorizationRoles").GetChildren()
           .ToDictionary(x => x.Key, x => x.Value);

            builder.Services.AddAuthorization(options =>
            {
                //options.AddPolicy("VendorPolicy", policy => policy.RequireRole("Vendor"));
                //options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
                //options.AddPolicy("UserPolicy", policy => policy.RequireRole("User"));

                foreach (var role in roles)
                {
                    options.AddPolicy($"{role.Key}Policy", policy => policy.RequireRole(role.Value));
                }
            });
            builder.Services.AddLogging(b =>
            {
                b.ClearProviders();

                Log.Logger = new LoggerConfiguration().ReadFrom.Configuration(configuration) 
                .Filter.ByIncludingOnly(Matching.FromSource("Backend")).CreateLogger();
            });

            builder.Logging.AddSerilog();

            builder.Services.AddApiVersioning(options =>
            {
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ReportApiVersions = true;
                options.ApiVersionReader = ApiVersionReader.Combine(
                    new QueryStringApiVersionReader("api-version"),
                    new HeaderApiVersionReader("X-Version"),
                    new MediaTypeApiVersionReader("ver"));
            }).AddApiExplorer(opt =>
            {
                opt.GroupNameFormat = "'v'VVV";
                opt.SubstituteApiVersionInUrl = true;
            });
            builder.Services.AddControllers();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<IJWTToken, Authentication>();
           
            builder.Services.AddEndpointsApiExplorer();


            builder.Services.AddSwaggerGen(opt =>
            {
                opt.SwaggerDoc("v1", new OpenApiInfo { Title = "Backend", Version = "v1" });
                opt.SwaggerDoc("v2", new OpenApiInfo { Title = "Backend", Version = "v2" });
                opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "bearer"
                });

                opt.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{}
                    }
                });
            });



            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment()|| app.Environment.IsProduction())
            {
                app.UseSwagger();
               
                app.UseSwaggerUI(c =>
                {
                   
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
                    c.SwaggerEndpoint("/swagger/v2/swagger.json", "API v2");

                    c.DocExpansion(DocExpansion.None);
                    c.RoutePrefix = "swagger";
                    //c.DefaultModelsExpandDepth(-1);
                    c.DisplayRequestDuration();
                    //c.DisplayOperationId();
                });
               
            }

            app.UseHttpsRedirection();
            app.UseCors(builder => builder

               .AllowAnyMethod()
               .AllowAnyHeader()
               .SetIsOriginAllowed(origin => true)  
               .AllowCredentials()
               );

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}

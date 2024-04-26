using Backend.V1.Controllers;
using Backend.Interface;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Unit_Test
{
    [TestFixture]
    public class LoginTest
    {
       

        private IConfiguration configuration; 
        private DBContext dbContext;
        private IEmailService emailService;
        private IJWTToken jwtToken; 
        private ILogger<LoginController> logger;


        [OneTimeSetUp]
        public void OneTimeSetUp()
        {
            configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build();



            var options = new DbContextOptionsBuilder<DBContext>()
                          .UseSqlServer(configuration.GetConnectionString("Data"))
                          .Options;
            dbContext = new DBContext(options);

            var mock=new Mock<ILogger<LoginController>>();
            logger=mock.Object;


        }

        [OneTimeTearDown]
        public void OneTimeTearDown()
        {
            
            dbContext.Dispose();
        }

       
        [Test]
        [TestCase("satya@gmail.com")]
        
        public async Task UserEmailCheck_Returns_True(string email)
        {
            var controller = new LoginController(dbContext,emailService,jwtToken,logger);

            var actionResult = await controller.User_Exists(email); 
           
            var okResult = actionResult as OkObjectResult;
           
            Assert.IsNotNull(okResult, "ActionResult should not be null");

            var actual = (bool)okResult.Value; 
            Console.Write(actual);
            Assert.IsTrue(actual, "User should exist");
        }

        [Test]
        [TestCase("sry@gmail.com")]
        [TestCase("surya@gmail.com")]
        public async  Task UserEmailCheck_Returns_False(string email)
        {
            var controller=new LoginController(dbContext, emailService, jwtToken,logger);
            var actionResult= await controller.User_Exists(email);

            var okResult = actionResult as OkObjectResult;
            var data = (bool)okResult.Value;
            Assert.IsFalse(data);

            Assert.AreEqual(false, data);
            Assert.That(data, Is.False);

        }



    }
}

using Backend.V1.Controllers;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;


namespace Unit_Test
{
    [TestFixture]
    public class PracticeTest
    {
        private DBContext dbContext;
        private IConfiguration configuration; 
        private PracticeController controller; 
        private ILogger<PracticeController> logger;

        [OneTimeSetUp]
        public void OneTimeSetUp()
        {
            configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build();

            var options = new DbContextOptionsBuilder<DBContext>().UseSqlServer(configuration.GetConnectionString("Data")).Options;

            dbContext = new DBContext(options);

            var mockLogger = new Mock<ILogger<PracticeController>>();

           
            logger = mockLogger.Object;

            controller =new PracticeController(dbContext,logger);
        }


        [OneTimeTearDown]
        public void OneTimeTearDown()
        {
            dbContext.Dispose();
            
        }

        [Test]
        public async Task getProductStatus()
        {

            var action = controller.get_product();
            var okResult = action as OkObjectResult;

            var actual = okResult.Value as IEnumerable<object>;
            Assert.IsNotNull(actual);
            foreach (var actualItem in actual)
            {
                Console.WriteLine(actualItem);
            }

        }
    }
}

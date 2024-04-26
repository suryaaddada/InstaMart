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
    public class ProductTest
    {

       

        private IConfiguration configuration;
        private DBContext dbContext;
        private ILogger<ProductController> logger;


        [OneTimeSetUp]
        public void OneTimeSetUp()
        {
            configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build();


            var options = new DbContextOptionsBuilder<DBContext>()
                          .UseSqlServer(configuration.GetConnectionString("Data"))
                          .Options;
            dbContext = new DBContext(options);

            var mockLogger = new Mock<ILogger<ProductController>>();


            logger = mockLogger.Object;


        }

        [OneTimeTearDown]
        public void OneTimeTearDown()
        {
           
            dbContext.Dispose();
        }

       


        [Test]
        public async Task GetAllProducts_Returns_Products()
        {
            
            var controller = new ProductController(dbContext,logger);

            
            var actionResult = await controller.GetAllProducts();
            var okResult = actionResult as OkObjectResult;

           
            Assert.NotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);

            var products = okResult.Value as IEnumerable<object>;
            Assert.NotNull(products);
            Assert.IsNotEmpty(products); 

            
            

            Console.WriteLine("Products:");
            foreach (var product in products)
            {
                Console.WriteLine(product);
            }
        }

    }
}

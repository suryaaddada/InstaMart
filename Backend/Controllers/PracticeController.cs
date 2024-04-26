using Asp.Versioning;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog.Context;
using System.Net;


namespace Backend.V1.Controllers
{
    // [ApiVersion("1.0",Deprecated =true)]
    //[Route("api/v{version:apiVersion}/[controller]")]
    // [Route("api/v1/[controller]")]  
    //[Authorize(Policy ="AdminPolicy")]
    //[Authorize(Roles ="User")]
    [ApiVersion("1.0")]
    [Route("api/[controller]")]
    [ApiController]
    
    public class PracticeController : ControllerBase
    {
        private readonly DBContext dbContext;
        private readonly ILogger<PracticeController> logger;

        public PracticeController(DBContext dbContext, ILogger<PracticeController> logger)
        {
            this.dbContext = dbContext;
            this.logger = logger;
        }

        [HttpGet("Get Users")]
        public IActionResult Get()
        {
           
            var users = dbContext.Users.Select(x => new
            {
                x.Id,
                x.Mobile,
                x.FirstName,
                x.LastName,
                x.Email,
                x.Gender,
                
            }).ToList();
            // }).OrderByDescending(x=>x.Gender).ThenBy(x=>x.Email) .ToList();
            logger.LogInformation("hello",LogLevel.Information);
            return Ok(users);
        }

        [AllowAnonymous]
        [HttpGet("Get Group")]
        public IActionResult Get_Group()
        {
            var result = (from p in dbContext.Products
                          join oi in dbContext.OrderedItems
                         on p.Id equals oi.ProductId
                          join o in dbContext.Orders on oi.OrderId equals o.Id
                          join u in dbContext.Users on o.UserId equals u.Id
                          where u.FirstName.Contains("a")
                          group new { p, u } by new { p.BrandName, u.FirstName } into g
                          where g.Count() > 3
                          orderby g.Count() descending, g.Key.BrandName descending, g.Key.FirstName
                          select new
                          {
                              g.Key.BrandName,
                              Count = g.Count(),
                              g.Key.FirstName
                          }
                         ).ToList();
            var query = (from p in dbContext.Products
                         join oi in dbContext.OrderedItems on p.Id equals oi.ProductId
                         join o in dbContext.Orders on oi.OrderId equals o.Id
                         join u in dbContext.Users on o.UserId equals u.Id
                         where u.FirstName.Contains("a")
                         select new
                         {
                             Product = p,
                             User = u
                         })
            .GroupBy(pu => new { pu.Product.BrandName, pu.User.FirstName })
            .Where(g => g.Count() > 3)
            .OrderByDescending(g => g.Count())
            .ThenByDescending(g => g.Key.BrandName)
            .ThenBy(g => g.Key.FirstName)
            .Select(g => new
            {
                g.Key.BrandName,
                OrderedCount = g.Count(),
                g.Key.FirstName,

            })
            .ToList();

            return Ok(new { result, query });
        }

        [HttpGet("Get Grouped Product/{id}")]
        public IActionResult get_grouped_product(int id)
        {
            var productDetails = (from p in dbContext.Products
                                  join i in dbContext.Inventories on p.Id equals i.ProductId
                                  where p.Id == id
                                  select new
                                  {
                                      Product = p,
                                      Inventory = i
                                  })
                     .GroupBy(pi => new
                     {
                         pi.Product.Id,
                         pi.Product.BrandName,
                         pi.Product.Image,
                         pi.Product.Description,
                         pi.Product.Category,
                         pi.Product.SubCategory,
                         pi.Product.Color,
                         pi.Product.Status,
                     })
                     .Select(g => new
                     {
                         g.Key.Id, g.Key.BrandName, g.Key.Image, g.Key.Description, g.Key.Category, g.Key.SubCategory,
                         g.Key.Color, g.Key.Status,

                         ProductDetails = g.Select
                         (pi => new { pi.Inventory.Id, pi.Inventory.ProductSize, pi.Inventory.Stock, pi.Inventory.Price }).ToList()
                     })
                     .FirstOrDefault();

            return Ok(productDetails);
        }

        [HttpGet("Get Grouped Updated Product/{id}")]
        public IActionResult GetGroupedProduct(int id)
        {
            var product = dbContext.Products.Find(id);
            if (product == null)
            {
                return StatusCode(404, "Product Not Found");

            }
            else
            {
                var productDetails = (from i in dbContext.Inventories where i.ProductId == id
                                      select new
                                      {
                                          Product = i.Product,
                                          Inventory = i
                                      })
                    .GroupBy(pi => new
                    {
                        pi.Product.Id,
                        pi.Product.BrandName,
                        pi.Product.Image,
                        pi.Product.Description,
                        pi.Product.Category,
                        pi.Product.SubCategory,
                        pi.Product.Color,
                        pi.Product.Status,

                    })
                    .Select(g => new
                    {
                        g.Key.Id,
                        g.Key.BrandName,
                        g.Key.Image,
                        g.Key.Description,
                        g.Key.Category,
                        g.Key.SubCategory,
                        g.Key.Color,
                        g.Key.Status,

                        ProductDetails = g.Select
                        (pi => new { pi.Inventory.Id, pi.Inventory.ProductSize, pi.Inventory.Stock, pi.Inventory.Price }).ToList()
                    })
                    .FirstOrDefault();

                if (productDetails != null)
                {
                    return Ok(productDetails);
                }
                return StatusCode(404, "Product Details not found");
            }
        }

        [HttpGet("product")]
        public IActionResult get_product()
        {
            var product = (from p in dbContext.Products select new
            {
                p.Status
            }).GroupBy(x => x.Status).Select(g => new { g.Key, Count = g.Count() }).ToList();
            logger.LogInformation("Get product Status");

            return Ok(product);
        }
    }


}

namespace Backend.V2.Controllers
{
    [ApiVersion("2.0")]
    //[Route("api/v{version:apiVersion}/[controller]")]
    // [Route("api/v1/[controller]")] 
    [Route("api/[controller]")]
    [ApiController]
    public class PracticeController : ControllerBase
    {
        private readonly DBContext dbContext;
        private readonly ILogger<PracticeController> logger;

        public PracticeController(DBContext dbContext, ILogger<PracticeController> logger)
        {
            this.dbContext = dbContext;
            this.logger = logger;
        }

        [HttpGet("Get Users")]
        public IActionResult Get()
        {
            var users = dbContext.Users.Select(x => new
            {

                x.Mobile,
                x.FirstName,
                x.LastName,
                x.Email,
                x.Gender,
                x.Password
            }).ToList();
            
            return Ok(users);
        }

        [HttpGet("welcome")]
        public IActionResult getversion()
        {
            return Ok(HttpStatusCode.OK);


        }

    }
}
    


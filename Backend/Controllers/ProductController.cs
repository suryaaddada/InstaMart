using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.V1.Controllers
{
     
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly DBContext context;
        private readonly ILogger<ProductController> log;
      

        public ProductController(DBContext _context,ILogger<ProductController> log)
        {
            context = _context;
            this.log = log;
           
        }
        // [Authorize(Roles = "Admin")]
        //2
        [HttpGet("GetAllProducts")]
        public   async Task<IActionResult> GetAllProducts()
        {
            try
            {
                //var products2 = await context.Products.Where(x => x.Status == "Active").ToListAsync();
                //if (products2.Any())
                //{

                //    var selected = products2.Select(x => new
                //    {
                //        x.BrandName,
                //        x.Id,
                //        x.Description,
                //        x.Image,
                //        x.Category,
                //        x.SubCategory,
                //        x.Color
                //    });
                //    //return Ok(selected);
                //}

                var products =context.Products.Where(x=>x.Status=="Active").Select(
                    p => new
                    {
                        p.BrandName,p.Id,p.Description,p.Image,p.Category,p.SubCategory,p.Color
                    }).ToList();
                if(products.Any() )
                {
                   log.LogInformation("Retrieving All Active Products");
                    return Ok(products);
                }
                log.LogInformation($"Products not found to retieve");
                return StatusCode(404, "No Products Found");
            }
            catch (Exception ex)
            {
                log.LogError("An error occurred while retreiving active products");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles ="Vendor")]
        //1
        [HttpGet("Get All Vendor Products/{id}")]
        public IActionResult Get_All_Vendor_Products_By_Id(int id)
        {
            try
            {
                var vendor = context.Vendors.Find(id);
                if (vendor!=null)
                {
                    //var products=context.Products.Where(x=>  x.VendorId == id && x.Status == "Active").ToList();
                    //if (products.Any())
                    //{
                    //    var returnedProducts = products.Select(x => new
                    //    {
                    //        x.Id,
                    //        x.BrandName,
                    //        x.Description,
                    //        x.Image,
                    //        x.Category,
                    //        x.SubCategory,
                    //        x.Color,
                    //        x.Status,

                    //    }).ToList();
                    //    return Ok(returnedProducts);
                    //} 
                    var products = context.Products.Where(x => x.VendorId == id && x.Status == "Active")
                       .Select(x => new
                       {
                           x.Id,
                           x.BrandName,
                           x.Description,
                           x.Image,
                           x.Category,
                           x.SubCategory,
                           x.Color,
                           x.Status,
                       }).ToList();

                    if(products.Any())
                    {
                        log.LogInformation($"Retreving all active products by the vendor with id:{id}");
                        return Ok(products); }
                    else
                    {
                        log.LogInformation($"Active products not found for the vendor whose id is :{id}");
                        return StatusCode(404, "Products not found");
                    }
                }
                else
               {
                    log.LogInformation($"Vendor doesn't exist to retreive active products for vendor whose id is:{id}");
                    return StatusCode(404, "Vendor Not found"); }
            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred while fetching active products for the vendor whos eid id :{id}");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetProduct/{id}")]
        public IActionResult GetProduct(int id)
        {
            try
            {
                //var product = context.Products.Find(id);
                //if (product != null)
                //{
                //    var productDetails = (from p in context.Products
                //                          join i in context.Inventories on p.Id equals i.ProductId
                //                          where p.Id == id 
                //                          select new
                //                          {
                //                              p.Id,p.BrandName,p.Image,
                //                              p.Description,p.Category,
                //                              p.SubCategory, p.Color,
                //                              i.ProductSize,i.Price,i.Stock
                //                          }).ToList();                   
                                        
                //}
                var products = context.Inventories.Where(x => x.ProductId == id).Select(p => new
                {
                    p.Product.Id, p.Product.BrandName, p.Product.Image, p.Product.Description,
                    p.Product.Category, p.Product.SubCategory, p.Product.Color,
                    p.ProductSize, p.Price, p.Stock
                }).ToList();

                if (products.Any())
                    return Ok(products);
                else
                {
                    return StatusCode(404, "Product Not found");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        //1
        [HttpGet("Get Grouped Product/{id}")]
        public IActionResult GetGroupedProduct(int id)
        {
            try
            {
                var product = context.Products.Find(id);
                if (product != null)
                {
                    //var productDetails = (from p in context.Products
                    //                      join i in context.Inventories on p.Id equals i.ProductId
                    //                      where p.Id == id
                    //                      select new
                    //                      {
                    //                          p.Id,
                    //                          p.BrandName,
                    //                          p.Image,
                    //                          p.Description,
                    //                          p.Category,
                    //                          p.SubCategory,
                    //                          p.Color,
                    //                          p.Status,
                    //                          ProductDetails = new
                    //                          {
                    //                              i.Id,
                    //                              i.ProductSize,
                    //                              i.Price,
                    //                              i.Stock
                    //                          }
                    //                      })
                    //                     .GroupBy(p => new
                    //                     {
                    //                         p.Id,
                    //                         p.BrandName,
                    //                         p.Image,
                    //                         p.Description,
                    //                         p.Category,
                    //                         p.SubCategory,
                    //                         p.Color,
                    //                         p.Status,
                    //                     })
                    //                     .Select(g => new
                    //                     {
                    //                         g.Key.Id,
                    //                         g.Key.BrandName,
                    //                         g.Key.Image,
                    //                         g.Key.Description,
                    //                         g.Key.Category,
                    //                         g.Key.SubCategory,
                    //                         g.Key.Color,
                    //                         g.Key.Status,
                    //                         ProductDetails = g.Select(p => p.ProductDetails).ToList()
                    //                     })
                    //                     .FirstOrDefault();

                    //return Ok(productDetails); 

                    var productDetails = (from i in context.Inventories
                                          where i.ProductId == id
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
                        log.LogInformation($"Fetching product details along with inventories for the product whose id is:{id}");
                        return Ok(productDetails);
                    }
                    log.LogInformation($"Inventory details not found to fetch product details  for the product whose id is:{id}");
                    return StatusCode(404, "Inventory Details not found");
                }
                else
                { 
                    log.LogInformation($"Product details not found to fetch product details for the product whose id is:{id}");
                return StatusCode(404, "Product Not found");
                }


            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred while fetching product along with inventory details for the productid :{id}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles ="Vendor")]
        //2
        [HttpGet("Get Grouped Product By Vendor id/{id}")]
        public IActionResult Get_Grouped_By_vendor(int id)
        {
            try
            {
                var vendor = context.Vendors.Find(id);
                if (vendor != null) 
                {
                    //var productDetails = (from v in context.Vendors
                    //                      join p in context.Products on v.Id equals p.VendorId
                    //                      join i in context.Inventories on p.Id equals i.ProductId
                    //                      where v.Id == id && p.Status=="Active"
                    //                      select new
                    //                      {
                    //                          p.Id,
                    //                          p.BrandName,
                    //                          p.Image,
                    //                          p.Description,
                    //                          p.Category,
                    //                          p.SubCategory,
                    //                          p.Color,
                                             
                    //                          ProductDetails = new
                    //                          {
                    //                              i.Id,
                    //                              i.ProductSize,
                    //                              i.Price,
                    //                              i.Stock
                    //                          }
                    //                      })
                    //                     .GroupBy(p => new
                    //                     {
                    //                         p.Id,
                    //                         p.BrandName,
                    //                         p.Image,
                    //                         p.Description,
                    //                         p.Category,
                    //                         p.SubCategory,
                    //                         p.Color
                    //                     })
                    //                     .Select(g => new
                    //                     {
                    //                         g.Key.Id,
                    //                         g.Key.BrandName,
                    //                         g.Key.Image,
                    //                         g.Key.Description,
                    //                         g.Key.Category,
                    //                         g.Key.SubCategory,
                    //                         g.Key.Color,
                    //                         Sizes = g.Select(p => p.ProductDetails).ToList()
                    //                     })
                    //                     .ToList();

                    //return Ok(productDetails);

                    var productDetails = (from  i in context.Inventories  where i.Product.VendorId == id && i.Product.Status=="Active"
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

                            Sizes = g.Select
                            (pi => new { pi.Inventory.Id, pi.Inventory.ProductSize, pi.Inventory.Stock, pi.Inventory.Price }).ToList()
                        }).ToList();

                    if (productDetails!=null)
                    {
                        log.LogInformation($"Vendor fetches All Product details along with inventories whose id is:{id}");
                        return Ok(productDetails);
                    }
                    log.LogInformation($"Vendor whose id is :{id} failed to fetch product details due to inventories are not found");
                    return StatusCode(404, "Product Details not found");
                }
                else
                {
                    log.LogInformation($"Vendor with id :{id} failed to fetch product details as it is not found");
                    return StatusCode(404, "Product Not found");
                }
            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred while fetching product along with inventory details by the vendor whose id is :{id}");
                return BadRequest(ex.Message);
            }
        }

        //public IActionResult GetProduct(int id)
        //{
        //    try
        //    {
        //        var product = context.Products.SingleOrDefault(x => x.Id == id);
        //        if (product != null)
        //        {
        //            return Ok(product);
        //        }
        //        else
        //            return StatusCode(404, "Not found");

        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        [Authorize(Roles ="Vendor")]
        //1
        [HttpPost("Add Product")]
        public IActionResult AddProduct([FromBody] Product product)
        {
            try
            {
                var vendor = context.Vendors.Find(product.VendorId);
                if(vendor == null)
                {
                    log.LogInformation($"Vendor doesn't exist to add new product whose id is:{product.VendorId}");
                    return StatusCode(404, "Vendor Not Found");
                }
                context.Products.Add(product);
                context.SaveChanges();
                log.LogInformation($"Vendor whose id is {product.VendorId} add a new product");
                return Ok(product.Id);
            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred while adding a new product by the vendor whose id is:{product.VendorId}.");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Vendor")]
        //1
        [HttpDelete("Delete/{id}")]
        public IActionResult DeleteProduct(int id)
        {
            try
            {
                var product = context.Products.Find(id);
                if (product == null)
                {
                    log.LogInformation($"Product not found to delete whose id is {id}.");
                    return NotFound();
                }
                else
                {
                    product.Status = "Inactive";
                   // var inventory=context.Inventories.Where(x=>x.ProductId==id).ToList();
                    //if(inventory.Any())
                    //{
                    //    context.Inventories.RemoveRange(inventory);
                    //}

                    context.SaveChanges();
                    log.LogInformation($"Product with id {id} status changed to inactive by the vendor whose id is {product.VendorId}");
                    return Ok("Done");
                }
            }

            catch (Exception ex)
            {
                log.LogError($"An error occurred while deleting a product with id {id} ");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles ="Vendor")]
        //1
        [HttpPut("UpdateProduct/{id}")]
        public IActionResult UpdateProduct(int id, [FromBody] Product updatedProduct)
        {
            try
            {
                var product = context.Products.Find(id);
                if (product == null)
                {
                    log.LogInformation($"Product not found to update whose id is {id}.");
                    return NotFound();
                }
                else
                {
                    product.BrandName = updatedProduct.BrandName;
                    product.Description = updatedProduct.Description;
                    product.Category = updatedProduct.Category;
                    product.SubCategory = updatedProduct.SubCategory;
                    product.Image = updatedProduct.Image;
                    product.Color = updatedProduct.Color;
                    product.VendorId = updatedProduct.VendorId;
                    product.Status = updatedProduct.Status;
                    context.SaveChanges();
                    log.LogInformation($"Product with id {id} updated by the vendor whose id is {product.VendorId}");
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred while updating a product with id {id} ");
                return BadRequest(ex.Message);
            }
        }

        //wishlist  

        [Authorize(Roles ="User")]
        //3
        [HttpGet("Get Wishlist By userId/{id}")]
        public IActionResult Get_Wishlist(int id)
        {
            try { 
                var user = context.Users.Find(id);
                if (user == null)
                {
                    log.LogInformation($"User with id {id} doesn't exist to fetch wislist items.");
                    return StatusCode(404, "User Not Found");
                }else
                {
                    //var wishlist=context.Wishlists.Where(x=>x.UserId==id).ToList(); 
                    //var pid=wishlist.Select(x=>x.ProductId).ToList(); 
                    var wishlist=context.Wishlists.Where(x=>x.UserId==id).Select(x=>x.ProductId).ToList();
                    if (wishlist.Any())
                    {
                        log.LogInformation($"Retrieving wishlist items of user whose id is :{id}");
                        return Ok(wishlist);
                    }
                    else
                        {
                        log.LogInformation($"User with id {id} failed to fetch wishlist items as it is not found.");
                        return StatusCode(404, "Wishlist Not Found"); }
                }
            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred while retreving wishlist items of the user whose id is :{id}.");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles ="User")]
        //1
        [HttpGet("Get Wishlisted Products By Userid/{id}")]
        public IActionResult Get_Wishlist_Product_Details(int id)
        {
            try
            {
                var user = context.Users.Find(id);
                if (user == null)
                {
                    log.LogInformation($"User with id {id} doesn't exist to fetch wislist items.");
                    return StatusCode(404, "User Not Found");
                }
                else
                {
                    var wishlist = context.Wishlists.Where(x => x.UserId == id).ToList();
                    if (wishlist.Count > 0)
                    {
                       // var productIds = wishlist.Select(w => w.ProductId).ToList();
                      

                       //var products = context.Products.Where(y => productIds.Contains(y.Id) && y.Status == "Active")
                       //  .Select(product => new
                       //  {
                       //      product.Id,
                       //      product.BrandName,
                       //      product.Image,
                       //      product.Description,
                       //      product.Color,      
                       //      price = context.Inventories
                       //          .Where(inventory => inventory.ProductId == product.Id)
                       //          .OrderBy(inventory => inventory.Id) 
                       //          .Select(inventory => inventory.Price) 
                       //          .FirstOrDefault() 
                       //  })
                       //  .ToList(); 

                        var product=context.Wishlists.Where(w=>w.UserId==id && w.Product.Status == "Active").Select(p => new
                        {
                            p.Product.Id,p.Product.BrandName,p.Product.Image,
                            p.Product.Description,p.Product.Color,
                            price=context.Inventories.Where(i=>i.ProductId==p.Product.Id).Select(i=>i.Price).First(),
                            wid=p.Id
                        }).OrderByDescending(x=>x.wid).ToList();

                        if (product.Any())
                        {
                            log.LogInformation($"Retrieving wishlist items of user whose id is :{id}");
                            return Ok(product);
                        }
                        else
                        {
                            log.LogInformation($"User with id {id} failed to fetch active wishlist items as it is not found.");
                            return StatusCode(404, "Product Not Found");
                        }
                    }
                    else
                    {
                        log.LogInformation($"User with id {id} failed to fetch as wishlist items  not found.");
                        return StatusCode(404, "Wishlist Not Found");
                    }
                }
            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred while retreving wishlist items of the user whose id is :{id}.");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "User")]
        //2
        [HttpPost("Add Wishlist")]
        public IActionResult Add_Product_Wishlist([FromBody] Wishlist wishlist)
        {
            try
            {
                context.Wishlists.Add(wishlist);
                context.SaveChanges();
                log.LogInformation($"A new product whose id is {wishlist.ProductId} is added into wishlist by the user whose id is {wishlist.UserId}.");
                return Ok();

            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred while adding product with id {wishlist.ProductId} into wishlist by the user with id {wishlist.UserId}.");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "User")]
        //3
        [HttpDelete("Deleted from Wishlist/{uid,pid}")]
        public IActionResult Delete_From_Wishlist(int uid,int pid)
        {
            try {
                var selectedUser = context.Wishlists.Where(x=>x.UserId==uid);
                if(selectedUser.Any())
                {
                    var SelectedProduct = selectedUser.Where(x => x.ProductId == pid).First();
                    if(SelectedProduct!=null)
                    {
                        context.Wishlists.Remove(SelectedProduct);
                        context.SaveChanges();
                        log.LogInformation($"Product with id {pid} is deleted from wishlist by the user with id {uid}.");
                        return Ok(SelectedProduct);
                    } 
                    else
                    {
                        log.LogInformation($"Product with id {pid} is not found in wishlist to delete by the user with id {uid}.");
                        return StatusCode(404, "Product Not found in wishlist");
                    }
                }
                else
                {
                    log.LogInformation($"User with id {uid} is not found to delete the product from wishlist");
                    return StatusCode(404, "User Not Found in WishList");
                }
            }
            catch (Exception ex) 
            {
                log.LogError($"An error occurred while deleting a product with id {pid} from wishlist by the user whose id is {uid}.");
                return BadRequest(ex.Message);
            }
        }

      

        [HttpDelete("Delete Wishlist/{id}")]
        public IActionResult Delete_Product_Wishlist(int id)
        {
            try
            {
                var wishlist = context.Wishlists.Find(id);
                if (wishlist == null)
                {
                    return NotFound();
                }
                context.Wishlists.Remove(wishlist);
                context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        //cart  

        [Authorize(Roles ="User")] 
        //2
        [HttpGet("Get Cart Items By User Id/{id}")]

        public IActionResult Get_Cart(int id)
        {
            try
            {
                var user = context.Users.Find(id);
                if (user == null)
                {
                    log.LogInformation($"User with id {id} doesn't exist to fetch cart items.");
                    return StatusCode(404, "User not Found");
                }
                else
                {
                    var cart = context.Carts.Where(x => x.UserId == id).ToList();

                    if (cart.Count == 0)
                    {
                        log.LogInformation($"User with id {id} cart is empty");
                        return StatusCode(404, "Cart is Empty");
                    }
                    else
                    {
                        //var productIds = cart.Select(x => x.ProductId).ToList(); // Retrieve product IDs from the cart

                        //var activeProducts = context.Products
                        //    .Where(p => productIds.Contains(p.Id) && p.Status == "Active")
                        //    .ToList();

                        //var products = activeProducts
                        //    .Join(cart, product => product.Id, cartItem => cartItem.ProductId,
                        //    (product, cartItem) => new
                        //    {
                        //        product.Id,
                        //        product.BrandName,
                        //        product.Image,
                        //        product.Description,
                        //        product.Color,
                        //        cartItem.Quantity,
                        //        cid = cartItem.Id,
                        //        iid = cartItem.InventoryId
                        //    })
                        //    .Join(context.Inventories, p => p.iid, inv => inv.Id, (p, inv) => new
                        //    {
                        //        p.Id,
                        //        p.BrandName,
                        //        p.Image,
                        //        p.Description,
                        //        p.Color,
                        //        p.Quantity,
                        //        p.cid,
                        //        p.iid,
                        //        inv.Price,
                        //        inv.ProductSize
                        //    })
                        //    .ToList();

                        var carts = context.Carts.Where(c => c.User.Id == id && c.Product.Status == "Active").Select(
                            p => new
                            {
                                p.Product.Id,
                                p.Product.BrandName,
                                p.Product.Image,
                                p.Product.Description,
                                p.Product.Color,
                                p.Quantity,
                                cid = p.Id,
                                iid = p.InventoryId,
                                p.Inventory.Price,
                                p.Inventory.ProductSize
                            }).ToList();
                        if (carts.Count == 0)
                           { 
                            log.LogInformation($"Active cart items not found for the user whose id is {id}.");
                            return StatusCode(404, "Product Not Found"); }
                        else
                           {
                            log.LogInformation($"Retrieving cart items for the user whose id is {id}.");
                            return Ok(carts); }
                    }
                }
            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred while fetching cart items for the user whose id is :{id}.");
                return BadRequest(ex.Message);
            }
        }




        [Authorize(Roles = "User")]
        //1
        [HttpPost("Add Cart")]
        public IActionResult Add_product_cart([FromBody] Cart cart)
        {
            try
            {
                var check = context.Carts.FirstOrDefault(x => x.ProductId == cart.ProductId && x.UserId==cart.UserId);
                if (check!=null)
                {
                    log.LogInformation($"Product with id {cart.ProductId} already added into the cart by the user whose id is {cart.UserId}.");
                    return StatusCode(200, new {msg= "Already in Cart", id = check.Id });
                }
                else
                {
                    context.Carts.Add(cart);
                    context.SaveChanges();
                    log.LogInformation($"A new product with id {cart.ProductId} is added into the cart by the user whose id is {cart.UserId}.");
                    return StatusCode(200,new { msg = "Added" });
                }

            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred while adding a new product into the cart by the user whose id is {cart.UserId}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "User")]
        //1
        [HttpDelete("Delete Cart By Product id/{id}")]
        public IActionResult Delete_Product_Cart(int id)
        {
            try
            {
                var cart = context.Carts.First(x=>x.ProductId==id);
                if (cart == null)
                {
                    log.LogInformation($"product with id {id} is not available in cart to delete from cart");
                    return NotFound();
                }
                context.Carts.Remove(cart);
                context.SaveChanges();
                log.LogInformation($"Product with id {id} is deleted from cart by the user whose id is {cart.UserId}.");
                return Ok();
            }
            catch (Exception ex)
            {
                log.LogError($"An error occured while removing the product with id {id} from cart.");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles ="User")]
        //3
        [HttpPut("Update Cart/{id}")]
        public IActionResult Update_Product_Cart(int id, [FromBody] Cart cart)
        {
            try
            {
                var Updatedcart = context.Carts.Find(id);
                if (Updatedcart == null)
                {
                    log.LogInformation($"Cart with id {id} doesn't exist to update");
                        return NotFound(); }
                else
                {
                    Updatedcart.ProductId = cart.ProductId;
                    Updatedcart.UserId = cart.UserId;
                    Updatedcart.Quantity = cart.Quantity;
                    Updatedcart.InventoryId = cart.InventoryId;
                    log.LogInformation($"Cart with id {id} is updated successfully");
                    context.SaveChanges();
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred while updating cart whose id is {id}");
                return BadRequest(ex.Message);
            }

        }

        [Authorize(Roles ="User")]
        //1
        [HttpDelete("Delete Cart by cartid/{id}")]
        public IActionResult Delete_Cart_By_Id(int id)
        {
            try
            {
                var cart = context.Carts.Find(id);
                if (cart == null) { 
                    log.LogInformation($"Cart with id {id} doesn't exist to remove.");
                    return NotFound();}
                else
                {
                    context.Carts.Remove(cart);
                    context.SaveChanges();
                    log.LogInformation($"Cart item removed by the cart id {id}");
                    return Ok();
                }
            }catch (Exception ex)
            {
                log.LogError($"An error occurred while removing th ecart with id {id}");
                return BadRequest(ex.Message);
            }
        }


        //Inventory

        [HttpGet("Inventory Details")]
        public IActionResult Inventory_Details()
        {
            try
            {
                var inventories = context.Inventories.ToList();
                if (inventories.Any())
                    return Ok(inventories);
                else
                    return StatusCode(404, "Out of Stock");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles ="Vendor")]
        //2
        [HttpPost("Add Items into Inventory")]
        public IActionResult Add_items([FromBody] Inventory inventory)
        {
            try
            {
                var product = context.Products.Find(inventory.ProductId);
                if (product == null)
                {
                    log.LogInformation($"Product with id {inventory.ProductId} not found to add inventories");
                    return StatusCode(404, "Product not Found"); }
                else
                {
                    context.Inventories.Add(inventory);
                    context.SaveChanges();
                    log.LogInformation($"A new inventory is added to the product of id :{inventory.ProductId}.");
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred while adding inventory to the product of id {inventory.ProductId}.");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles ="Vendor")]
        //1
        [HttpPut("Update Inventory Items/{id}")]
        public IActionResult Update_Items(int id, [FromBody] Inventory inventory)
        {
            try
            {
                var updated_inventory = context.Inventories.Find(id);
                if (updated_inventory == null)
                {
                    log.LogInformation($"Inventory of id {id} doesn't exist to update");
                    return StatusCode(404, "Inventory not found");
                }
                else
                {
                    var product = context.Products.Find(inventory.ProductId);
                    if (product == null)
                    {
                        log.LogInformation($"Product with id {inventory.ProductId} not found to update inventory");
                        return StatusCode(404, "Product not found"); }
                    else
                    {
                        updated_inventory.ProductId = inventory.ProductId;
                        updated_inventory.ProductSize = inventory.ProductSize;
                        updated_inventory.Price = inventory.Price;
                        updated_inventory.Stock = inventory.Stock;
                        log.LogInformation($"An inventory with id {id} is updated to the product of id :{inventory.ProductId}.");
                        context.SaveChanges();
                        return Ok();
                    }
                }
            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred while updating inventory of id {id} to the product of id {inventory.ProductId}.");
                return BadRequest(ex.Message); }
        }

        [Authorize(Roles ="Vendor")]
        //1
        [HttpDelete("Delete Inventory Items/{id}")]
        public IActionResult Delete_Items(int id)
        {
            try
            {
                var inventory = context.Inventories.Find(id);
                if(inventory == null)
                {
                    log.LogInformation($"Inventory of id {id} doesn't exist to delete");
                    return StatusCode(404, "Inventory Not Found");
                }
                else
                {
                    context.Inventories.Remove(inventory);
                    context.SaveChanges();
                    log.LogInformation($"An inventory with id {id} is deleted from the product of id :{inventory.ProductId}.");
                    return Ok();
                }
            }catch(Exception ex) 
            {
                log.LogError($"An error occurred while deleting inventory of id {id}.");
                return BadRequest(ex.Message);
            }
        }



        [HttpGet("Get Inventory Details By Vendor iD/{id}")]

        public IActionResult Get_Inventory(int id)
        {
            try
            {
                var vendor = context.Vendors.Find(id);
                if (vendor == null)
                {
                    return StatusCode(404, "Vendor Not Found");
                }
                else
                {
                    //var products = context.Products.Where(x => x.VendorId == id).ToList();
                    //if (products.Any())
                    //{
                    //    var productIds = products.Select(x => x.Id).ToList();

                    //    var inventory = context.Inventories.Where(x => productIds.Contains((int)x.ProductId)).ToList()
                    //        .Join(products, inv => inv.ProductId,
                    //        pro => pro.Id, (invent, p) => new
                    //        {
                    //            p.Id,
                    //            p.BrandName,
                    //            p.Image,
                    //            p.Description,
                    //            p.Category,
                    //            p.SubCategory,
                    //            p.Color,
                    //            p.Status,
                    //            InventoryId= invent.Id,
                    //            invent.Stock,
                    //            invent.Price,
                    //            invent.ProductSize,
                                
                    //        }).ToList();

                    //   // return Ok(inventory);
                    //}
                    var product = context.Inventories.Where(i => i.Product.VendorId == id).Select(
                        p => new
                        {
                            p.Product.Id,
                            p.Product.BrandName,
                            p.Product.Image,
                            p.Product.Description,
                            p.Product.Category,
                            p.Product.SubCategory,
                            p.Product.Color,
                            p.Product.Status,
                            InventoryId =p.Id,p.Stock,p.Price,p.ProductSize

                        }).ToList(); 
                    if(product.Any())
                        return Ok(product);
                    else
                        return StatusCode(404, "Products Not Found");
                }

            }
            catch (Exception ex)
            { return BadRequest(ex.Message); }
        }

       // [Authorize(Roles ="User")]
        //1

        [HttpGet("Get Inventory Details by ProductId/{id}")]
        public IActionResult Get_Inventory_ProductId(int id)
        {
            try
            {
                //var inventories = context.Inventories.Where(x => x.ProductId == id).ToList();
                //if(inventories.Any())
                //{
                //    var selectedData = inventories.Select(x => new
                //    {
                //        x.Id,x.ProductSize,x.Price,x.Stock
                //    });
                //    //return Ok(selectedData);
                //}
                var inventories2 = context.Inventories.Where(x => x.ProductId == id).Select(
                    x => new
                    {
                        x.Id,x.ProductSize,x.Price,x.Stock
                    }).ToList();

                if(inventories2.Any())
                   {
                    log.LogInformation($"Retrieving inventory details for the product whose id is {id},");
                    return Ok(inventories2); }


                else
                   {
                    log.LogInformation($"Inventories doesn't exist for the product whose id is {id}.");
                    return NotFound(); }

            }catch (Exception ex) {
                log.LogInformation($"An error occurred while retrieving the inventory details for the product whose id is {id}.");
                    return BadRequest(ex.Message); }
        }
    }
}

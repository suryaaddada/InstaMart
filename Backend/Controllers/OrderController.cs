using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.V1.Controllers
{
    [Route("api/[controller]")] 

    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly DBContext context;
        private readonly ILogger<OrderController> log;
        private readonly IConfiguration configuration;
        public OrderController(DBContext _context, ILogger<OrderController> log, IConfiguration configuration)
        {
            context = _context;
            this.log = log;
            this.configuration = configuration;
        }

        [Authorize(Roles = "User")]   
        //2
        [HttpGet("Get All Orders Based On User Id/{id}")]
        public IActionResult Get_All_OrderDetails(int id)
        {
            try
            {
                var user = context.Users.Find(id);
                if (user != null)
                {


                    //var orderid = context.Orders.Where(x => x.UserId == id).Select(x => x.Id).ToList();
                    //if (orderid.Any())
                    //{
                    //    var orderDetails = (from oi in context.OrderedItems
                    //                        join o in context.Orders on oi.OrderId equals o.Id
                    //                        join p in context.Products on oi.ProductId equals p.Id
                    //                        join invent in context.Inventories on oi.InventoryId equals invent.Id
                    //                        join ship in context.Shippings on o.ShippingId equals ship.Id 
                    //                        join v in context.Vendors on p.VendorId equals v.Id
                                            

                    //                        where orderid.Contains((int)oi.OrderId)
                    //                        select new
                    //                        {
                    //                            o.Date, 
                    //                            o.Id,
                    //                            o.PaymentType,
                    //                            o.PaymentId,
                    //                            o.Amount,
                    //                            orderid=oi.Id,
                    //                            oi.OrderStatus,
                    //                            oi.DeliveredDate,
                    //                            pid=p.Id,
                    //                            p.BrandName,
                    //                            p.Image,
                    //                            p.Description,
                    //                            p.Category,
                    //                            p.SubCategory,
                    //                            p.Color,
                    //                            p.VendorId,
                    //                            oi.Quantity,
                    //                            invent.ProductSize,
                    //                            invent.Price,
                    //                            v.ShopName,
                    //                            ship.Name,
                    //                            ship.Address,ship.City,ship.Country,ship.State,ship.Mobile,ship.Pincode
                    //                        }).OrderByDescending(x=>x.Date).ToList();

                    //    return Ok( orderDetails );


                    //}
                    //else
                    //{
                    //    return StatusCode(404, "No orders found");
                    //}

                    var orderdetailsTest = (from oi in context.OrderedItems
                                            where oi.Order.User.Id == id
                                            select new
                                            {
                                                oi.Order.Date,
                                                oi.Order.Id,
                                                oi.Order.PaymentType,
                                                oi.Order.PaymentId,
                                                oi.Order.Amount,
                                                orderid = oi.Id,
                                                oi.OrderStatus,
                                                oi.DeliveredDate,
                                                pid = oi.Product.Id,
                                                oi.Product.BrandName,
                                                oi.Product.Image,
                                                oi.Product.Description,
                                                oi.Product.Category,
                                                oi.Product.SubCategory,
                                                oi.Product.Color,
                                                oi.Product.VendorId,
                                                oi.Quantity,
                                                oi.Inventory.ProductSize,
                                                oi.Inventory.Price,
                                                oi.Product.Vendor.ShopName,
                                                oi.Order.Shipping.Name,
                                                oi.Order.Shipping.Address,
                                                oi.Order.Shipping.City,
                                                oi.Order.Shipping.Country,
                                                oi.Order.Shipping.State,
                                                oi.Order.Shipping.Mobile,
                                                oi.Order.Shipping.Pincode


                                            }).OrderByDescending(x => x.Date).ToList(); 

                    if(orderdetailsTest.Any())
                      { 
                        log.LogInformation($"Fecthing all previous order details for the user id:{id}");
                        return Ok(orderdetailsTest); }
                    log.LogInformation($"Previous Order details not found for the user id:{id}");
                    return StatusCode(404, "Order Details not Found");
                }
                log.LogInformation($"User details not found for the user id:{id}");
                return StatusCode(404, "User Not Found");
            }catch (Exception ex)
            {
                log.LogError($"An error occured while fetching previous order details for the user id :{id}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        //1
        [HttpGet("Get all Ordered_Items")]
        public IActionResult Get_All_Ordered_Item_Details()
        {
            try
            {

                //var orderDetails2 = (from oi in context.OrderedItems
                //                    join o in context.Orders on oi.OrderId equals o.Id
                //                    join p in context.Products on oi.ProductId equals p.Id

                //                    select new
                //                    {
                //                        o.Date,
                //                        oi.Id,
                //                        oi.OrderStatus,
                //                        oi.DeliveredDate,
                //                        p.BrandName,
                //                        p.Image,
                //                        p.Description,
                //                        p.Category,
                //                        p.SubCategory,
                //                        p.Color,
                //                    }).OrderByDescending(x => x.Date).ToList();

                var orderDetails =(from oi in context.OrderedItems select new
                {
                    oi.Order.Date,
                    oi.Id,oi.OrderStatus,oi.DeliveredDate,
                    oi.Product.BrandName,
                    oi.Product.Image,oi.Product.Description,oi.Product.Category,
                    oi.Product.SubCategory,oi.Product.Color
                }).OrderByDescending (x => x.Date).ToList(); 

                if(orderDetails.Any())
                   { log.LogInformation("Fetching Ordered items details");
                    return Ok(orderDetails); }

                log.LogInformation($"Ordered item details not found");
                return StatusCode(404, "Order Details NOt Found");


                   
            }
            catch (Exception ex)
            {
                log.LogError($"An Error occurred while fetching ordered item details ");
                return BadRequest(ex.Message);
            }
        }

       
        [HttpGet("Get Ordered Items BY orderId/{id}")]
        public IActionResult Get_OrderedItems_By_Order_Id(int id)
        {
            try
            {
                //var ordered_items = (from oi in context.OrderedItems join p in context.Products
                //                   on oi.ProductId equals p.Id  where oi.OrderId == id 
                //                     select new
                //                     {
                //                         p.BrandName, p.Image, p.Description, p.Category,
                //                         p.SubCategory, p.Color, oi.Quantity
                //                     }).ToList();

                var ordered_items = (from oi in context.OrderedItems where oi.OrderId == id select new
                                     {
                                         oi.Product.BrandName,
                                         oi.Product.Image,
                                         oi.Product.Description,
                                         oi.Product.Category,
                                         oi.Product.SubCategory,
                                         oi.Product.Color,
                                         oi.Quantity
                                     }).ToList();


                if (ordered_items.Any())
                {
                    return Ok(ordered_items);
                }
                else
                    return StatusCode(404, "No orders Found");
            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Get Orders By userId/{id}")]
        public IActionResult Get_Orders_By_UserId(int id)
        {
            try
            {
                var orders = context.Orders.Where(x => x.UserId == id).ToList();
                if(orders.Any())
                {
                    return Ok(orders);
                }
                return StatusCode(404, "Orders NOt Found");
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "User")]
        //1
        [HttpPost("Add Order")]
        public IActionResult Add_Orders([FromBody] Order order)
        {
            try
            {
                context.Orders.Add(order);
                context.SaveChanges();
                log.LogInformation("A new order is placed");
                return Ok(order.Id);

            }catch(Exception ex)
            {
                log.LogError("An error occurred while placing new order");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "User")]
        //1
        [HttpPost("Add Ordered Items")]
        public IActionResult Add_Ordered_Items([FromBody] OrderedItem orderedItem)
        {
            try
            {
                context.OrderedItems.Add(orderedItem);
                context.SaveChanges();
                log.LogInformation("A new ordered items are added");
                return Ok();

            }
            catch (Exception ex)
            {
                log.LogError("An error occurred while adding new ordered items");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin,Vendor")]
        //1,1
        [HttpGet("Get all Order Details By Vendor Id/{id}")]
        public IActionResult Get_Orders_Details_By_Vendor_Id(int id)
        {
            try
            {
                var vendor = context.Vendors.Find(id);
                if(vendor == null)
                {
                    log.LogInformation($"Vendor doesn't exist to fetch the previous order details for the id :{id}");
                    return StatusCode(404, "Vendor Not Found");
                }else
                {
                    //var products = (from oi in context.OrderedItems
                    //                join p in context.Products on oi.ProductId equals p.Id 
                    //                join o in context.Orders on oi.OrderId equals o.Id
                    //                where p.VendorId == id
                    //                select new
                    //                {
                    //                    p.BrandName,p.Category,p.SubCategory ,p.Color,oi.Quantity,o.Amount
                    //                }).ToList() ;

                    var products = context.OrderedItems.Where(x=>x.Product.VendorId == id).Select(y=>
                    new
                    {
                        y.Product.BrandName,
                        y.Product.Category,y.Product.SubCategory ,y.Product.Color,
                        y.Quantity,y.Order.Amount
                    }) .ToList() ;
                    if (products.Any())
                    {
                        log.LogInformation($"Previous order details fetched successfully for the vendor with id :{id}");
                        return Ok(products); }
                    else
                       {
                        log.LogInformation($"Order details not found for the vendor with id :{id}");
                        return StatusCode(404, "No Orders Found"); }
                }
            }
            catch(Exception ex)
            {
                log.LogError($"An error occurred for fetching ordered items for the vendor with id :{id}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        //1
        [HttpGet("Get Ordered Items Count/{id}")]
        public IActionResult Get_Ordered_Items_Count(int id)
        {
            try
            {
                var ordered_items = context.OrderedItems.Where(x=>x.ProductId == id).ToList();
                if (ordered_items.Any())
                {
                    var count = ordered_items.Sum(x => x.Quantity);
                    log.LogInformation($"Get ordered count of product for id :{id}");
                    return Ok(count);
                }
                else
                    log.LogInformation($"Ordered count not found product with id :{id}");
                return StatusCode(404, "Ordered items not found");
            }catch(Exception ex)
            {
                log.LogError($"An error occurred while getting a count of product for id :{id}");
                return BadRequest(ex.Message); }
        }

        [Authorize(Roles = "User,Admin")]
        //1,1
        [HttpPatch("Order Status Change/{id}")]
        public IActionResult Order_Status_Change(int id,string order_Status,DateTime? delivered_date)
        {
            try
            {
                var item = context.OrderedItems.Find(id);
                if(item == null)
                {
                    log.LogInformation($"Ordered items not found for id :{id}");
                    return StatusCode(404, "Item not found");
                }
                else
                {
                    item.OrderStatus = order_Status;
                    item.DeliveredDate = delivered_date; 
                    if(order_Status== "Accept Return")
                    {
                        var orders = context.Orders.First(x => x.Id == item.OrderId);
                        var amount = context.Orders.Where(x => x.Id == item.OrderId).Select(o =>  o.Amount ).First();
                        var price = context.Inventories.Where(i => i.Id == item.InventoryId).Select(i => i.Price).First(); 
                        orders.Amount=amount-(price*item.Quantity);
                    }
                    context.SaveChanges(); 
                    log.LogInformation($"Ordered item details updated for the id :{id}");
                    return StatusCode(200, "Updated ");
                }
            }catch(Exception ex) {
                log.LogError($"An error occurred while updating the ordered items details for the id :{id}");
                return BadRequest(ex.Message); }
        }
    }
}

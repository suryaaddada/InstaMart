using Backend.Interface;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Backend.V1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DBContext context;
        private readonly IEmailService emailService;
        private readonly ILogger<UserController> log;
       

        public UserController(DBContext _context,IEmailService service,ILogger<UserController> log)
        {
            context = _context;
            emailService = service;
            this.log = log;
            
        }

        [Authorize(Roles = "Admin")]
        //1
        [HttpGet("Get Users")]
        public IActionResult GetAllUsers()
        {
            try
            {
                var users = context.Users.ToList();
                if (users.Any())
                {
                    log.LogInformation("Successfully retrieved all Users");
                    return Ok(users);
                }
                log.LogInformation("No Users Found");
                return NotFound();
            }
            catch (Exception ex)
            {
                log.LogError("An error Occurred while retrieving Users");
                return BadRequest("Error");
            }
        }

        [Authorize(Roles ="User,Admin")]
        //3 ,3
       
    
        [HttpGet("user/{id}")]
        public IActionResult GetUser(int id)
        {
            var user = context.Users.Find(id);

            if (user == null)
            {
                log.LogInformation($"User doesn't exist to fetch the user details for the id :{id}");
                return NotFound();
            }
            log.LogInformation($"Fetching User details for the id :{id}");
            return Ok(user);
        }

        [HttpPost("Add User")]
        public IActionResult AddUser([FromBody] User user)
        {
            try
            {
                log.LogInformation("A new user Registered.");
                context.Users.Add(user);
                context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                log.LogError("An Error occurred while registering the new user");
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("Delete User/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await context.Users.FindAsync(id);
                if (user == null)
                {
                    log.LogInformation($"User doesn't exist to fetch the user details for the id :{id}");
                    return NotFound();
                }
                else
                {
                    //from wishlist 
                    var wishlist = await context.Wishlists.Where(x => x.UserId==id).ToListAsync(); 
                    if(wishlist.Any())
                    {
                        context.Wishlists.RemoveRange(wishlist);
                        log.LogInformation($"Removing the wishlist details for the user id:{id}",LogLevel.Information);
                       // await context.SaveChangesAsync();
                    }
                    //Cart
                    var cart=await context.Carts.Where(x => x.UserId == id).ToListAsync();
                    if (cart.Any())
                    {
                        context.Carts.RemoveRange(cart);
                        log.LogInformation($"Removing the cart details for the user id:{id}", LogLevel.Information);
                    }

                        //Shipping

                        var shipping=await context.Shippings.Where(x => x.Userid==id).ToListAsync();
                    if(shipping.Any())
                    { context.Shippings.RemoveRange(shipping);
                        log.LogInformation($"Removing the shipping details for the user id:{id}", LogLevel.Information);
                    }



                    // Orders
                    var orders=await context.Orders.Where(x => x.UserId== id).ToListAsync();
                    
                    if(orders.Any())
                    {
                        //Ordered_Items
                        var orderIds = orders.Select(o => o.Id).ToList();
                        
                        var ordered_items=await context.OrderedItems.Where(x=>orderIds.Contains((int)x.OrderId)).ToListAsync(); 
                        if(ordered_items.Any())
                        { context.OrderedItems.RemoveRange(ordered_items);}

                        context.Orders.RemoveRange(orders);
                        log.LogInformation($"Removing the Previous order details for the user id:{id}", LogLevel.Information);
                    }



                    
                    
                    context.Users.Remove(user);
                    await context.SaveChangesAsync();
                    log.LogInformation($"Removing the User details for the user id:{id}", LogLevel.Information);
                    return Ok();
                }
            }

            catch (Exception ex)
            {
                log.LogError($"An error occurred hwil edeleting th euser for the id:{id}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "User,Admin")]
        //1,1
        [HttpPut("Update User/{id}")]
        public IActionResult UpdateUser(int id, [FromBody] User updatedUser)
        {
            try
            {
                var user = context.Users.Find(id);
                if (user == null)
                {
                    log.LogInformation($"User doesn't exist to fetch the user details for the id :{id}");
                    return NotFound();
                }
                else
                {
                    user.FirstName = updatedUser.FirstName;
                    user.LastName = updatedUser.LastName;
                    user.Email = updatedUser.Email;
                    user.Password = updatedUser.Password;
                    user.Gender = updatedUser.Gender;
                    user.Mobile = updatedUser.Mobile;
                    user.Role = updatedUser.Role;
                    context.SaveChanges();
                    log.LogInformation($"User details updated for the id :{id}");
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                log.LogError($"An Error occurred while updating the user for the user id: {id}");
                return BadRequest(ex.Message);
            }
        }


        //Shipping Details
        [Authorize(Roles = "User")]
        //2
        [HttpGet("Get All Shipping/{userid}")]
        public IActionResult Get_AllShipping_Details(int userid)
        {
            try
            {
                var user = context.Users.Find(userid);
                if (user == null)
                {
                    log.LogInformation($"User doesn't exist to fetch the user details for the id :{userid}");
                    return StatusCode(400, "User details not found"); }
                else
                {
                    //var shipping = context.Shippings.Where(x => x.Userid == userid).ToList();
                    //if (shipping.Any())
                    //{
                    //    var ids = shipping.Select(x => x.Id).ToList();
                    //    var result = shipping.Where(x => ids.Contains(x.Id)).Select(x => new
                    //    {
                    //        x.Id,
                    //        x.Name,
                    //        x.Address,
                    //        x.City,
                    //        x.Pincode,x.Country,x.Mobile,x.State,
                    //    }).ToList(); 
                    var shipping = context.Shippings.Where(s => s.User.Id == userid && s.Status==true).Select(
                        x => new
                        {
                            x.Id,
                            x.Name,
                            x.Address,
                            x.City,
                            x.Pincode,x.Country,x.Mobile,x.State,
                        }).ToList();
                    if (shipping.Any())
                       {
                        log.LogInformation($"Shipping details fetching for the user id:{userid} ");
                        return Ok(shipping); }

                    log.LogInformation($"Shipping details not available for the user id :{userid}");
                    return StatusCode(404, "Shipping Address not Found");
                    
                    
                }
            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred while fetching shipping details for the user id :{userid}");
                return BadRequest(ex.Message);
            }
        }
       
        [HttpGet("GetShipping By Id/{id}")]
        public IActionResult Get_Shipping_By_Id(int id)
        {
            try
            {
                var shipping = context.Shippings.Find(id);
                if(shipping == null)
                {
                    log.LogInformation($"Shipping details not found for the id :{id}");
                    return StatusCode(404, "Address Not found");
                }
                log.LogInformation($"Fetching shipping details for the id :{id}");
                return Ok(shipping);

            }catch (Exception ex)
            {
                log.LogError($"An Error occurred while fetching the shipping details  for the id:{id}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "User")]
        //1
        [HttpDelete("Delete Shipping/{id}")]
        public IActionResult Delete_Shipping(int id)
        {
            try
            {
                var shipping = context.Shippings.Find(id);
                if (shipping == null)
                {
                    log.LogInformation($"Shipping details not found for the id :{id}");
                    return StatusCode(404, "Not Found");
                }
                else
                    shipping.Status = false;
                log.LogInformation($"Shipping details Status changed to false for the id :{id}");
                context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                log.LogError($"An Error occurred while deleting the shipping details  for the id:{id}");
                return BadRequest(ex.Message);
            }
        }
        [Authorize(Roles = "User")]
        //1
        [HttpPost("Add Shipping")]
        public IActionResult Add_Shipping([FromBody] Shipping shipping)
        {
            try
            {
                log.LogInformation("A new shipping Address is added");
                context.Shippings.Add(shipping);
                context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                log.LogError("An error occurred while adding shipping Address");
                return BadRequest(ex.Message);
            }
        }


        [Authorize(Roles = "User")]
        //1
        [HttpPut("Update Shipping/{id}")]
        public IActionResult Update_shipping(int id, [FromBody] Shipping shipping)
        {
            try
            {
                var Updated_Shipping = context.Shippings.Find(id);
                if (Updated_Shipping == null)
                {
                    log.LogInformation($"Shipping details not found for the id :{id}");
                    return NotFound();
                }
                else
                {
                    Updated_Shipping.Userid = shipping.Userid;
                    Updated_Shipping.Name = shipping.Name;
                    Updated_Shipping.Address = shipping.Address;
                    Updated_Shipping.City = shipping.City;
                    Updated_Shipping.Pincode = shipping.Pincode;
                    Updated_Shipping.Country = shipping.Country;
                    Updated_Shipping.Mobile = shipping.Mobile;
                    Updated_Shipping.State = shipping.State;
                    context.SaveChanges();
                    log.LogInformation($"Shipping details updated for the id:{id}");
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                log.LogError($"An Error occurred while updating the shipping details  for the id:{id}");
                return BadRequest(ex.Message);
            }
        }

    } 

    

}

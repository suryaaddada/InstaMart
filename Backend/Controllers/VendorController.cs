using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.V1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendorController : ControllerBase
    {
        private readonly DBContext context;
        private readonly ILogger<VendorController> log;

        public VendorController(DBContext _context, ILogger<VendorController> log)
        {
            context = _context;
            this.log = log;
        }

        [Authorize(Roles = "Admin")]
        //1
        [HttpGet("Get All Vendors")]
        public IActionResult Get_All_Vendors()
        {
            try
            {
                var vendors = context.Vendors.Where(x=>x.Status=="Active").ToList();
                if (vendors.Any())
                {
                    log.LogInformation("Successfully retrieved all active Vendors");
                    return Ok(vendors);
                }
                log.LogInformation("No Active Vendors Found");
                return StatusCode(404, "Not Found");

            }
            catch (Exception ex)
            {
                log.LogError("An error Occurred while retrieving Vendors");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "User,Vendor")]
        //1,3
        [HttpGet("Get Vendor/{id}")]
        public IActionResult Get_Vendor(int id)
        {
            try
            {
                var vendor = context.Vendors.Find(id);
                if (vendor == null)
                {
                    log.LogInformation($"Vendor not found to fetch details for the id :{id}");
                    return NotFound();
                }
                else
                {
                    log.LogInformation($"Fetching Vendor details for the id :{id}");
                    return Ok(vendor);
                }
            }
            catch (Exception ex)
            {
                log.LogError($"An exception occurred while fetching vendor details for the id : {id}");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("Add Vendor")]
        public IActionResult Add_Vendor([FromBody] Vendor vendor)
        {
            try
            {
                log.LogInformation("Vendor Registered Successfully");
                context.Vendors.Add(vendor);
                context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                log.LogError("An Exception occurred while registering the Vendor");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        //1
        [HttpDelete("Delete Vendor/{id}")]
        public IActionResult Delete_Vendor(int id)
        {
            try
            {
                var vendor = context.Vendors.Find(id);
                if (vendor == null)
                {
                    log.LogInformation($"Vendor not found to fetch details for the id :{id}");
                    return StatusCode(404, "Not Found");

                }
                else
                {
                    vendor.Status = "Inactive";
                    vendor.Isapproved = true;
                    var products = context.Products.Where(x => x.VendorId == id).ToList();
                    if(products.Any())
                    {
                     

                        foreach(var p in products)
                        {
                            p.Status = "Inactive"; 
                            List<Inventory> inventory=context.Inventories.Where(x=>x.ProductId==p.Id).ToList();
                            if(inventory.Any())
                            {
                                context.Inventories.RemoveRange(inventory);
                                log.LogInformation($"Vendor products removed for the id :{id}");
                            }
                        }
                       
                    }
                    log.LogInformation($"Vendor status changed to inactive for the id :{id}");
                    context.SaveChanges();
                    return StatusCode(200,"Done");
                }
            }
            catch (Exception ex)
            {
                log.LogError($"An Exception occurred while deleting the vendor for the id :{id}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles ="Vendor")]
        //1
        [HttpPut("Update Vendor/{id}")]
        public IActionResult Update_Vendor(int id, [FromBody] Vendor vendor)
        {
            try
            {
                var Updatedvendor = context.Vendors.Find(id);
                if (Updatedvendor == null)
                {
                    log.LogInformation($"Vendor not found to fetch details for the id :{id}");
                    return StatusCode(404, "Vendor Not Found");
                }
                else
                {
                    Updatedvendor.Name = vendor.Name;
                    Updatedvendor.Mobile = vendor.Mobile;
                    Updatedvendor.Email = vendor.Email;
                    Updatedvendor.Password = vendor.Password;
                    Updatedvendor.Address = vendor.Address;
                    Updatedvendor.City = vendor.City;
                    Updatedvendor.State = vendor.State;
                    Updatedvendor.Pincode = vendor.Pincode;
                    Updatedvendor.Isapproved = vendor.Isapproved;
                    Updatedvendor.Status = vendor.Status;
                    Updatedvendor.ShopName=vendor.ShopName;

                    context.SaveChanges();
                    log.LogInformation($"Vendor details updated Successfully for the id :{id}");
                    return Ok();
                }

            }
            catch (Exception ex)
            {
                log.LogError($"An Exception occurred while updating the vendor for the id :{id}");
                return BadRequest(ex.Message);
            }
        }


        [Authorize(Roles ="Vendor")]
        //1
        [HttpPatch("ChangePassword/{id}")]
        public IActionResult ChangePassword(int id, string password)
        {
            var vendor = context.Vendors.Find(id);
            if (vendor == null)
            {
                log.LogInformation($"Vendor not found to fetch details for the id :{id}");
                return StatusCode(404, "Vendor Not Found");
            }
            else
            {
                log.LogInformation($"Vendor password changed successfully for the id :{id}");
                vendor.Password = password;
                context.SaveChanges();
                return Ok(vendor);
            }

        }

        [Authorize(Roles = "Admin")]
        //1
        [HttpPatch("Approval Status/{id}")]
        public IActionResult Vendor_Approval(int id,bool approvalstatus)
        {
            try
            {
                var vendor = context.Vendors.Find(id);
                if(vendor==null)
                {
                    log.LogInformation($"Vendor not found to fetch details for the id :{id}");
                    return StatusCode(404, "Vendor not found");

                }
                else
                {
                    log.LogInformation($"Vendor status changed for the id :{id}");
                    vendor.Isapproved = approvalstatus;
                    context.SaveChanges();
                    return Ok(true);
                }
            }catch (Exception ex)
            {
                log.LogError($"An Exception while changing th eStatus of Vendor for id :{id}");
                return BadRequest(ex.Message);
            }
        }


    }
}

namespace Backend.Models
{
    public partial class Vendor
    {
        public Vendor()
        {
            Products = new HashSet<Product>();
        }

        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public long Mobile { get; set; }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string City { get; set; } = null!;
        public string State { get; set; } = null!;
        public int Pincode { get; set; }
        public bool Isapproved { get; set; }
        public string Status { get; set; } = null!;
        public string ShopName { get; set; } = null!;

        public virtual ICollection<Product> Products { get; set; }
    }
}

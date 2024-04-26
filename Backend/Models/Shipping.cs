namespace Backend.Models
{
    public partial class Shipping
    {
        public Shipping()
        {
            Orders = new HashSet<Order>();
        }

        public int Id { get; set; }
        public int? Userid { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string City { get; set; } = null!;
        public int Pincode { get; set; }
        public string Country { get; set; } = null!;
        public long Mobile { get; set; }
        public string State { get; set; } = null!;
        public bool Status { get; set; }

        public virtual User? User { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }
}

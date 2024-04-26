namespace Backend.Models
{
    public partial class User
    {
        public User()
        {
            Carts = new HashSet<Cart>();
            Orders = new HashSet<Order>();
            Shippings = new HashSet<Shipping>();
            Wishlists = new HashSet<Wishlist>();
        }

        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public long Mobile { get; set; }
        public string Role { get; set; } = null!;

        public virtual ICollection<Cart> Carts { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<Shipping> Shippings { get; set; }
        public virtual ICollection<Wishlist> Wishlists { get; set; }
    }
}

namespace Backend.Models
{
    public partial class Product
    {
        public Product()
        {
            Carts = new HashSet<Cart>();
            Inventories = new HashSet<Inventory>();
            OrderedItems = new HashSet<OrderedItem>();
            Wishlists = new HashSet<Wishlist>();
        }

        public int Id { get; set; }
        public string BrandName { get; set; } = null!;
        public string Image { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string SubCategory { get; set; } = null!;
        public string Color { get; set; } = null!;
        public int? VendorId { get; set; }
        public string Status { get; set; } = null!;

        public virtual Vendor? Vendor { get; set; }
        public virtual ICollection<Cart> Carts { get; set; }
        public virtual ICollection<Inventory> Inventories { get; set; }
        public virtual ICollection<OrderedItem> OrderedItems { get; set; }
        public virtual ICollection<Wishlist> Wishlists { get; set; }
    }
}

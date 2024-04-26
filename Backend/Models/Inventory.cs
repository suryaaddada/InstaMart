namespace Backend.Models
{
    public partial class Inventory
    {
        public Inventory()
        {
            Carts = new HashSet<Cart>();
            OrderedItems = new HashSet<OrderedItem>();
        }

        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductSize { get; set; } = null!;
        public decimal Price { get; set; }
        public int Stock { get; set; }

        public virtual Product? Product { get; set; } = null!;
        public virtual ICollection<Cart> Carts { get; set; }
        public virtual ICollection<OrderedItem> OrderedItems { get; set; }
    }
}

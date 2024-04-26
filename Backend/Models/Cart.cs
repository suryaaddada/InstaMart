namespace Backend.Models
{
    public partial class Cart
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int InventoryId { get; set; }

        public virtual Inventory? Inventory { get; set; } = null!;
        public virtual Product? Product { get; set; } = null!;
        public virtual User? User { get; set; } = null!;
    }
}

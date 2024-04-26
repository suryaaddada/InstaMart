namespace Backend.Models
{
    public partial class OrderedItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int? InventoryId { get; set; }
        public DateTime? DeliveredDate { get; set; }
        public string OrderStatus { get; set; } = null!;

        public virtual Inventory? Inventory { get; set; }
        public virtual Order? Order { get; set; } = null!;
        public virtual Product? Product { get; set; } = null!;
    }
}

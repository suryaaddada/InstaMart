namespace Backend.Models
{
    public partial class Order
    {
        public Order()
        {
            OrderedItems = new HashSet<OrderedItem>();
        }

        public int Id { get; set; }
        public int UserId { get; set; }
        public long PaymentId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } = null!;
        public string PaymentType { get; set; } = null!;
        public DateTime Date { get; set; }
        public int ShippingId { get; set; }

        public virtual Shipping? Shipping { get; set; } = null!;
        public virtual User? User { get; set; } = null!;
        public virtual ICollection<OrderedItem> OrderedItems { get; set; }
    }
}

export const CartCount = async (userId) => {
    try {
      const request = await fetch(`https://localhost:7199/api/Product/Get Cart Items By User Id/${userId}`);
      if (request.ok) {
        const response = await request.json();
        return response.length;
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error in counting cart items:", error);
      return 0;
    }
  };
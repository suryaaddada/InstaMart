import { useEffect, useState } from "react";
import { Card, CardContent, Typography,Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export const BrandProduct = () => {
  const location = useLocation();
  const {uid, brand } = location.state;
  const [brandedProducts, setBrandedProducts] = useState([]); 
  const navigate=useNavigate();

  useEffect(() => {
    const fetchBrand = async () => {
      const request = await fetch(`https://localhost:7199/api/Product/GetAllProducts`);
      if (request.ok) {
        const response = await request.json();

        

        const brandProducts = response.filter((x) => x.brandName === brand); 
        setBrandedProducts(brandProducts);
      }
    };
    fetchBrand();
  }, [brand]);

  const handleProductClick = (productId) => {
    navigate('../view',{state:{uid,pid:productId}})
  };

  return (
    <div className="product-grid-container" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", padding: "100px 20px 20px 70px" }}>
      {brandedProducts.map((product, index) => (
        <Card
          key={index}
          className="product-card"
          style={{ cursor: "pointer" }}
          onClick={() => handleProductClick(product.id)}
        >
          <Grid item>
                           <img src={product.image} alt={product.description} style={{ maxWidth: '100%', maxHeight: '200px', width: 'auto', height: 'auto' }} />
             </Grid> 
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {product.brandName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

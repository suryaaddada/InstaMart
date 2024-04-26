import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardActionArea, CardContent, CardMedia, Grid, TextField } from "@mui/material";
import { useLocation } from "react-router-dom";

export const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [itemCounts, setItemCounts] = useState({}); // State to store item counts
  const location=useLocation();
  const token=location.state;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://localhost:7199/api/Product/GetAllProducts',{
          headers: {
                    
            Authorization: `Bearer ${token}`,
          }, 
        });
        if (response.status === 200) {
          setProducts(response.data);
          // Fetch item counts for all products
          const counts = {};
          await Promise.all(response.data.map(async product => {
            const itemCount = await getItemCount(product.id);
            counts[product.id] = itemCount;
          }));
          setItemCounts(counts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const getItemCount = async (id) => {
    try {
      const response = await axios.get(`https://localhost:7199/api/Order/Get Ordered Items Count/${id}`,{
        headers: {
                    
          Authorization: `Bearer ${token}`,
        }, 
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error fetching item count:", error);
      return 0;
    }
  };

  const filteredProducts = products.filter(product =>
    product.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.color.toLowerCase().includes(searchQuery.toLowerCase())
  ); 

  return (
    <div style={{paddingTop:100,paddingBottom:60}}>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ marginBottom: 8 }}
      />
      <Grid container spacing={3}>
        {filteredProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardActionArea>
              <Grid item>
                 <img src={product.image} alt={product.description} style={{ maxWidth: '100%', maxHeight: '200px', width: 'auto', height: 'auto' }} />
                </Grid> 
                <CardContent>
                  <div>
                    <strong>Brand: </strong>{product.brandName}
                  </div>
                  <div>
                    <strong>Description: </strong>{product.description}
                  </div>
                  <div>
                    <strong>Category: </strong>{product.category}
                  </div>
                  <div>
                    <strong>Subcategory: </strong>{product.subCategory}
                  </div>
                  <div>
                    <strong>Color: </strong>{product.color}
                  </div>
                  <div>
                    <strong>Orders Received: </strong>{itemCounts[product.id] || 0}
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

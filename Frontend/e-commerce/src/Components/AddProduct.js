import React, { useState } from 'react';
import { Grid, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography ,Tooltip} from '@mui/material';

import Send from '@mui/icons-material/Send';
import { useLocation, useNavigate } from 'react-router-dom';

export const AddProduct = () => {
  const info = sessionStorage.getItem("VToken");
  const ParsedVendor = JSON.parse(info);
  const id = ParsedVendor.id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brandName: '',
    image: '',
    description: '',
    category: '',
    subCategory: '',
    color: '',
    vendorId: id,
    status: 'Active'
  });

  const [productData, setProductData] = useState({ productId: '', productSize: '', price: '', stock: '' });
  const [savedProduct, setSavedProduct] = useState([]); 

  const location=useLocation();
  const token=location.state;

  const handlePost = () => {
    if (productData.productSize === '' || productData.price === '' || productData.stock === '') {
      alert('Please fill all fields');
      return;
    }

    const newProduct = {
      productId: '',
      productSize: productData.productSize,
      price: productData.price,
      stock: productData.stock
    };

    setSavedProduct(prevProductData => {
      if (savedProduct.length === 0)
        return [newProduct];
      else
        return [...prevProductData, newProduct]
    });

    setProductData({ productSize: '', price: '', stock: '' });
    console.log("saved", savedProduct);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
    console.log(productData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (savedProduct.length === 0) {
      alert("At least one variant should be added");
      return;
    }

    console.log(formData);
    try {
      const send = await fetch("https://localhost:7199/api/Product/Add Product", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (send.ok) {
        const id = await send.json();

        const updatedProducts = await Promise.all(savedProduct.map(async (product) => {
          try {
            const individual = { ...product, productId: id };
            const posting = await fetch(`https://localhost:7199/api/Product/Add Items into Inventory`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(individual),
            });
            if (posting.ok) {
              console.log("Items added into inventory");
            }
            return individual;
          } catch (error) {
            console.error("Error adding items into inventory:", error);
            // If there's an error, return null or handle it as needed
            return null;
          }
        }));

        console.log("Updated Products:", updatedProducts);
        navigate("/log/vendorbar");
      } else {
        console.log("Error in getting id");
      }
    } catch (error) {
      console.error("Error in Adding Product:", error);
    }
  };

  return (
    <Grid container spacing={3} style={{ padding: '100px 30px 50px 50px' }}>
      <Grid item xs={12} sm={4}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <form onSubmit={handleSubmit}>
            <TextField margin="dense" name="brandName" label="Brand Name" fullWidth value={formData.brandName} onChange={handleChange} required />
            <TextField margin='dense' name="image" label="Image URL" fullWidth value={formData.image} onChange={handleChange} required />
            <TextField margin="dense" name="description" label="Description" fullWidth value={formData.description} onChange={handleChange} required />
            <TextField margin="dense" name="category" label="Category" fullWidth value={formData.category} onChange={handleChange} required />
            <TextField margin="dense" name="subCategory" label="Subcategory" fullWidth value={formData.subCategory} onChange={handleChange} required />
            <TextField margin="dense" name="color" label="Color" fullWidth value={formData.color} onChange={handleChange} required />
            <Button variant="contained" color="primary" fullWidth type="submit">Submit</Button>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
      {formData.image &&
        <Paper elevation={3} style={{ padding: 20 }}>
          <img src={formData.image} alt="Preview" style={{ maxWidth: '100%' }} />
        </Paper>
      }
    </Grid>
    <Grid item xs={12} sm={4}>
      {formData &&
        <Paper elevation={3} style={{ padding: '25px 0 0 10px' }}>
          <Typography variant="h6" gutterBottom>Variant Details</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Size</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedProduct.length > 0 && savedProduct.map((row, index) => (
                  row.productSize && (
                    <TableRow key={index}>
                      <TableCell style={{ backgroundColor: row.productSize ? '#e6ffe6' : 'transparent' }}>
                        <TextField
                          value={row.productSize}
                          disabled
                          style={{ backgroundColor: row.productSize ? '#e6ffe6' : 'transparent', width: '50px' }}
                        />
                      </TableCell>
                      <TableCell style={{ backgroundColor: row.productSize ? '#e6ffe6' : 'transparent' }}>
                        <TextField
                          value={row.price}
                          disabled
                          style={{ backgroundColor: row.productSize ? '#e6ffe6' : 'transparent', width: '65px' }}
                        />
                      </TableCell>
                      <TableCell style={{ backgroundColor: row.productSize ? '#e6ffe6' : 'transparent' }}>
                        <TextField
                          value={row.stock}
                          disabled
                          style={{ backgroundColor: row.productSize ? '#e6ffe6' : 'transparent', width: '65px' }}
                        />
                      </TableCell>
                    </TableRow>
                  )
                ))}
                <TableRow >
                  <TableCell>
                    <TextField name='productSize'
                      value={productData.productSize}
                      onChange={handleProductChange} 
                      style={{width:'50px'}}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField name='price' value={productData.price}
                      onChange={handleProductChange} 
                      style={{width:'65px'}}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField name='stock' value={productData.stock}
                      onChange={handleProductChange} style={{width:'65px'}}
                    />
                  </TableCell>
                  <TableCell style={{padding:'0 -2px 0 0'}}> 
                  <Tooltip title="Post" arrow>
                    <Button onClick={handlePost}>
                      <Send />
                    </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      }
    </Grid>
  </Grid>
);
};

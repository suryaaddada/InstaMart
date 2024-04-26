import React, { useEffect, useState } from "react";
import { Card, CardContent, Grid, Typography, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import Slider from "react-slick";

export const VendorPage = () => {
    const info = sessionStorage.getItem("VToken");
    const ParsedVendor = JSON.parse(info);
    const id = ParsedVendor.id;
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`https://localhost:7199/api/Product/Get Grouped Product By Vendor id/${id}`,{
                    headers:{
                        Authorization: `Bearer ${ParsedVendor.token}`,
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("Data", data);
                    setProducts(data);
                } else {
                    console.error("Failed to fetch products");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [id]);

    // Group products by brand name
    const groupedProducts = {};
    products.forEach(product => {
        if (!groupedProducts[product.brandName]) {
            groupedProducts[product.brandName] = [];
        }
        groupedProducts[product.brandName].push(product);
    });

    const handleProductClick = (product) => {
        console.log(product)
        navigate("VProduct", { state: { Product: product, vendorId: id ,token:ParsedVendor.token} });
    };
 
    return (
        <div style={{ padding: "80px 0" }}>
            {Object.keys(groupedProducts).map(brandName => (
                <div key={brandName}>
                    <Typography variant="h4" gutterBottom>
                        {brandName}
                    </Typography> 
                   
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {groupedProducts[brandName].map(product => (
                            <Card key={product.id} style={{ width: 300, margin: 10, cursor: "pointer", backgroundColor: "#f5f5f5", borderRadius: 10 }} onClick={() => handleProductClick(product)}>
                                <Grid item>
                                   <img src={product.image} alt={product.description} style={{ maxWidth: '100%', maxHeight: '200px', width: 'auto', height: 'auto' }} />
                                </Grid> 
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {product.brandName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {product.description}
                                    </Typography>
                                   
                                </CardContent>
                                <CardContent>
                                    <Table size="small" style={{ border: "none" }}>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell><b>Size</b></TableCell>
                                                <TableCell><b>Price</b></TableCell>
                                                <TableCell><b>Stock</b></TableCell>
                                            </TableRow>
                                            {product.sizes?.map(detail => (
                                                <TableRow key={detail.id}>
                                                    <TableCell style={{ padding: 0 }}>
                                                        <div style={{ width: 70, height: 30, borderRadius: "50px", backgroundColor: "lightgray", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                            <Typography variant="body2" color="textSecondary" component="p" style={{ margin: 0, paddingBottom: 2 }}>
                                                                {detail.productSize}
                                                            </Typography>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell style={{ padding: 0 }}>{detail.price}</TableCell>
                                                    <TableCell style={{ padding: 0 }}>{detail.stock}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        ))}
                    </div> 
                    
                </div>
            ))}
        </div>
    );
};

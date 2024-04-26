import React, { useEffect, useState } from 'react';
import {  Grid, Card, CardContent, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Chart from 'chart.js';

export const VendorStatisitics=()=>{ 

  const[orders,setOrders]=useState([]);
  const[revenue,SetRevenue]=useState(0);
  const[totalProducts,SetTotalProducts]=useState(0);

  const location=useLocation();
  const {uid,token}=location.state;

    useEffect(()=>{
        const fetchOrders=async()=>{
          try{ 
            console.log(token)
              const request=await axios.get(`https://localhost:7199/api/Order/Get all Order Details By Vendor Id/${uid}`,{
                headers: {
                    
                  Authorization: `Bearer ${token}`,
                }, 
              })
              if(request.status==200)
              {
                setOrders(request.data);
                console.log(request); 
                const rev=request.data.reduce((total,orders)=>total+orders.amount,0).toFixed(2);
                const products=request.data.reduce((total,orders)=>total+orders.quantity,0);
                SetRevenue(rev);
                SetTotalProducts(products);
                generatePieChart(request.data); 
                generateBrandPieChart(request.data);
              } 
              
        
            }catch(error)
            {
              console.error("Error in getting orders data from vendor")
            }
      }

    fetchOrders();
      },[uid]); 
    
      const generatePieChart = (orders) => {
        // Extract subcategories from orders
        const subcategories = orders.map(order => order.subCategory);
      
        // Count occurrences of each subcategory
        const subcategoryCounts = {};
        subcategories.forEach(subcategory => {
          subcategoryCounts[subcategory] = (subcategoryCounts[subcategory] || 0) + 1;
        });
      
        // Prepare data for the chart
        const labels = Object.keys(subcategoryCounts);
        const data = Object.values(subcategoryCounts);
      
        // Render pie chart
        const ctx = document.getElementById('subcategoryChart');
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              label: 'Orders by Subcategory',
              data: data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',  // Red
                'rgba(54, 162, 235, 0.5)',   // Blue
                'rgba(255, 206, 86, 0.5)',   // Yellow
                'rgba(75, 192, 192, 0.5)',   // Green
                'rgba(153, 102, 255, 0.5)',  // Purple
                'rgba(255, 159, 64, 0.5)',   // Orange
                'rgba(0, 255, 255, 0.5)',    // Cyan
                'rgba(255, 0, 255, 0.5)'     // Magenta
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(0, 255, 255, 1)',
                'rgba(255, 0, 255, 1)'
              ],          
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true // Start y-axis from 0
              }
            }
          }
        });
      }; 
      const generateBrandPieChart = (orders) => {
        // Extract brand from orders
        const brands = orders.map(order => order.brandName);
      
        // Count occurrences of each brand
        const brandCounts = {};
        brands.forEach(brandName => {
          brandCounts[brandName] = (brandCounts[brandName] || 0) + 1;
        });
      
        // Prepare data for the chart
        const labels = Object.keys(brandCounts);
        const data = Object.values(brandCounts);
      
        // Render pie chart
        const ctx = document.getElementById('brandPieChart');
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              label: 'Orders by Brand Name',
              data: data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',  // Red
                'rgba(54, 162, 235, 0.5)',   // Blue
                'rgba(255, 206, 86, 0.5)',   // Yellow
                'rgba(75, 192, 192, 0.5)',   // Green
                'rgba(153, 102, 255, 0.5)',  // Purple
                'rgba(255, 159, 64, 0.5)',   // Orange
                'rgba(0, 255, 255, 0.5)',    // Cyan
                'rgba(255, 0, 255, 0.5)'     // Magenta
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(0, 255, 255, 1)',
                'rgba(255, 0, 255, 1)'
              ],          
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      };
    return (
      
                <div>
                  
                    <section> 
                      
                        <Typography variant="h2" sx={{ mb: 2 }}>Statistics</Typography>
                        <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2">Total Products Ordered</Typography>
                                <Typography variant="body1">{totalProducts}</Typography>
                            </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2">Total Orders</Typography>
                                <Typography variant="body1">{orders.length}</Typography>
                            </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2">Revenue Earned</Typography>
                                <Typography variant="body1">{revenue}</Typography>
                            </CardContent>
                            </Card>
                        </Grid>
                        </Grid>
                    </section> 

                    {orders.length >0 && 
                                        <Grid container spacing={2} style={{paddingTop:40}}>
                                            <Grid item xs={6}>
                                            {/* Subcategory Pie Chart */}
                                            <section style={{ width: '100%' }}> 
                                            <Typography variant="h5">Sub Category</Typography>
                                                <canvas id="subcategoryChart" style={{ width: '100%' }}></canvas>
                                            </section>
                                            </Grid>
                                            <Grid item xs={6}>
                                            {/* Brand Bar Chart */}
                                            <section style={{ width: '100%' }}> 
                                            <Typography variant="h5">Brand</Typography>
                                                <canvas id="brandPieChart" style={{ width: '100%' }}></canvas>
                                            </section>
                                            </Grid>
                                    
                                        </Grid> 
                    }
                  
                </div> 

    )
}
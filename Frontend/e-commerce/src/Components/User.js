import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chart from 'chart.js';

export const User = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const { uid,token } = location.state;
  const [amount, setAmount] = useState(0.0);
  const [products, setProducts] = useState(0);

  const handleLogOut = (e) => {
    e.preventDefault();
    if (window.confirm("Do you want to logout?")) {

      setTimeout(() => {
        sessionStorage.clear();
        navigate("/");
        window.location.reload();
      }, 0);
    }
  };
  useEffect(() => {
    const OrdersData = async () => {
      const request = await axios.get(`https://localhost:7199/api/Order/Get All Orders Based On User Id/${uid}`,{
        headers: {
                    
          Authorization: `Bearer ${token}`,
        }, 
      });
      if (request.status === 200) {
        console.log(request.data);
        setOrders(request.data);
        const totalPrice = request.data.reduce((total, order) => total + order.amount, 0).toFixed(2);
        const totalProducts = request.data.reduce((total, order) => total + order.quantity, 0);

        setAmount(totalPrice);
        setProducts(totalProducts);

        // Generate Bar Chart
        generatePieChart(request.data);

        generateBrandHistogram(request.data);
        
       // generateMonthlyPurchasesLineChart(request.data);
      }
    }
    OrdersData();
  }, [uid]);

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

  const generateBrandHistogram = (ordersData) => {
    const brands = ordersData.map(order => order.brandName);
    const brandCounts = brands.reduce((counts, brand) => {
      counts[brand] = (counts[brand] || 0) + 1;
      return counts;
    }, {});
  
    const brandNames = Object.keys(brandCounts);
    const brandValues = Object.values(brandCounts);
  
    const ctx = document.getElementById('brandChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: brandNames,
        datasets: [{
          label: 'Brand',
          data: brandValues,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min:0,
            title: {
              display: true,
              text: 'Count'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Brand'
            }
          }
        }
      }
    });
  };
  
  const generateMonthlyPurchasesLineChart = (orders) => {
    const monthlyPurchases = orders.map(order => new Date(order.date).getMonth());
    const purchaseCounts = monthlyPurchases.reduce((counts, month) => {
      counts[month] = (counts[month] || 0) + 1;
      return counts;
    }, {});
  
    const months = Object.keys(purchaseCounts).map(monthIndex => {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return monthNames[parseInt(monthIndex)];
    });
    const frequencies = Object.values(purchaseCounts);
  
    new Chart(document.getElementById("monthlyPurchasesLineChart"), {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Number of Purchases',
          data: frequencies,
          borderColor: 'rgba(75, 192, 192, 1)', // Adjust color as needed
          borderWidth: 2,
          fill: false
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Purchases'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        }
      }
    });
  };
  



  return (
    <Container style={{padding:'80px 0 80px 0'}}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} sx={{ "& > *": { flexGrow: 1, maxWidth: "45%" }, paddingTop: 10 }}>
        <Button variant="contained" color="primary" onClick={() => navigate("../uprofile",{state:token})} sx={{ bgcolor: 'white', borderRadius: 7, color: 'black' }}>Profile</Button>
        <Button variant="contained" color="primary" sx={{ bgcolor: 'white', borderRadius: 7, color: 'black' }} onClick={() => navigate("../upassword",{state:token})}>Change Password</Button>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} sx={{ "& > *": { flexGrow: 1, maxWidth: "45%" } }}>
        <Button variant="contained" color="primary" onClick={() => navigate("../orders",{state:{token}})} sx={{ bgcolor: 'white', borderRadius: 7, color: 'black' }}>Orders</Button>
        <Button variant="contained" color="primary" sx={{ bgcolor: 'white', borderRadius: 7, color: 'black' }} onClick={() => navigate('../address',{state:{token:token}})}>Saved Address</Button>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} sx={{ "& > *": { flexGrow: 1, maxWidth: "45%" } }} >
        <Button variant="contained" color="primary" sx={{ bgcolor: 'white', borderRadius: 7, color: 'black' }} onClick={handleLogOut} >Log Out</Button>
      </Box>

      {/* Statistics */}
      <section>
        <Typography variant="h2" sx={{ mb: 2 }}>Statistics</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">Total Products</Typography>
                <Typography variant="body1">{products}</Typography>
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
                <Typography variant="h5" component="h2">Amount Spend</Typography>
                <Typography variant="body1">{amount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section>

      {/* Bar Chart */}
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
        <canvas id="brandChart" style={{ width: '100%' }}></canvas>
      </section>
    </Grid>
   
  </Grid>

    </Container>
  );
};

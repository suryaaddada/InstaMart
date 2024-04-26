import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Card, CardContent, Typography ,Box} from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Admin = () => {
  const navigate = useNavigate();  
  const[vendor,setVendor]=useState([]);
  const[user,setUser]=useState([]);
  const[products,setProduct]=useState([]);
  const location=useLocation();
  const token=location.state;
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
  useEffect(()=>{
    const fetchUsers=async()=>{ 
    
      const vendors=await axios.get('https://localhost:7199/api/Vendor/Get All Vendors',{
        headers: {
                    
          Authorization: `Bearer ${token}`,
        }, 
      });
      if(vendors.status==200)
      {
        setVendor(vendors.data);
      } 
      const users=await axios.get('https://localhost:7199/api/User/Get Users',{
        headers: {
                    
          Authorization: `Bearer ${token}`,
        }, 
      });
      if(users.status==200)
      {
        const filteredUsers=users.data.filter(x=>x.role=="User");
        setUser(filteredUsers);
      } 
      const products=await axios.get('https://localhost:7199/api/Product/GetAllProducts',{
        headers: {
                    
          Authorization: `Bearer ${token}`,
        }, 
      })
      if(products.status==200)
      {
        setProduct(products.data);
      }
    }
    fetchUsers();
  },[])

  return (
    <Container style={{padding:'50px 0 0 0 '}}>
      {/* Profile Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} sx={{ "& > *": { flexGrow: 1, maxWidth: "45%" } ,paddingTop:10}}>
            <Button variant="contained" color="primary" onClick={() => navigate("../aprofile",{state:token})} sx={{ bgcolor: 'white', borderRadius: 7 , color:'black' }}>Profile</Button>
            <Button variant="contained" color="primary" sx={{ bgcolor: 'white', borderRadius: 7 , color:'black' }} onClick={() => navigate("../apassword",{state:token})}>Change Password</Button>
    </Box>
    
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} sx={{ "& > *": { flexGrow: 1, maxWidth: "45%" } }} >
            <Button variant="contained" color="primary" sx={{ bgcolor: 'white', borderRadius: 7 , color:'black' }} onClick={handleLogOut} >Log Out</Button>
    </Box>


      {/* Statistics */}
      <section>
        <Typography variant="h2" sx={{ mb: 2 }}>Statistics</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">Total Products</Typography>
                <Typography variant="body1">{products.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">Total Users</Typography>
                <Typography variant="body1">{user.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">Total Vendors</Typography>
                <Typography variant="body1">{vendor.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section> 
     
    </Container>
  );
};



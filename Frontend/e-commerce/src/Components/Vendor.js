import React, {  useState } from 'react';
import { Button, Container,Box} from '@mui/material';
import {  useLocation, useNavigate } from 'react-router-dom';

import { VendorStatisitics } from './VendorStatistics';

export const Vendor = () => {
  const navigate = useNavigate(); 
  const location=useLocation();
  const {uid,token}=location.state;
  

 
  return (
    <Container style={{padding:'80px 0 80px 0'}}>
      {/* Profile Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} sx={{ "& > *": { flexGrow: 1, maxWidth: "45%" } ,paddingTop:10}}>
  <Button variant="contained" color="primary" onClick={() => navigate("../vprofile",{state:token})} sx={{ bgcolor: 'white', borderRadius: 7 , color:'black' }}>Profile</Button>
  <Button variant="contained" color="primary" sx={{ bgcolor: 'white', borderRadius: 7 , color:'black' }} onClick={() => navigate("../vpassword",{state:token})}>Change Password</Button>
</Box>

    <VendorStatisitics/>
      
    </Container>
  );
};



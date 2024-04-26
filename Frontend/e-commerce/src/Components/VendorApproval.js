import React, { useEffect, useState } from "react";
import { Tabs, Tab, Button, Card, CardContent, Typography, Badge, TextField,InputAdornment, IconButton } from "@mui/material";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export const VendorApproval = () => {
  const [approvedVendor, setApprovedVendor] = useState([]);
  const [unapprovedVendor, setUnapprovedVendor] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredApprovedVendor, setFilteredApprovedVendor] = useState([]);
  const [filteredUnapprovedVendor, setFilteredUnapprovedVendor] = useState([]);
  const navigate=useNavigate();
  const location=useLocation();
  const{token}=location.state;

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [searchQuery, approvedVendor, unapprovedVendor]);

  const fetchVendors = async () => {
    try {
      const response = await fetch(`https://localhost:7199/api/Vendor/Get All Vendors`,{
        headers: {
                    
          Authorization: `Bearer ${token}`,
        }, 
      });
      if (response.ok) {
        const data = await response.json();
        const approved = data.filter((vendor) => vendor.isapproved);
        const unapproved = data.filter((vendor) => !vendor.isapproved);
        setApprovedVendor(approved);
        setUnapprovedVendor(unapproved);
        setFilteredApprovedVendor(approved);
        setFilteredUnapprovedVendor(unapproved);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const handleCardClick = (vendorId) => {
    navigate('../vendor',{state:{uid:vendorId,token}})
  };

  const handleApprove = async (vendorId) => {
    try {
      await axios.patch(`https://localhost:7199/api/Vendor/Approval Status/${vendorId}?approvalstatus=true`,{
        headers: {
                    
          Authorization: `Bearer ${token}`,
        }, 
      });
      fetchVendors();
    } catch (error) {
      console.error("Error in approving:", error);
    }
  };

  const handleReject = async (vendorId) => {
    try {
      await axios.delete(`https://localhost:7199/api/Vendor/Delete Vendor/${vendorId}`,{
        headers: {
                    
          Authorization: `Bearer ${token}`,
        }, 
      });
      fetchVendors();
    } catch (error) {
      console.error("Error in rejecting the vendor:", error);
    }
  };

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterVendors = () => { 
    if(selectedTab==0)
    {
    const approved = approvedVendor.filter((vendor) => vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || vendor.shopName.toLowerCase().includes(searchQuery.toLowerCase())); 
    setFilteredApprovedVendor(approved);
    }
    else if(selectedTab==1)
    {
    const unapproved = unapprovedVendor.filter((vendor) => vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || vendor.shopName.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredUnapprovedVendor(unapproved);
    }
   
    
  };

  return (
    <div style={{ padding: 100 }}>
      <TextField label="Search Vendors" variant="outlined" fullWidth value={searchQuery} onChange={handleSearch} 
  style={{ marginBottom: 16, borderRadius: 10, backgroundColor: '#f0f0f0' }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    ),
    endAdornment: (
      <InputAdornment position="end">
        {searchQuery && (
          <IconButton onClick={() => setSearchQuery("")}>
            <ClearIcon />
          </IconButton>
        )}
      </InputAdornment>
    )
  }}
  placeholder="Search by name or shop name"
  
/>
      <div style={{ position: 'sticky', top: 0, zIndex: 999, backgroundColor: 'white' }}>
        <Tabs value={selectedTab} onChange={handleChangeTab} centered>
          <Tab
              label={
              <Badge badgeContent={approvedVendor.length} color="primary" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                  Approved Vendors &nbsp;
              </Badge>
              }
          />
          <Tab
              label={
              <Badge badgeContent={unapprovedVendor.length} color="secondary" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
                  Unapproved Vendors &nbsp;
              </Badge>
              }
          />
        </Tabs>
      </div>

      {selectedTab === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
          {filteredApprovedVendor.map((vendor) => (
            <Button
              key={vendor.id}
              onClick={() => handleCardClick(vendor.id)}
              style={{ width: '100%', textDecoration: 'none', padding: 0 }}
            >
              <Card variant="outlined" style={{ marginBottom: '16px', width: '100%', backgroundColor: '#f0f0f0' }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {vendor.name}
                  </Typography>
                  <Typography variant="body1" component="p">
                    {vendor.shopName}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {vendor.address}, {vendor.city}, {vendor.state} - {vendor.pincode}
                  </Typography>
                </CardContent>
              </Card>
            </Button>
          ))}
        </div>
      )}
      {selectedTab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {filteredUnapprovedVendor.map((vendor) => (
            <Card key={vendor.id} variant="outlined" style={{ marginBottom: '16px', width: '100%', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
              <CardContent style={{ flex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" component="div">
                  {vendor.name}
                </Typography>
                <Typography variant="body1" component="p">
                  {vendor.shopName}
                </Typography>
                <Typography variant="body2" component="p">
                  {vendor.address}, {vendor.city}, {vendor.state} - {vendor.pincode}
                </Typography>
                <Typography variant="body2" component="p">
                  Contact: {vendor.mobile}
                </Typography>
              </CardContent>
              <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="contained" color="primary" style={{ width: '100%', marginBottom: '8px' }} onClick={() => handleApprove(vendor.id)}>Approve</Button>
                <Button variant="contained" color="error" style={{ width: '100%' }} onClick={() => handleReject(vendor.id)}>Reject</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

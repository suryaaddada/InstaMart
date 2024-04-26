import { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import { useLocation } from "react-router-dom";



export const VendorProfile = () => {
  const vendorString = sessionStorage.getItem("VToken");
  const vendorInfo = JSON.parse(vendorString);
  const id = vendorInfo.id;
  const [vendor, setVendor] = useState({});
  const [isClicked, setIsClicked] = useState(true); 
  const[success,setSuccess]=useState(false);
  const location=useLocation();
  const token=location.state;
 

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`https://localhost:7199/api/Vendor/Get Vendor/${id}`,{
        headers:{
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await data.json(); 
      
      setVendor(response);
    }

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendor(prevState => ({
      ...prevState,
      [name]: value
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Clicked");
    const isValid = true; // Implement validation if needed
    if (isValid) {
      try {
        const send = await fetch(`https://localhost:7199/api/Vendor/Update Vendor/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(vendor)
        });
        if (send.ok) {
          console.log("Updated Successfully");
          setSuccess(true)
          
         
        } else {
          console.error("Failed to update vendor");
        }
      } catch (error) {
        console.error("Error occurred during vendor update:", error);
      }
    }
  }

  return (
    <div className="container" >
      {isClicked ? (
        <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
  <Box maxWidth={600} bgcolor="lightgray" p={2} borderRadius={5} width="100%">
    <Box display="flex" justifyContent="center" mb={2}>
      <Avatar sx={{ width: 100, height: 100 }}>
        <PersonIcon fontSize="large" />
      </Avatar>
    </Box>
    <Typography variant="body1" component="p">
      <strong>Name:</strong> {vendor.name}
    </Typography>
    <Typography variant="body1" component="p">
      <strong>Shop Name:</strong> {vendor.shopName}
    </Typography>
    <Typography variant="body1" component="p">
      <strong>Mobile:</strong> {vendor.mobile}
    </Typography>
    <Typography variant="body1" component="p">
      <strong>Address:</strong> {vendor.address}
    </Typography>
    <Typography variant="body1" component="p">
      <strong>City:</strong> {vendor.city}
    </Typography>
    <Typography variant="body1" component="p">
      <strong>State:</strong> {vendor.state}
    </Typography>
    <Typography variant="body1" component="p">
      <strong>Pincode:</strong> {vendor.pincode}
    </Typography>
    <Typography align="center" mt={2}>
      <Button variant="contained" color="primary" onClick={() => setIsClicked(false)}>Edit</Button>
    </Typography>
  </Box>
</div>


<>
     {/* <Card sx={{ maxWidth: 400, maxHeight: 500 }}>
      <CardContent>
        <Avatar sx={{ width: 100, height: 100, marginBottom: 2 }}>
          <PersonIcon fontSize="large" />
        </Avatar>
        
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Name:</strong> {vendor.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Mobile:</strong> {vendor.mobile}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Address:</strong> {vendor.address}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>City:</strong> {vendor.city}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>State:</strong> {vendor.state}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Pincode:</strong> {vendor.pincode}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setIsClicked(false)}>Edit</Button>
      </CardContent>
    </Card> */}
    </> 
    </>
       
      ) : (
        <div style={{padding:'80px 0 80px 0'}}>
          <h3>Edit Vendor Information</h3>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Name" margin="dense" name="name" value={vendor.name} onChange={handleInputChange} required />
                <TextField fullWidth label="Shop Name" margin="dense" name="shopName" value={vendor.shopName} onChange={handleInputChange} required />
                <TextField fullWidth label="Mobile"  margin="dense" name="mobile" value={vendor.mobile} onChange={handleInputChange} required />
                <TextField fullWidth label="Address"   margin="dense" name="address" value={vendor.address} onChange={handleInputChange} required />
                <TextField fullWidth label="City"  margin="dense" name="city" value={vendor.city} onChange={handleInputChange} required />
                <TextField fullWidth label="State"   margin="dense" name="state" value={vendor.state} onChange={handleInputChange} required />
                <TextField fullWidth label="Pincode"   margin="dense" name="pincode" value={vendor.pincode} onChange={handleInputChange} required />
                <div>
                {!success?
                  <Button type="submit" variant="contained" color="primary">Save</Button>
                  :
                  <Button type="submit" variant="contained" color="primary">Saved</Button>
                  } &nbsp;&nbsp;&nbsp;
                  <Button variant="contained" color="secondary" onClick={() => setIsClicked(true)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card> 
          
        </div>
      )}
    </div>
  );
}

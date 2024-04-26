import { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { useLocation } from "react-router-dom";

 

export const UserProfile = () => {
  
  var id=0;
  const [user, setUser] = useState({});
  const [isClicked, setIsClicked] = useState(true); 
  const[success,setSuccess]=useState(false); 
  const location=useLocation();
  const token=location.state;

 useEffect(()=>{
  const fetchData=()=>{ 
    
    let StringData=null;
    if(sessionStorage.getItem("UToken")!=null)
    StringData= sessionStorage.getItem("UToken");
    else
    StringData= sessionStorage.getItem("AToken");
    const info=JSON.parse(StringData);
    id=info.id;

  }
  fetchData();

 },[]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`https://localhost:7199/api/User/user/${id}`,{
        headers: {
                    
          Authorization: `Bearer ${token}`,
        }, 
      });
      const response = await data.json();
      setUser(response);
    }

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
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
        const send = await fetch(`https://localhost:7199/api/User/Update User/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user)
        });
        if (send.ok) {
          console.log("Updated Successfully"); 
          setSuccess(true);

          
         
        } else {
          console.error("Failed to update user");
        }
      } catch (error) {
        console.error("Error occurred during user update:", error);
      }
    }
  }

  return (
    <div className="container">
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
      <strong>First Name:</strong> {user.firstName}
    </Typography>
    <Typography variant="body1" component="p">
      <strong>Last Name:</strong> {user.lastName}
    </Typography>
    <Typography variant="body1" component="p">
      <strong>Mobile:</strong> {user.mobile}
    </Typography>
    
    <Typography variant="body1" component="p">
      <strong>Gender:</strong> {user.gender}
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
        <div style={{paddingTop:90}}>
          <h3>Edit User Information</h3>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TextField fullWidth label="First Name" margin="dense" name="firstName" value={user.firstName} onChange={handleInputChange} required />
                <TextField fullWidth label="Last Name" margin="dense" name="lastName" value={user.lastName} onChange={handleInputChange} required />
                <TextField fullWidth label="Mobile"  margin="dense" name="mobile" value={user.mobile} onChange={handleInputChange} required />
                <TextField fullWidth select  label="Gender"  margin="dense"  name="gender" value={user.gender}  onChange={handleInputChange} required style={{textAlign:"left"}}>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                </TextField>

                
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

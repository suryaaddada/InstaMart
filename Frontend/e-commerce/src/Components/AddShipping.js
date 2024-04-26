import { Box, Card, CardContent, Grid, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const AddShipping=({token})=>{ 

    

    const info = sessionStorage.getItem("UToken");
    const parsedUser = JSON.parse(info);
    const id = parsedUser.id; 

    const[address,setAddress]=useState({
        name:'',
        userid:id,
        address:'',
        city:'', pincode:'',
        country:'',
        mobile:'',state:'',
        status:true

    });
    const[flag,setFlag]=useState(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress(prevAddresses =>({
            ...prevAddresses,[name]:value
        } ));
        setFlag(true);
       
    };  
    const handleSubmit=async()=>{
        try{ 
           const send =await fetch(`https://localhost:7199/api/User/Add Shipping`,{
            method:'POST',
            headers:{
                'Content-Type':"application/json", 
                Authorization: `Bearer ${token}`,
            },
            body:JSON.stringify(address),
           }) 
           if(send.ok)
           {
            console.log("Added Successfully");
            setFlag(false);
            handleReset();
           }

        }catch(error) 
        {
            console.error("Error in adding Addresss");
        }
    } 
   function handleReset() {
     
    setAddress({
        name:'',
        userid:id,
        address:'',
        city:'', pincode:'',
        country:'',
        mobile:'',state:''
    })
   }
   
return (
    <Box paddingTop={5} paddingBottom={5}>
        <Card>
            <CardContent>
            <Grid container spacing={2}> 
        <Grid item xs={12}> 
            <Grid container spacing={2}> 
            <Grid item xs={12}> 
            <TextField
                name="name"
                label="Name"
                 value={address.name}
                onChange={(e) => handleInputChange(e)}
                margin="dense"
                fullWidth
            />
        </Grid>
            <Grid item xs={12}> 
            <TextField
                name="address"
                label="Address"
                value={address.address}
                onChange={(e) => handleInputChange(e)}
                margin="dense"
                fullWidth
            />
        </Grid>
                <Grid item xs={4}> 
                    <TextField
                        name="city"
                        label="City"
                        value={address.city}
                        onChange={(e) => handleInputChange(e)}
                        margin="dense"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        name="state"
                        label="State"
                        value={address.state}
                        onChange={(e) => handleInputChange(e)}
                        margin="dense"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        name="country"
                        label="Country"
                        value={address.country}
                        onChange={(e) => handleInputChange(e)}
                        margin="dense"
                        fullWidth
                    />
                </Grid>
            </Grid>
        </Grid>
        <Grid item xs={12}> 
            <Grid container spacing={2}>
                <Grid item xs={6}> 
                    <TextField
                        name="mobile"
                        label="Mobile"
                        value={address.mobile}
                        onChange={(e) => handleInputChange(e)}
                        margin="dense"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}> 
                    <TextField
                        name="pincode"
                        label="Pincode"
                        value={address.pincode}
                        onChange={(e) => handleInputChange(e)}
                        margin="dense"
                        fullWidth 
                    />
                </Grid>
            </Grid>
        </Grid>
    </Grid> 
    
    <Button variant="contained" color="error" onClick={handleReset}>Reset</Button>  &nbsp;&nbsp;
    <Button variant="contained" onClick={handleSubmit} color={flag ? "primary" : "success"} 
    endIcon={!flag && <CheckCircleIcon />}>{flag ? "Submit" : "Submitted"}</Button> 
               </CardContent>
        </Card>
    </Box>
)
}
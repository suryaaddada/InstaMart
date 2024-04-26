import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'; 
import { FaRegAddressCard } from 'react-icons/fa';

import { Grid } from "@mui/material"; 
import  {FaCaretDown} from "react-icons/fa"
import {MdDeleteForever} from "react-icons/md"
import {IoMdAdd} from "react-icons/io"
import './address.css' 
import { AddShipping } from "./AddShipping"; 
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation } from "react-router-dom";


export const SavedAddress = () => {

    const info = sessionStorage.getItem("UToken");
    const parsedUser = JSON.parse(info);
    const id = parsedUser.id;

    const [address, setAddress] = useState([]);
    const [editableAddressId, setEditableAddressId] = useState(null);
    const[flag,setFlag]=useState(false); 
    const[add,setAdd]=useState(true); 

    const location=useLocation();

    const {token}=location.state;
    

    useEffect(() => {
        const fetchAddress = async () => {
            const response = await fetch(`https://localhost:7199/api/User/Get All Shipping/${id}`,{
                headers: {
                    
                    Authorization: `Bearer ${token}`,
                  }, 
            });
            if (response.ok) {
                const data = await response.json();
                setAddress(data);
            }
        };
        fetchAddress();
    }, [id,add]);

    

    const toggleEdit = (addressId) => {
        setEditableAddressId(addressId === editableAddressId ? null : addressId);
    };

    const handleCancelEdit = () => {
        setEditableAddressId(null);
    };

    const handleSubmit = async (editedAddress) => {
      
        try{
            const send=await fetch(`https://localhost:7199/api/User/Update Shipping/${editedAddress.id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':"application/json",
                    Authorization: `Bearer ${token}`,
                },
                body:JSON.stringify(editedAddress),
            }) 
            if(send.ok)
            {
                setEditableAddressId(null);
                console.log("Shipping Updated Successfully");
            }

        }catch(error)
        {
          console.error("Error in updating the Shipping Details");
        }
        console.log("Edited Address:", editedAddress);
       
    }; 
   
    
    const handleInputChange = (e, id) => {
        const { name, value } = e.target;
        setAddress(prevAddresses => prevAddresses.map(address =>
            address.id === id ? { ...address, [name]: value } : address
        ));
    }; 

    const handleDelete=async(id)=>{

        try{ 
            setFlag(false);
           
            const send=await fetch(`https://localhost:7199/api/User/Delete Shipping/${id}`,{
                method:'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  }, 
               
            }) 
            if(send.ok)
            { 
                setAddress(address.filter(x=>x.id!=id));
                console.log("Deleted Successfully");
            }  
            
            

        }catch(error)
        {
            console.error("Getting Error in deleting shipping");
        }
    } 
    const deleteConfirmationStyle = {
        position: "fixed",
        top: `${window.innerHeight / 2}px`, // Position in the middle of the viewport vertically
        left: `${window.innerWidth / 2}px`, // Position in the middle of the viewport horizontally
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    };
    

    return (
        <Box paddingTop={10} paddingBottom={10}> 
        {add ?( <>
            {address.map((x) => ( 
                
                <div key={x.id}>
                    <Card style={{ marginBottom: '20px' }}>
                        <CardContent>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaRegAddressCard style={{ marginRight: '10px' }} />
                                <Typography variant="h6">
                                    {x.name}
                                </Typography>
                            </div>
                            {editableAddressId !== x.id ? (
                                <>
                                    <Typography variant="body1" gutterBottom>
                                        Address: {x.address} {x.city} {x.state} - {x.pincode}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        Mobile: {x.mobile}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={() => toggleEdit(x.id)}
                                        style={{ textAlign: "right" }}
                                    >
                                        <FaCaretDown/>
                                    </Button> 
                                    <Button
                                        variant="outlined" color="error"
                                        onClick={()=>setFlag(true)}
                                        style={{ textAlign: "right" }}
                                    >
                                        <MdDeleteForever/>
                                    </Button> 
                                   
                                </>
                            ) : (
                                <>
                                    <Grid container spacing={2}> 
        <Grid item xs={12}> 
            <Grid container spacing={2}> 
            <Grid item xs={12}> 
            <TextField
                name="name"
                label="Name"
                defaultValue={x.name} 
                onChange={(e) => handleInputChange(e, x.id)}
                margin="dense"
                fullWidth
            />
        </Grid>
            <Grid item xs={12}> 
            <TextField
                name="address"
                label="Address"
                defaultValue={x.address}
                onChange={(e) => handleInputChange(e, x.id)}
                margin="dense"
                fullWidth
            />
        </Grid>
                <Grid item xs={4}> 
                    <TextField
                        name="city"
                        label="City"
                        defaultValue={x.city}
                        onChange={(e) => handleInputChange(e, x.id)}
                        margin="dense"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        name="state"
                        label="State"
                        defaultValue={x.state}
                        onChange={(e) => handleInputChange(e, x.id)}
                        margin="dense"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        name="country"
                        label="Country"
                        defaultValue={x.country}
                        onChange={(e) => handleInputChange(e, x.id)}
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
                        defaultValue={x.mobile}
                        onChange={(e) => handleInputChange(e, x.id)}
                        margin="dense"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}> {/* Pincode */}
                    <TextField
                        name="pincode"
                        label="Pincode"
                        defaultValue={x.pincode}
                        onChange={(e) => handleInputChange(e, x.id)}
                        margin="dense"
                        fullWidth
                    />
                </Grid>
            </Grid>
        </Grid>
    </Grid>
    <Button variant="outlined" onClick={handleCancelEdit}>Cancel</Button>
    <Button 
    variant="contained" 
    color="primary" 
    onClick={() => {
        const editedAddress = { ...x,userid:id}; 
        handleSubmit(editedAddress);
    }}
>
    Save
</Button>

                                </>
                            )}
                        </CardContent>
                    </Card> 
                    <div>
                    {flag && (
                                     <div className="delete-confirmation" style={deleteConfirmationStyle}>
                                     <p>Are you sure you want to delete this address?</p>
                                     <Button variant="contained" color="secondary" onClick={()=>handleDelete(x.id)} >Yes</Button>
                                     <Button variant="contained" onClick={()=>setFlag(false)} >No</Button>
                                 </div>)}
                    </div> 

                   
                </div>
                
                
            ))}  
           <Box display="flex" justifyContent="flex-end"> 
           <IconButton
        color="primary"
        style={{ width: '50px', height: '50px',backgroundColor:'currentcolor' }}
        onClick={() => setAdd(false)}
    >
        <IoMdAdd style={{ fontSize: '2rem' ,color:'white'}} />
    </IconButton>
</Box>

           </> ):(
            <>
             <Box display="flex" justifyContent="flex-start"> 
            <Button onClick={()=>{setAdd(true); }} style={{paddingTop:20,color:"black",textAlign:'left'}} ><ArrowBackIcon/></Button>
            </Box>
             <AddShipping  token={token}/> 
            
             </>
             )}
        </Box> 
       
        
    );
};

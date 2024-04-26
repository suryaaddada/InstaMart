import React, { useEffect, useState } from "react";
import { json, useLocation, useNavigate } from "react-router-dom";
import { Stepper, Step, StepLabel, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,Card,CardContent } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { AddShipping } from "./AddShipping";
import { Payment } from "./Payment";

export const Buy = () => {
    const location = useLocation();
    const { data,token } = location.state;
    const navigate = useNavigate(); 
    const[total,setTotal]=useState(0);  
    const[address,setAddress]=useState([]); 
    const[userid,setUserId]=useState();
    const[addaddressClick,setAddAddressClik]=useState(false); 
    const[shippingid,setShippingId]=useState(0);
    
    useEffect(()=>{
        const dataString = sessionStorage.getItem("UToken");
        const parseduser=JSON.parse(dataString);  
        setUserId(parseduser.id);
       
       
        const fetchAddress=async()=>{
            const request=await fetch(`https://localhost:7199/api/User/Get All Shipping/${userid}`,{
                headers: {
                    
                    Authorization: `Bearer ${token}`,
                  }, 
            });
            if(request.ok)
            {
                const response=await request.json();
                setAddress(response); 
                
            }
        }
        fetchAddress();


    },[userid,addaddressClick]);
    

    useEffect(() => { 
        const totalPrice = data.reduce((acc, product) => acc + product.price * product.quantity, 0);
        setTotal(totalPrice); 
        console.log(data);
       
    }, [data]); 

   

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const totalSteps = 3;

    return (
        <div style={{ paddingTop: 90, paddingBottom: 80 }}>
            <Stepper alternativeLabel activeStep={activeStep}>
                {["Review Product", "Pick Address", "Payment"].map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {activeStep === 0 && (
                <Box> 
                     <Box display="flex" justifyContent="space-between">
                        <Button onClick={(e)=>navigate(-1)}>Back</Button>
                        <Button onClick={handleNext} >Next</Button>
                    </Box>
                    <Typography variant="h5" gutterBottom>Product Details</Typography>
                    <div style={{ position: 'relative' }}>
    <TableContainer component={Paper}>
        <Table>
        <TableHead>
            <TableRow>
                <TableCell style={{ backgroundColor: 'lightsalmon', color: 'white' }}>Image</TableCell>
                <TableCell style={{ backgroundColor: 'lightsalmon', color: 'white' }}>Product Information</TableCell>
                <TableCell style={{ backgroundColor: 'lightsalmon', color: 'white' }}>Product Size</TableCell>
                <TableCell style={{ backgroundColor: 'lightsalmon', color: 'white' }}>Unit Price</TableCell>
                <TableCell style={{ backgroundColor: 'lightsalmon', color: 'white' }}>Quantity</TableCell>
                <TableCell style={{ backgroundColor: 'lightsalmon', color: 'white' }}>Total Price</TableCell>
            </TableRow>
        </TableHead>
            <TableBody>
                {data.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>
                            <img src={product.image} alt={product.brandName} style={{ width: 100 }} />
                        </TableCell>
                        <TableCell>
                            Brand:{product.brandName}<br />
                            Color:{product.color}<br />
                            {product.description}
                        </TableCell>
                        <TableCell>{product.productSize}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.price * product.quantity}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    <Typography style={{ position: 'absolute', bottom: 0, right: 20 }}>Sub Totals: {total}</Typography>
</div>

                   
                </Box>
            )}
            {activeStep === 1 && (
    <Box>
        <Box display="flex" justifyContent="space-between">
            <Button onClick={handleBack}>Prev</Button>
            <Button onClick={handleNext} disabled={shippingid==0} >Next</Button>
        </Box>  
        {!addaddressClick ? (
            <div>
        
        
            {address.map((address) => (
                <Card key={address.id} variant="outlined" style={{ marginBottom: 10 ,textAlign:'left'}}>
                    <CardContent>
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                        {address.name}
                        {shippingid === address.id && <CheckCircleOutlineIcon style={{ color: 'green', marginLeft: '4px' }} />}
                    </Typography>
                        <Typography>{address.address}</Typography>
                        <Typography> {address.city} </Typography>

                        <Typography>{address.state} , {address.country} - {address.pincode}</Typography>
                        <Typography variant="body1">
                            <span style={{ color: 'darkgray',fontWeight:'bold' }}>Mobile:</span> {address.mobile}
                        </Typography>

                        <Box mt={2}>
                            <Button variant="contained" style={{backgroundColor:'orange',color:'black', marginRight: '20px'}} onClick={(e)=>{setShippingId(address.id)}} >Deliver to this Address</Button>
                            {/* <Button variant="outlined" >Edit Address</Button> */}
                        </Box>
                    </CardContent> 

                </Card>
            ))}  
            <Button onClick={(e)=>setAddAddressClik(!addaddressClick)} >Add New Address</Button>  
            </div>
        ):
        <div> 
            
        <AddShipping  token={token}/>   

        <Button onClick={(e)=>setAddAddressClik(!addaddressClick)} >View Address </Button>
        </div>}
    </Box>
)}


            {activeStep ===2 && ( 
                <Box>
                    <Box display="flex" justifyContent="space-between">
                        <Button onClick={handleBack}>Prev</Button>
                    
                        {/* <Button onClick={(e) => navigate("..")}>Order</Button> */}
                    </Box>  
                    <Payment data={data} amount={total}shipId={shippingid} userId={userid} token={token}/>
                </Box>
            )}
        </div>
    );
};

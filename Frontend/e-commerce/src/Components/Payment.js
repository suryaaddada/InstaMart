import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Accordion, AccordionSummary, AccordionDetails, TextField, Grid, InputLabel, Typography, Button, Box } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

import { useNavigate } from "react-router-dom";
import './address.css'; 


export const Payment = ({ data, amount, shipId, userId ,token}) => {
    const [expiryDate, setExpiryDate] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");
    const [upiId, setUpiId] = useState("");
    const [errors, setErrors] = useState({});
    const [Amount, setAmount] = useState(amount);
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);  

    

    const deleteConfirmationStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'green',
        color: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        transition: 'opacity 0.3s ease-in-out',
      };
      
      const tickIconStyle = {
        fontSize: '60px',
        marginBottom: '20px',
      };
      
      function generateUniqueId(data) {
        // Generate a UUID (version 4)
        const uuid = uuidv4();
    
        // Combine provided data with generated UUID
        const combinedData = JSON.stringify({ data, uuid });
    
        // Generate a SHA-256 hash of the combined data
        const hexHash = CryptoJS.SHA256(combinedData).toString();
    
        // Convert hexadecimal string to decimal number
        let decimalId = parseInt(hexHash.substring(0, 12), 16);
    
        // Convert decimal number to string
        return String(decimalId);
    }

    const handlePaymentMethodChange = (method) => {
        if (method === "COD") {
            setAmount(amount + 20);
        } else {
            setAmount(amount);
        }

        if (method === "UPI") {
            setCardNumber("");
            setCvv("");
            setExpiryDate(null);
            setCardHolderName("");
        } 
        

        setPaymentMethod(method);
        setErrors({});
    };

    const handleExpiryDateChange = (date) => {
        if (!date) {
            setErrors({ ...errors, expiryDate: "Expiry date is required" });
        }
        setExpiryDate(date);
    };

    const handleProceedToPayment = async () => {
        let errors = {};

        if (paymentMethod === "Credit/Debit Card") {
            if (!cardNumber || !/^\d{16}$/.test(cardNumber)) {
                errors.cardNumber = "Card number must contain 16 digits";
            }

            if (!cvv || !/^\d{3}$/.test(cvv)) {
                errors.cvv = "CVV must contain 3 digits";
            }

            if (!expiryDate) {
                errors.expiryDate = "Expiry date is required";
            } else if (expiryDate < new Date()) {
                errors.expiryDate = "Expiry date must be in the future";
            }

            if (!cardHolderName) {
                errors.cardHolderName = "Card holder name is required";
            }
        } else if (paymentMethod === "UPI ID") {
            if (!upiId) {
                errors.upiId = "UPI ID is required";
            }
        }

        if (Object.keys(errors).length === 0) {
            try { 
                
                let Orderdata = { userId, paymentId: generateUniqueId(data), amount: Amount, status: "Success", paymentType: paymentMethod, date: new Date().toISOString(), shippingId: shipId }; 
                console.log(Orderdata);
                const request = await fetch(`https://localhost:7199/api/Order/Add Order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
               
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(Orderdata),
                })
                if (request.ok) {
                    const orderid = await request.json();

                    for (const item of data) {
                        try {
                            const { id, quantity, iid } = item;
                            const newData = { orderId: orderid, productId: id, quantity, inventoryId: iid,orderStatus:'Ordered' };

                            const apiRequest = await fetch('https://localhost:7199/api/Order/Add Ordered Items', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify(newData),
                            });

                            if (apiRequest.ok) {
                                console.log("Added");
                                const deleteCart = await fetch(`https://localhost:7199/api/Product/Delete Cart By Product id/${id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                    },
                                })

                            } else {
                                console.error("Error in API request");
                            }

                        } catch (error) {
                            console.error("Error in adding the data");
                        }
                    }

                    setShowConfirmation(true);
                }
            } catch (error) {
                console.error("Error in adding the orders")
            }
        } else {
            setErrors(errors);
        }
    };

    const onCloseConfirmation = () => {
        setShowConfirmation(false);
        navigate('../orders',{state:{token:token}});
    };

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
                <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                    <Typography variant="body1" style={{ color: '#333', fontWeight: 'bold' }}>
                        Amount: {Amount}
                    </Typography>
                </div>
            </Grid>
            <Grid item xs={12}>
                <Accordion onChange={() => handlePaymentMethodChange("COD")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                        <Typography>Cash on Delivery</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2" style={{ textAlign: 'left', color: 'green', fontStyle: 'italic' }}>
                            20 will be charged for COD option
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Grid>
            <Grid item xs={12}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                        <Typography>UPI</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Button variant="contained" color='warning' onClick={() => handlePaymentMethodChange("PayPal")} fullWidth>PayPal</Button> <br /><br />
                        <Button variant="outlined" onClick={() => handlePaymentMethodChange("PayTm")} fullWidth>PayTm</Button>
                    </AccordionDetails>
                </Accordion>
            </Grid>
            <Grid item xs={12}>
                <Accordion onChange={() => handlePaymentMethodChange("Credit/Debit Card")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3a-content" id="panel3a-header">
                        <Typography>Credit/Debit Card</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Card Number"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    error={!!errors.cardNumber}
                                    helperText={errors.cardNumber}
                                    fullWidth
                                    inputProps={{ maxLength: 16 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="CVV"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    error={!!errors.cvv}
                                    helperText={errors.cvv}
                                    fullWidth
                                    inputProps={{ maxLength: 3 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputLabel htmlFor="expiry-date">Expiry Date</InputLabel>
                                <DatePicker
                                    id="expiry-date"
                                    selected={expiryDate}
                                    onChange={handleExpiryDateChange}
                                    dateFormat="MM/yy"
                                    showMonthYearPicker
                                    minDate={new Date()}
                                    className="form-control"
                                    error={!!errors.expiryDate}
                                    helperText={errors.expiryDate}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Card Holder Name"
                                    value={cardHolderName}
                                    onChange={(e) => setCardHolderName(e.target.value)}
                                    error={!!errors.cardHolderName}
                                    helperText={errors.cardHolderName}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>
            <Grid item xs={12}>
                <Accordion onChange={() => handlePaymentMethodChange("UPI ID")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4a-content" id="panel4a-header">
                        <Typography>UPI ID</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid item xs={12}>
                            <TextField
                                label="UPI ID"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                error={!!errors.upiId}
                                helperText={errors.upiId}
                                fullWidth
                            />
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleProceedToPayment} disabled={!paymentMethod}>
                    Place Order
                </Button>
            </Grid>
            {showConfirmation && (
            <div className="backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }}>
    <div className="confirmation-wrapper" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: '900px' }}>
       
            <div className="delete-confirmation" style={{ ...deleteConfirmationStyle }}>
                <Box textAlign="center">
                    <CheckCircleIcon style={tickIconStyle} />
                    <Typography variant="h5" component="p">Order Placed Successfully!</Typography>
                    <Button variant="contained" color="warning" onClick={onCloseConfirmation}>View Orders</Button>
                </Box>
            </div>
            </div>
</div>
        )}
   


           
        </Grid>
    );
};



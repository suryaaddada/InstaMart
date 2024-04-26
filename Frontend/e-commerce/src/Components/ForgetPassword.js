import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {TbArrowBackUp} from "react-icons/tb";


export const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [verificationSent, setVerificationSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); 
    const[enteredOtp,SetEnteredOtp]=useState('');
    const[password,setPassword]=useState('');
    const[role,setRole]=useState('');
    const [resendAllowed, setResendAllowed] = useState(true); 
    const navigate=useNavigate();

    const validateEmail = async () => {
        try {
            const userResponse = await axios.get(`https://localhost:7199/api/Login/User_Email_Exists/${email}`);
            const vendorResponse = await axios.get(`https://localhost:7199/api/Login/Vendor_Email_Exists/${email}`);
           
            if (userResponse.data) {
                setRole('Users')
                return true;
            } else if (vendorResponse.data) {
                setRole('Vendors')
                return true;
            } else {
                setErrorMessage('Please enter a valid email');
                return  false ;
            }
        } catch (error) {
            console.error('Error checking email:', error);
            setErrorMessage('An error occurred. Please try again later.');
            return false;
        }
    }; 

    const generateOTP = () => {
        const OTP_LENGTH = 6; 
        const OTP_VALIDITY_DURATION = 2 * 60 * 1000; 
    
       
        let otp = '';
        for (let i = 0; i < OTP_LENGTH; i++) {
            otp += Math.floor(Math.random() * 10);
        }
    

        const currentTime = new Date().getTime();
        const validUntil = currentTime + OTP_VALIDITY_DURATION;
    
        return { otp, validUntil };
    };

    const handleEmailSubmit = async () => {
        setResendAllowed(false);
        const isValidEmail = await validateEmail();
        if (isValidEmail) {
            const { otp, validUntil } = generateOTP();
            setOtp(otp);
            
            setVerificationSent(true); 
            
            const htmlContent = `
                    <html>
                    <head>
                        <title>Password Reset</title>
                    </head>
                    <body>
                        <div style="background-color: #f0f0f0; padding: 20px;">
                            <h1 style="color: #333333;">Password Reset</h1>
                            <p style="color: #666666;">Your OTP for password reset is: ${otp}</p>

                          
                        </div>
                        <div style="text-align: left; padding: 20px;">
                            <p style="color: #666666;">Thanks & Regards,</p>
                            <p style="color: #666666;">Instamart Team</p>
                            <img src="https://copilot.microsoft.com/images/create/an-image-which-represents-e-commerce-and-name-is-i/1-65dcbd10be0f4763a2634f66314fd401?id=HIz7Op8jyovUBJgNqvGyLA%3D%3D&view=detailv2&idpp=genimg&idpclose=1&thId=OIG1.2.GilQ99kodPHKqMaM2m&ineditshare=1" alt="Logo">

                        </div>
                    </body>
                    </html>
                `;


            const data = {
                email: email,
                subject: "Password Reset",
                body: htmlContent
            };

            //const data={email,subject:"Password Reset",body:otp}
            const request=await fetch('https://localhost:7199/api/Login/Sending Email',{
                method:'POST',
                headers:{
                  'Content-Type': 'application/json',
                },
                body:JSON.stringify(data),
            })
            if (request.ok) {
                console.log("Email send success");
            } 
            setTimeout(() => {
                setResendAllowed(true);
            }, 10000);
            
            setTimeout(() => {
                setOtp('');
                setVerificationSent(false);
            }, validUntil - new Date().getTime());
        }
    };

    const handleOtpVerify = () => {
        if(otp==enteredOtp)
        {
        console.log("otp validation succcess");
        setOtpVerified(true);
        } 
        else 
        {
            console.log("otp valid failed")
            setOtpVerified(false);
        }

    };

    const handlePasswordChange = async() => {

        try{
            const request=await axios.post(`https://localhost:7199/api/Login/ForgotPassword?email=${email}&newPassword=${password}&role=${role}`)
            if(request.status==200)
            {
                console.log(request); 
                navigate("/log")
            }
        }catch(error)
        {
            console.error("Error in Updating the Password")
        }
        setEmail('');
        setOtp('');
        SetEnteredOtp('');
        setVerificationSent(false);
        setOtpVerified(false); 
        setPassword('');
       
    };

    return (
        <div style={{ padding: '20px' }}>
            <div> 
            <div> 
                        <Button style={{position:'fixed',top:15,left:20}} onClick={()=>navigate(-1)}><TbArrowBackUp  style={{ fontSize: 30 }}/></Button>
                    </div>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12}>
                        <Typography variant="h5">Forgot Password</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            type="email"
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errorMessage !== ''}
                            helperText={errorMessage}
                        />
                    </Grid>
                    {verificationSent && !otpVerified && (
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                type="text"
                                label="OTP"
                                variant="outlined"
                                value={enteredOtp}
                                onChange={(e) => SetEnteredOtp(e.target.value)}
                            />
                        </Grid>
                    )} 
                    {verificationSent && otpVerified && (
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                type="password"
                                label="Password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        {verificationSent ? (
                            otpVerified ? (
                                <Button onClick={handlePasswordChange} variant="contained" color="primary">
                                    Change Password
                                </Button>
                            ) : (
                                <>
                                <Button onClick={handleOtpVerify} variant="contained" color="primary" style={{paddingRight:20,marginRight:20}}>
                                    Verify OTP
                                </Button> 
                                <Button onClick={handleEmailSubmit} variant="contained" color="secondary" disabled={!resendAllowed}>
                                    Resend Otp
                                </Button>
                                </>
                            )
                        ) : (
                            <Button onClick={handleEmailSubmit} variant="contained" color="primary">
                                Send Verification Code
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

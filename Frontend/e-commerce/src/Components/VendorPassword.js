import { useEffect, useState } from "react";
import { Container, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLocation } from "react-router-dom";

export const VendorPassword = () => {
    const info = sessionStorage.getItem("VToken");
    const ParsedVendor = JSON.parse(info);
    const id = ParsedVendor.id;
    const [vendor, setVendor] = useState({});
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [verified, setVerified] = useState(false);
    const location=useLocation();
    const token=location.state;

    useEffect(() => {
        const fetchVendor = async () => {
            const data = await fetch(`https://localhost:7199/api/Vendor/Get Vendor/${id}`,{
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            });
            const response = await data.json();
            setVendor(response);
        };
        fetchVendor();
    }, [id]);

    

   

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleVerifyPassword = () => {
        if (oldPassword === vendor.password) {
            setVerified(true);
        } else {
            alert("Incorrect old password");
        }
    };

    const handleChangePassword = async() => {

        const isValid=true;
        if(isValid)
        { 
          
            try {
                const send = await fetch(`https://localhost:7199/api/Vendor/ChangePassword/${id}?password=${newPassword}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                 
                });
                if (send.ok) {
                  console.log("Updated Successfully");
                  alert("Password changed successfully!");
                  setOldPassword('');
                  setNewPassword('');
                  setVerified(false);
                } else {
                  console.error("Failed to Change Password ");
                }
              } catch (error) {
                console.error("Error occurred during Passowrd Change:", error);
              }
        }
        // Logic to update the password
       
    };

    return (
        <Container style={{paddingTop:100}}>
           
            {!verified && ( <>
            <TextField
                label="Old Password"
                type={showPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e)=>setOldPassword(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            
                <Button variant="contained" color="primary" onClick={handleVerifyPassword}>
                    Verify
                </Button>
                </>
            )}
           
            {verified && (
                <>
                    <TextField
                        label="New Password"
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e)=>setNewPassword(e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {/* Submit Button */}
                    <Button variant="contained" color="primary" onClick={handleChangePassword} fullWidth>
                        Change Password
                    </Button>
                </>
            )}
        </Container>
    );
};

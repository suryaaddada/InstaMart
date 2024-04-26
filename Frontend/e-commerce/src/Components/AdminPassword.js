import { useEffect, useState } from "react";
import { Container, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useLocation } from "react-router-dom";

export const AdminPassword = () => {
    const info = sessionStorage.getItem("AToken");
    const ParsedUser = JSON.parse(info);
    const id = ParsedUser.id;
    const [user, setUser] = useState({});
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [verified, setVerified] = useState(false); 
    const location=useLocation();
    const token=location.state;

    const[flag,setFlag]=useState(false)
    const [open, setOpen] = useState(false);
    const vertical="",horizontal="";
   

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const data = await fetch(`https://localhost:7199/api/User/user/${id}`,{
                headers: {
                    
                    Authorization: `Bearer ${token}`,
                  }, 
            });
            const response = await data.json();
            setUser(response);
        };
        fetchUser();
    }, [id]);

    

   

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleVerifyPassword = () => {
        if (oldPassword === user.password) {
            setVerified(true);
        } else {
            setOpen(true)
            setFlag(false);
           
           
        }
    };

    const handleChangePassword = async() => {

        const isValid=true;
        if(isValid)
        { 
          
            try {
                const send = await fetch(`https://localhost:7199/api/Login/ChangePassword/${id}?password=${newPassword}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization:`Bearer ${token}`,
                  },
                 
                });
                if (send.ok) {
                  console.log("Updated Successfully");
                 // alert("Password changed successfully!");
                 setFlag(true);
                 setOpen(true)
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
       
       
    };

    return (
        <Container style={{paddingTop:90}}>  
        <Snackbar open={open} autoHideDuration={1000} onClose={handleClose} anchorOrigin={{ vertical:"top", horizontal:"center" }} key={vertical + horizontal} >
            <MuiAlert onClose={handleClose} severity= {flag?"success":"error"} sx={{ width: '100%' }}>
                {flag? "Password Changed Successfully": "Incorrect Old Password. Try again!"}
               
            </MuiAlert>
        </Snackbar>
           
            {!verified && ( <>
            <TextField
                label="Old Password"
                type={showPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e)=>setOldPassword(e.target.value)}
                variant="outlined"
                fullWidth required
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
                   
                    <Button variant="contained" color="primary" onClick={handleChangePassword} fullWidth>
                        Change Password
                    </Button>
                </>
            )}
        </Container>
    );
};

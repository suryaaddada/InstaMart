import React, { useEffect, useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBCheckbox
}
from 'mdb-react-ui-kit';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Typography ,Link} from '@mui/material';

export const Login=()=> {  
  
    
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const[errors,setErrors]=useState({}); 
  const navigate=useNavigate();
  const location=useLocation(); 

  useEffect(()=>{
    let timer=setTimeout(() => {
        setErrors({});
    }, 3000); 
    return ()=>clearTimeout(timer);
},[errors]) 

useEffect(() => {
    let timer;

    if (showErrorMessage) {
      timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    }

    const storedLoginStatus = sessionStorage.getItem("isLoggedIn");
    if (storedLoginStatus === "true") {
      setIsLoggedIn(true);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [showErrorMessage]);

  const handleReset=()=>{
    setEmail("");
    setPassword("")
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();

    var isvalid=await Validate();
    if(isvalid)
    {
      let data={email,password};


      try{

        const send=await fetch(`https://localhost:7199/api/Login/User Verification`,{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify(data),
        }); 

        if(send.ok)
        {
          const response=await send.json();
          console.log(response);
          if(response.role=="User")
          {
            sessionStorage.setItem("UToken",JSON.stringify(response));
            navigate(-1,{state:{response}});
          }else{
            sessionStorage.setItem("AToken",JSON.stringify(response));
            navigate("adminbar",{state:{response}});
          }
          setIsLoggedIn(true);
          sessionStorage.setItem("isLoggedIn", "true");
        }
        else
        {
          const send2=await fetch(`https://localhost:7199/api/Login/Vendor Verification`,{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify(data),
        }); 
        if(send2.status==200)
        {
          const response=await send2.json();
          console.log(response);
          setIsLoggedIn(true);
          sessionStorage.setItem("VToken",JSON.stringify(response));
          sessionStorage.setItem("isLoggedIn", "true"); 
          
          navigate("vendorbar",{state:{response}});
        }
        else{
          setError("Invalid email or password");
          setShowErrorMessage(true);
          console.log("Error while login with Vendor Data");
        }

        }
        

      }catch(error)
      {
        setError("Error occurred while logging in. Please try again later.");
        setShowErrorMessage(true);
        console.error("Exception occurs");
      }

    }

  }
  const Validate=async()=>{
    const errors={};

    if(!email.trim())
        {
            errors.email="Email can't be Empty";
            setErrors(errors);
            return false;
        }else if(!/\S+@\S+\.\S/.test(email))
        {
            errors.email="Email must be in Correct Format";
            setErrors(errors);
            return false;
        }  
        if(!password.trim())
        {
            errors.password="Password Can't be Empty";
            setErrors(errors);
            return false;
        }
        else if(!/^(?=.*[A-Z])(?=.*[@#&])(?=.*[a-z])(?=.*[\d]).+$/.test(password))
        {
            errors.password="Password must contains one Upper Case,Lower Case,Digits,Special Symbols(@#&)";
            setErrors(errors);
            return false;
        }
    
        
        return true;
  }
  return (
    <MDBContainer fluid  >

      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>
            {!isLoggedIn &&(

          <MDBCard className='bg-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '500px'}}>
            <MDBCardBody className='p-5 w-100 d-flex flex-column'>

              <h2 className="fw-bold mb-2 text-center">Sign in</h2>

              <form  onSubmit={handleSubmit}>

              {showErrorMessage && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
                <div className='form-group'>
                    <input type="email" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)}  placeholder="Enter an Email" required/>
                    {errors.email && <div className='text-danger'>{errors.email}</div>}
                </div>

                <div className='form-group'>
                    <input type="password" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)}  placeholder="Enter Password" required/>
                    {errors.password &&<div className="text-danger" >{errors.password}</div>}
                </div> 

                {/* <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                    <label className="form-check-label" for="flexCheckDefault">
                    Login as Vendor
                    </label>
                </div> */}

                <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>

              <input
                type="reset"
                className="btn btn-danger btn-block"
                value="Reset"
                onClick={handleReset}
              />

              
            </div>
              </form>

              
              <hr className="my-4" /> 
              <div style={{ textAlign: 'center' }}>
                <Typography variant="body1" gutterBottom>
                  Don't have an Account? <Link href="/register">Register</Link> here
                </Typography>
                <Typography variant="body1">
                  Forget Password? <Link href="/forgot">Reset</Link>
                </Typography>
              </div>

             

            </MDBCardBody>
          </MDBCard>
          )}

        </MDBCol>
      </MDBRow>
      <Outlet/>

    </MDBContainer>
  );
}

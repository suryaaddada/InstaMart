import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,MDBTabs, MDBTabsItem, MDBTabsLink
 
}
from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom'; 
import logo from "../logo.png"; 
import { Grid } from '@mui/material';

export const Signup = () => {  
  
  const navigate=useNavigate();
  const [activeTab, setActiveTab] = useState('user'); 

  const [successMessage, setSuccessMessage] = useState('');
  
  // User Form Fields
  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    mobile: '',
    role:'User'
  });
  
  // Vendor Form Fields
  const [vendorFormData, setVendorFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password:'',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isapproved:false,
    status:'Active',
    shopName:'',
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleVendorInputChange = (e) => {
    const { name, value } = e.target;
    setVendorFormData({ ...vendorFormData, [name]: value });
  };

  const handleUserSignup = async(e) => {
    e.preventDefault();
    const valid=await validateUserForm();
    if (valid) {
      try {
        const send = await fetch(`https://localhost:7199/api/User/Add User`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userFormData),
        });
        if (send.ok) {
          console.log("User Added Successfully");
          setSuccessMessage("User registered successfully");
          // Reset form after successful submission
          setUserFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            gender: '',
            mobile: '',
            role: 'User'
          });
          navigate("/");
        } else {
          console.error("Unable to add User");
        }
      } catch (error) {
        console.error("Error occurred during user signup:", error);
      }
    }
  };

  const handleVendorSignup = async(e) => {
    e.preventDefault(); 
    const valid=await validateVendorForm();
    if (valid) {
      try {
        const send = await fetch(`https://localhost:7199/api/Vendor/Add Vendor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vendorFormData),
        });
        if (send.ok) {
          console.log("Vendor Added Successfully"); 
          setSuccessMessage("Vendor registered successfully");
         
          setVendorFormData({
            name: '',
            mobile: '',
            email: '',
            password:'',
            address: '',
            city: '',
            state: '',
            pincode: '',
            isapproved:false,
            status:'Active',
            shopName:''
          }); 
          navigate("/");
        } else {
          console.error("Unable to add Vendor");
        }
      } catch (error) {
        console.error("Error occurred during vendor signup:", error);
      }
    }
  };

  const validateUserForm = async(e) => {
    
    const errors = {};
    let isValid = true;

    if (!userFormData.firstName.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(userFormData.firstName.trim())) {
      errors.firstName = "First name should contain only letters and spaces";
      isValid = false;
    }
  
    if (!userFormData.lastName.trim()) {
      errors.lastName = "Last name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(userFormData.lastName.trim())) {
      errors.lastName = "Last name should contain only letters and spaces";
      isValid = false;
    }

    if (!userFormData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(userFormData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }
    else {
      
      const emailExistsResponse = await fetch(`https://localhost:7199/api/Login/User_Email_Exists/${encodeURIComponent(userFormData.email)}`);
      const emailExists = await emailExistsResponse.json();
      if (emailExists) {
        errors.email = "Email already exists";
        isValid = false;
      }
    }


    if (!userFormData.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@*$])/.test(userFormData.password)) {
      errors.password = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one of the special characters '@', '$', or '*'";
      isValid = false;
    }
    
    

    if (!userFormData.gender.trim()) {
      errors.gender = "Gender is required";
      isValid = false;
    }

    if (!userFormData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(userFormData.mobile.trim())) {
      errors.mobile = "Mobile number should contain 10 digits";
      isValid = false;
    }

    setUserErrors(errors);
    return isValid;
  };

  const validateVendorForm = async(e) => {
    const errors = {};
    let isValid = true;

    if (!vendorFormData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(vendorFormData.name.trim())) {
      errors.name = "Name should contain only letters and spaces";
      isValid = false;
    }

    if (!vendorFormData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(vendorFormData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }
    else {
      
      const emailExistsResponse = await fetch(`https://localhost:7199/api/Login/Vendor_Email_Exists/${encodeURIComponent(vendorFormData.email)}`);
      const emailExists = await emailExistsResponse.json();
      if (emailExists) {
        errors.email = "Email already exists";
        isValid = false;
      }
    }

    if (!vendorFormData.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@*$])/.test(vendorFormData.password)) {
      errors.password = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one of the special characters '@', '$', or '*'";
      isValid = false;
    }

    if (!vendorFormData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(vendorFormData.mobile.trim())) {
      errors.mobile = "Mobile number should contain 10 digits";
      isValid = false;
    }


    if (!vendorFormData.shopName.trim()) {
      errors.shopName = "Shop Name is required";
      isValid = false;
    } 

    if (!vendorFormData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }

    if (!vendorFormData.city.trim()) {
      errors.city = "City is required";
      isValid = false;
    }

    if (!vendorFormData.state.trim()) {
      errors.state = "State is required";
      isValid = false;
    }

    if (!vendorFormData.pincode.trim()) {
      errors.pincode = "Pincode is required";
      isValid = false;
    } else if (!/^\d{6}$/.test(vendorFormData.pincode.trim())) {
      errors.pincode = "Pincode should contain 6 digits";
      isValid = false;
    }

    setVendorErrors(errors);
    return isValid;
  };

  const [userErrors, setUserErrors] = useState({});
  const [vendorErrors, setVendorErrors] = useState({});
  return (
    <MDBContainer fluid className='p-4' style={{ backgroundColor: 'hsl(0, 0%, 96%)' }}>
      <MDBRow>
      <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center position-relative'>
    <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ opacity: 1,textAlign:'center' }}>
        <span className="text-primary">
          
        </span>
    </h1>
    <div
        className="bg-image"
        style={{
            backgroundImage: `url(${logo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: '0.4',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }}
    ></div> 
    <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/><br/> <br/>
    <div className="content-overlay d-flex flex-column align-items-center justify-content-center">
        <h6 className="mb-4" style={{ color: 'black', opacity: 1 }}>
            Register now to access exclusive deals and offers on a wide range of products.
        </h6>
        <h6 className="mb-4" style={{ color: 'black', opacity: 1 }}>
            By registering with us, you'll be able to track your orders, save your shipping
            information for faster checkout, and receive personalized recommendations based on your preferences.
        </h6>
        <h6 className="mb-4" style={{ color: 'black', opacity: 1 }}>
            Don't miss out on the convenience and savings – register now!
        </h6>
    </div>
</MDBCol>



        <MDBCol md='6'>
          <MDBCard >
            <MDBCardBody className='p-0'>
            <div className="container  " style={{paddingTop:2}}>  
            <h6>SignUp Here As</h6>
    {/* {successMessage && <Popup message={successMessage} onClose={() => setSuccessMessage('')} />} */}
    <div className="row justify-content-center mb-3">
  <div className="col-auto">
    <button onClick={() => handleTabClick('user')} className={`btn btn-primary ${activeTab === 'user' ? 'active' : ''}`}>
      User
    </button>
  </div>
  <div className="col-auto">
    <button onClick={() => handleTabClick('vendor')} className={`btn btn-primary ${activeTab === 'vendor' ? 'active' : ''}`}>
      Vendor
    </button>
  </div>
</div>



      {activeTab === 'user' && (
        <div className="tab-content">
          <input className={`form-control mb-4 ${userErrors.firstName && 'is-invalid'}`} placeholder="First Name" type="text" name="firstName" value={userFormData.firstName} onChange={handleUserInputChange} />
          {userErrors.firstName && <div className="invalid-feedback">{userErrors.firstName}</div>}
          <input className={`form-control mb-4 ${userErrors.lastName && 'is-invalid'}`} placeholder="Last Name" type="text" name="lastName" value={userFormData.lastName} onChange={handleUserInputChange} />
          {userErrors.lastName && <div className="invalid-feedback">{userErrors.lastName}</div>}
          <input className={`form-control mb-4 ${userErrors.email && 'is-invalid'}`} placeholder="Email address" type="email" name="email" value={userFormData.email} onChange={handleUserInputChange} />
          {userErrors.email && <div className="invalid-feedback">{userErrors.email}</div>}
          <input className={`form-control mb-4 ${userErrors.password && 'is-invalid'}`} placeholder="Password" type="password" name="password" value={userFormData.password} onChange={handleUserInputChange} />
          {userErrors.password && <div className="invalid-feedback">{userErrors.password}</div>}
          <select className={`form-control mb-4 ${userErrors.gender && 'is-invalid'}`} name="gender" value={userFormData.gender} onChange={handleUserInputChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {userErrors.gender && <div className="invalid-feedback">{userErrors.gender}</div>}
          <input className={`form-control mb-4 ${userErrors.mobile && 'is-invalid'}`} placeholder="Mobile" type="text" name="mobile" value={userFormData.mobile} onChange={handleUserInputChange} />
          {userErrors.mobile && <div className="invalid-feedback">{userErrors.mobile}</div>} 


          <div className="row">
  <div className="col">
    <button className="btn btn-primary mb-4 w-50" onClick={handleUserSignup}>Sign up</button>
  </div>
  <div className="col d-flex align-items-center justify-content"> 
    <span style={{ fontWeight: 'bold' }}>Have an Account Already? 
    <a  href='/log'>Login</a> here  </span>
  </div>
</div>




        </div>
      )}

      {activeTab === 'vendor' && (
        <div className="tab-content">
          <input className={`form-control mb-4 ${vendorErrors.name && 'is-invalid'}`} placeholder="Name" type="text" name="name" value={vendorFormData.name} onChange={handleVendorInputChange} />
          {vendorErrors.name && <div className="invalid-feedback">{vendorErrors.name}</div>}
          <input className={`form-control mb-4 ${vendorErrors.email && 'is-invalid'}`} placeholder="Email" type="email" name="email" value={vendorFormData.email} onChange={handleVendorInputChange} />
          {vendorErrors.email && <div className="invalid-feedback">{vendorErrors.email}</div>}
          <input className={`form-control mb-4 ${vendorErrors.password && 'is-invalid'}`} placeholder="Password" type="password" name="password" value={vendorFormData.password} onChange={handleVendorInputChange} />
          {vendorErrors.password && <div className="invalid-feedback">{vendorErrors.password}</div>} 

          


          <div className="row mb-4">
            <div className="col">
            <input className={`form-control  ${vendorErrors.mobile && 'is-invalid'}`} placeholder="Mobile" type="text" name="mobile" value={vendorFormData.mobile} onChange={handleVendorInputChange} />
                    {vendorErrors.mobile && <div className="invalid-feedback">{vendorErrors.mobile}</div>}
            </div>
            <div className="col">
              <input className={`form-control ${vendorErrors.shopName && 'is-invalid'}`} placeholder="Shop Name" type="text" name="shopName" value={vendorFormData.shopName} onChange={handleVendorInputChange} />
              {vendorErrors.shopName && <div className="invalid-feedback">{vendorErrors.shopName}</div>}
            </div>
          </div>



          <input className={`form-control mb-4 ${vendorErrors.address && 'is-invalid'}`} placeholder="Address" type="text" name="address" value={vendorFormData.address} onChange={handleVendorInputChange} />
          {vendorErrors.address && <div className="invalid-feedback">{vendorErrors.address}</div>}


         <div className="row mb-4">
          <div className="col">
            <input className={`form-control ${vendorErrors.city && 'is-invalid'}`} placeholder="City" type="text" name="city" value={vendorFormData.city} onChange={handleVendorInputChange} />
            {vendorErrors.city && <div className="invalid-feedback">{vendorErrors.city}</div>}
          </div>
          <div className="col">
            <input className={`form-control ${vendorErrors.state && 'is-invalid'}`} placeholder="State" type="text" name="state" value={vendorFormData.state} onChange={handleVendorInputChange} />
            {vendorErrors.state && <div className="invalid-feedback">{vendorErrors.state}</div>}
          </div>
        </div>



          <input className={`form-control mb-4 ${vendorErrors.pincode && 'is-invalid'}`} placeholder="Pincode" type="text" name="pincode" value={vendorFormData.pincode} onChange={handleVendorInputChange} />
          {vendorErrors.pincode && <div className="invalid-feedback">{vendorErrors.pincode}</div>}
          <div className="row">
  <div className="col">
    <button className="btn btn-primary mb-4 w-50" onClick={handleVendorSignup}>Sign up</button>
  </div>
  <div className="col d-flex align-items-center justify-content"> 
    <span style={{ fontWeight: 'bold' }}>Have an Account Already? 
    <a  href='/log'>Login</a> here  </span>
  </div>
</div>
        </div>
      )}
    </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

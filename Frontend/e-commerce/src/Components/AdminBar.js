import React, { useEffect, useState } from "react";
import {  Outlet, useNavigate, useLocation } from "react-router-dom";
import logo from "../logo.png"; 


import {Stack} from "@mui/material";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import {Tooltip} from "@mui/material";

export const AdminBar= () => {
  const [user, setUser] = useState({}); 
  const [activeOption, setActiveOption] = useState('');
  const [token,setToken]=useState('');
 
 
  const navigate = useNavigate();
 
  
  

 useEffect(() => {
  const dataString = sessionStorage.getItem("AToken");
  if (dataString) {
      const data = JSON.parse(dataString); 
      setToken(data.token);
      fetch(`https://localhost:7199/api/User/user/${data.id}`, {
          method: "GET",
          headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${data.token}`,
          },
      })
      .then((response) => response.json())
      .then((json) => {
          setUser(json);
          
      })
      .catch((error) => {
          console.error("Error fetching data:", error);
      });
  }
}, []);


  const handleLogOut = (e) => {
    e.preventDefault();
    if (window.confirm("Do you want to logout?")) {
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("AToken");
      setTimeout(() => {
        sessionStorage.clear();
        navigate("/");
        window.location.reload();
      }, 0);
    }
  };

 

  return (
    <div>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger fixed-top ">
        <div className="container" >
          
        <button className="navbar-brand" onClick={() => navigate("")} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
          <span className="navbar-text d-flex align-items-center" style={{ height: '70px' }}>
            <img
              src={logo}
              alt="E-commerce"
              style={{ height: '80px', width: 'auto' }}
            />
          </span>
        </button>

          
          <div >
            <ul className="navbar-nav ms-auto"> 
              <li className="nav-item">
              <button
                            type="button" className="btn"  style={{  border: 'none',  outline: 'none',  background: 'none',  }}
                            onClick={() => {navigate('Admin',{state:token});setActiveOption('');}} >
                            <Stack direction="row" spacing={2}>
                                <Avatar sx={{ bgcolor: deepOrange[500] }}>{user.firstName && user.firstName.charAt(0)}</Avatar>
                            </Stack>
                        </button> 
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid p-0" >
        {/* Main Content */}
        <Outlet />
      </div>

      {/* Bottom Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-bottom">
            <div className="container">
                <div className="row justify-content-between align-items-center" style={{ width: '100%' }}>
                    <div className="col-auto"> 
                    <Tooltip title="Vendor" arrow  >
                        <button type="button" className="btn"
                            style={{  border: 'none', outline: 'none',  color: activeOption === 'vendor' ? '#ff0000' : 'black',  transition: 'background-color 0.3s'  }}
                            onClick={() => {   navigate('approvals',{state:{token}}); setActiveOption('vendor'); }}
                        >
                             Vendor
                        </button> 
                        </Tooltip>
                    </div>
                    <div className="col-auto"> 
                    <Tooltip title="Orders" arrow >
                        <button
                            type="button"
                            className="btn"
                            style={{
                                border: 'none',
                                outline: 'none',
                                color: activeOption === 'orders' ? '#ff0000' : 'black',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background-color 0.3s',
                            }}
                            
                            onClick={() => {
                                navigate('orders',{state:{token}});
                                setActiveOption('orders');
                            }}
                        >
                            Orders
                        </button> 
                        </Tooltip>
                    </div>
                    <div className="col-auto"> 
                    <Tooltip title="Products" arrow >
                        <button
                            type="button"
                            className="btn"
                            style={{
                                border: 'none',
                                outline: 'none',
                                color: activeOption === 'products' ? '#ff0000' : 'black',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background-color 0.3s',
                            }}
                            
                            onClick={() => {
                                navigate('product',{state:token});
                                setActiveOption('products');
                            }}
                        >
                            Products
                        </button> 
                        </Tooltip>
                    </div>
                    
                </div>
            </div>
        </nav>


    </div>
  );
};

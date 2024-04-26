import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {Stack, Tooltip} from "@mui/material";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import Home  from "@mui/icons-material/Home";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography'; 
import logo from "../logo.png";


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    backgroundColor: '#fff',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: '8px',
    textAlign: 'center',
  },
}));

export const VendorBar = () => { 
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [isApproved, setIsApproved] = useState(false); 
  
 
  const navigate = useNavigate();
  const location = useLocation(); 
  const [activeOption, setActiveOption] = useState('home');
  const [searchQuery, setSearchQuery] = useState(''); 
  const[token,SetToken]=useState('');

  const handleSearch = () => {
    console.log(searchQuery);
    navigate('search', { state: { searchQuery:searchQuery } }); 
    
    
    };
  
  

 useEffect(() => {
  const dataString = sessionStorage.getItem("VToken");
  if (dataString) {
      const data = JSON.parse(dataString); 
      SetToken(data.token);
      fetch(`https://localhost:7199/api/Vendor/Get Vendor/${data.id}`, {
          method: "GET",
          headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${data.token}`,
          },
      })
      .then((response) => response.json())
      .then((json) => {
          setUser(json);
          setIsApproved(json.isapproved); 
          console.log(json.status)
          
          
          
      })
      .catch((error) => {
          console.error("Error fetching data:", error);
      });
  }
}, []); 




  const handleLogOut = (e) => {
    e.preventDefault();
   
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("VToken");
      
      setTimeout(() => {
        sessionStorage.clear();
        navigate("/");
        window.location.reload();
      }, 0);
    
  }; 
  

 

  return (
    <div>  

      {(isApproved==false || user.status=="Inactive")   &&(
      <Modal
        className={classes.modal}
        open={true}
        BackdropComponent={Backdrop}
        BackdropProps={{
          invisible: true,
          style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          onClick: handleLogOut, 
        }}
      >
        <div className={classes.messageContainer}> 
          <Typography variant="h5" gutterBottom> 
          {isApproved==false ?"You are not approved yet.":"You're no longer an Vendor"} 
          </Typography>
        </div>
      </Modal>)
}
     
      {/* <nav className="navbar navbar-expand-lg navbar-dark bg-danger fixed-top">
        <div className="container">
          <span className="navbar-text text-white">
            Welcome {user.name}
          </span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto"> 
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleLogOut}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav> */} 
       <nav className="navbar navbar-expand-lg navbar-dark bg-danger fixed-top">
  <div className="container">
    <button className="navbar-brand" onClick={() => navigate("")} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
      <span className="navbar-text d-flex align-items-center" style={{ height: '70px' }}>
        <img
          src={logo}
          alt="E-commerce"
          style={{ height: '80px', width: 'auto' }}
        />
      </span>
    </button>

    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarNav" style={{ maxWidth: '1200px', paddingLeft: 50 }}>
      <div className="input-group" style={{ width: '100%', maxWidth: '900px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: '1', width: '500px' }} // Adjusted maxWidth here
        />
        <button
          className="btn btn-warning"
          type="button"
          onClick={handleSearch}
          style={{ minWidth: '90px' }} // Added minWidth for the button
        >
          Search
        </button>
      </div>
    </div>

    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <Tooltip title="Logout" arrow>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleLogOut}
            >
              Log out
            </button>
          </Tooltip>
        </li>
      </ul>
    </div>
  </div>
</nav>

     
      <div className="container-fluid p-0">
       
        <Outlet />
      </div>

     
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-bottom">
  <div className="container"> 
    <div className="row justify-content-between align-items-center" style={{ width: '100%' }}>
      <div className="col-auto"> 
      <Tooltip title ="Home" arrow>
        <button type="button" className="btn" style={{ border: 'none', outline: 'none', backgroundColor: 'transparent' ,color: activeOption === 'home' ? '#ff0000' : 'black',  transition: 'background-color 0.3s' }}   onClick={() => {navigate("");setActiveOption('home')}}>
          <Home sx={{ fontSize: 35 }} />
        </button>
        </Tooltip>
      </div>
      <div className="col-auto">
      <Tooltip title ="Add Product" arrow>
        <button type="button" className="btn" style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0 ,color: activeOption === 'Add' ? '#ff0000' : 'black',  transition: 'background-color 0.3s' }}  onClick={() =>{navigate("AddProduct",{state:token});setActiveOption("Add")}}>
          <AddCircleIcon sx={{ fontSize: 35 }} />
        </button>
        </Tooltip>
      </div>
      <div className="col-auto">
      <Tooltip title ="Profile" arrow>
        <button type="button" className="btn" style={{ border: 'none', outline: 'none', background: 'none' }} onClick={() => {navigate("vendor",{state:{uid:user.id,token}});setActiveOption('');}}>
          <Stack direction="row" spacing={2}>
            <Avatar sx={{ bgcolor: deepOrange[500] }}>{user.name && user.name.charAt(0)}</Avatar>
          </Stack>
        </button>
        </Tooltip>
      </div>
    </div>
  </div>
</nav>


    </div>
  );
};

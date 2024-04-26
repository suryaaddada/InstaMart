import React, { useEffect, useState } from "react";
import {  Outlet, useNavigate, Link } from "react-router-dom";
import logo from "../logo.png";


import {Stack, Tooltip} from "@mui/material";
import { Avatar,Badge } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import Home  from "@mui/icons-material/Home";

import FavoriteIcon from '@mui/icons-material/Favorite'; 


import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';  






export const UserBar = () => {
  const [user, setUser] = useState({});
 
 
  const navigate = useNavigate();
  

  const [searchQuery, setSearchQuery] = useState(''); 
  const [cartCount,setCartCount]=useState(0); 
  const [activeOption, setActiveOption] = useState('home'); 
  const [isLoggedIn,setIsLoggedIn]=useState(false);
  const[token,setToken]=useState("");

  const handleSearch = () => {
  console.log(searchQuery);
  navigate('search', { state: { searchQuery:searchQuery } }); 
  
  
  }; 

  
 

  useEffect(() => {
    const fetchData = async () => {
      const dataString = sessionStorage.getItem("UToken");
      if (dataString) {
        const data = JSON.parse(dataString);
        setToken(data.token); 
       
        try {
          
          const userResponse = await fetch(`https://localhost:7199/api/User/user/${data.id}`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${data.token}`,
            }, 
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData); 
           
          } else {
            throw new Error("Failed to fetch user data");
          }

          // Fetch cart items count
          // const cartResponse = await fetch(`https://localhost:7199/api/Product/Get Cart Items By User Id/${data.id}`);
          // if (cartResponse.ok) {
          //   const cartData = await cartResponse.json();
          //  setCartCount(cartData.length)
          //   sessionStorage.setItem("Count", cartData.length);
          // } else {
          //   throw new Error("Failed to fetch cart items");
          // } 
          Count();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, []);
 
 
const handlewishlist=async()=>{ 
let check = await logincheck(); 
console.log(check);
if(check)
  navigate('wishlist', { state: { id: user.id ,token:token} }) 
  else 
    navigate('/log');
   
} 

 const handlecart=async()=>{  
  let check = await logincheck();
  if(check)
  navigate("cart",{state:{id:user.id,token:token}})
  else 
    navigate('/log'); 
 }
const logincheck = async () => {
  try {
   
   const logstatus=sessionStorage.getItem('isLoggedIn');  
   const isLoggedIn = logstatus === "true"; 
   
   setIsLoggedIn(isLoggedIn);
  
   return isLoggedIn;
  } catch (error) {
   return false;
  }
}; 
const handleuser=async()=>{
  
  let check = await logincheck();
  if(check)
  navigate("User",{state:{uid:user.id,token:token}}) ;
  else 
    navigate('/log'); 
 
} 

useEffect(()=>{
 
  Count();
},[sessionStorage.getItem("Count")]) 

 const Count=async()=>{
  let check= await logincheck();
  if(check)
  {
    const request= await fetch(`https://localhost:7199/api/Product/Get Cart Items By User Id/${user.id}`,{
      headers: {
       
        Authorization: `Bearer ${token}`,
      }, 
    });
    if(request.ok) 
    {
      const response=await request.json(); 
      setCartCount(response.length); 
      sessionStorage.setItem("Count", response.length); 
    } 
    else 
    {
      setCartCount(0);
    }

  }
}  


  return (
    <div>
      {/* Top Navbar */}
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
          <Tooltip title="Wishlist" arrow>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handlewishlist}
            >
              <FavoriteIcon />
            </button>
          </Tooltip>
        </li> 
        <li className="nav-item" style={{position:'relative',top:9,left:6}}> 
        { !isLoggedIn &&
          <Link style={{paddingTop:0,color:'white',textDecoration:'none'}} to={'log'} > Login/Signup</Link>
        }
        </li>
      </ul>
    </div>
  </div>
</nav>



 
      {/* Main Content */}
      <div className="container-fluid p-0">
        {/* Main Content */}
        <Outlet />
      </div>
 
      {/* Bottom Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-bottom">
  <div className="container"> 
    <div className="row justify-content-between align-items-center" style={{ width: '100%' }}>
      <div className="col-auto"> 
      <Tooltip title="Home" arrow>
        <button type="button" className="btn" style={{ border: 'none', outline: 'none', backgroundColor: 'transparent' ,color: activeOption === 'home' ? '#ff0000' : 'black',  transition: 'background-color 0.3s' }} onClick={() =>{ navigate("");setActiveOption('home');}}>
          <Home sx={{ fontSize: 35 }} />
        </button>
        </Tooltip>
      </div>
      <div className="col-auto"> 
      <Tooltip title="Cart" arrow >
        <button type="button" className="btn" style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0 ,color: activeOption === 'cart' ? '#ff0000' : 'black',  transition: 'background-color 0.3s' }} onClick={()=>{handlecart();setActiveOption('cart')}}>
           <ShoppingCartOutlinedIcon sx={{ fontSize: 35 }} /> 
           <Badge badgeContent={cartCount} color="info" /> 
           
          
        </button> 
        </Tooltip>
      </div>
      <div className="col-auto"> 
      <Tooltip title="Profile" arrow>
        <button type="button" className="btn" style={{ border: 'none', outline: 'none', background: 'none' }} onClick={() =>{handleuser();setActiveOption("");}}>
          <Stack direction="row" spacing={2}>
            <Avatar sx={{ bgcolor: deepOrange[500] }}>{user.firstName && user.firstName.charAt(0)}</Avatar>
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

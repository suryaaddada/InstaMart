import React, { useEffect, useState } from "react";
import {  useLocation, useNavigate } from "react-router-dom";
import { Typography, Button, Badge, Grid } from "@mui/material";
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert'; 


const ProductDetails = ({ productDetails, onSizeSelect, setSelectedDetail, selectedSize }) => { 

  useEffect(()=>{
    onSizeSelect(productDetails[0].productSize);
    setSelectedDetail(productDetails[0]);

  },[])
  
  

  const handleSizeSelect = (size, detail) => {
    onSizeSelect(size);
    setSelectedDetail(detail); 
  };
  
  return (
    <Grid container spacing={2} style={{ textAlign: 'center' }}>
    {productDetails.map((detail) => (
      <Grid item key={detail.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Button
          variant={selectedSize === detail.productSize ? "contained" : "outlined"}
          color={detail.stock < 30 ? "error" : "primary"}
          onClick={() => handleSizeSelect(detail.productSize, detail)}
          style={{width: 50,height: 50,borderRadius: 10,marginRight: 10 }}  
          disabled={detail.stock === 0}>
          <Typography variant="body1" style={{ marginTop: 10 }}>
            {detail.productSize}
          </Typography>
        </Button>
        <Badge
          color={detail.stock < 30 ?( detail.stock==0?"info":'error' ): ""}
          badgeContent={detail.stock < 30 ? (detail.stock === 0 ? "Not Available" : "Few left") : ""}
          style={{ marginTop: 5 }}

        />
      </Grid>
    ))}
  </Grid>
  
  );
};

export const ViewProduct = ({handleCart}) => {
  const location = useLocation();
  const [product, setProduct] = useState({});
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null); 
  const[wishlist,setWishlist]=useState([]);    
  let uid=0;


  const navigate=useNavigate();



    const[message,setMessage]=useState("")
    const [open, setOpen] = useState(false);
    const vertical="",horizontal="";

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }
      setOpen(false);
  };

  var {  pid,token } = location.state;   

  useEffect(()=>{

    const fetchUser=()=>{  
        if(sessionStorage.getItem("isLoggedIn")=="true")
        {
        const userString = sessionStorage.getItem("UToken");
        const parsedUser = JSON.parse(userString);
        uid = parsedUser.id; 
        token=parsedUser.token;
        } 
        else{
            uid=0;
        }

    };
    fetchUser();
})

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://localhost:7199/api/Product/Get Grouped Product/${pid}`
        );

        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [uid, pid]); 

  useEffect(()=>{
    const fetchwishlist=async()=>{
      const data=await fetch(`https://localhost:7199/api/Product/Get Wishlist By userId/${uid}`,{
        headers: {
                    
          Authorization: `Bearer ${token}`,
        }, 
      });
      if(data)
      { 
       
          const response=await data.json();
          setWishlist(response);
          console.log(response);
      }
  } 
  const fetchData = async () => {
    if (await logcheck()) {
      fetchwishlist();
    }
  };

  fetchData();
  },[])

  const handleSizeSelect = (size) => {
    const selectedDetail = product.productDetails.find(detail => detail.productSize === size);
    setQuantity(1);
    setSelectedPrice(selectedDetail.price);
    setSelectedSize(size);
  };

  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantity = () => {
    if (quantity < 5) {
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleAddToCart = async() => {
   // console.log(`Added ${quantity} ${product.brandName} (${selectedSize}) to cart with ID: ${selectedDetail.id}`);  
   const logstatus=await logcheck();
   if(logstatus) 
   { 
  
      try{ 
        let data={userId:uid,productId:pid,quantity,inventoryId:selectedDetail.id}; 
        console.log(data);
        const send=await fetch('https://localhost:7199/api/Product/Add Cart',{
          method:'POST',
              headers: {
                  'Content-Type': 'application/json', 
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
        });
        if(send.ok)
        { 
          const response=await send.json(); 
          if(response.msg=="Already in Cart")
          {
            console.log("response")
            const update=await fetch(`https://localhost:7199/api/Product/Update Cart/${response.id}`,{
              method:'PUT',
              headers: {
                  'Content-Type': 'application/json', 
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }) 
            setOpen(true);
            setMessage("Cart Updated"); 
            console.log(response)
          }
          else{ 
          
          
            setOpen(true);
            setMessage("Product added to the Cart"); 
            var count = parseInt(sessionStorage.getItem("Count"));
            sessionStorage.setItem("Count",count+1);
          }
        
          
        }
        else{ 
          
          console.log("Error in adding cart")
        }
      }catch(error)
      {
        console.error("Exception occurred in adding cart")
      } 
    } 
    else 
    navigate('/log')
  };

  const handleBuyNow = async() => {  
    let logstatus=await logcheck();    
    if(logstatus)
    {
      const modified={...product};
      
      delete modified.productDetails; 
      modified.quantity=quantity;
      modified.price=selectedPrice;
      modified.productSize=selectedSize;
      const jsontoArray=[modified]; 
      modified.iid=selectedDetail.id;
      console.log(jsontoArray);

      navigate("../buy",{state:{data:jsontoArray,token:token}});
    }else 
    navigate('/log')
  }; 

  const handleWishlist=async(pid)=>{ 
    const logstatus=await logcheck();
    if(logstatus) 
    {
      const check=wishlist.includes(pid);
      if(!check)
      { 
          let data={userId:uid,productId:pid}
          const add=await fetch(`https://localhost:7199/api/Product/Add Wishlist`,{
              method:'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
          }) 
          if(add.ok)
          { 
            
              console.log("Added to wishlist"); 
              setWishlist(prev => [...prev, pid]);
          }
      }
      else
      {
          const data=await fetch(`https://localhost:7199/api/Product/Deleted from Wishlist/${uid}%2C${pid}?uid=${uid}&pid=${pid}`,
          {
              method:'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
          });
          if(data.ok)
          {
              console.log("Deleted Successfully");
              setWishlist(prev => prev.filter(item => item !== pid));

          }
      } 
    }else 
    navigate('/log');
} 

const logcheck=async()=>{
  const logstatus=(sessionStorage.getItem('isLoggedIn')=="true");   
  return logstatus;
}

  return (
    <div style={{ padding: 90 }}> 
    <Snackbar open={open} autoHideDuration={1000} onClose={handleClose} anchorOrigin={{ vertical:"top", horizontal:"center" }} key={vertical + horizontal} >
            <MuiAlert onClose={handleClose} severity= "success" sx={{ width: '100%' }}>
                {message}
               
            </MuiAlert>
        </Snackbar>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <div>
            <img src={product.image} alt={product.brandName} style={{ maxWidth: '200%', maxHeight: '400px', width: '80%', height: '100%' }} />
          </div>
          <div> 
          <Typography>Available Sizes</Typography>
            {Array.isArray(product.productDetails) && product.productDetails.length > 0 ? (
              <ProductDetails 
                productDetails={product.productDetails} 
                onSizeSelect={handleSizeSelect} 
                setSelectedDetail={setSelectedDetail} 
                selectedSize={selectedSize} // Pass selectedSize as a prop
              />
            ) : (
                <Typography variant="body1">Product details not available</Typography>
              )}
          </div>
        </Grid> 
        <Grid item xs={6} >  
        <Button onClick={() => handleWishlist(product.id)} style={{ right:10 ,top:90,position:'absolute',minWidth:'auto'}}>
                             {wishlist.includes(product.id) ? (
                               <FavoriteIcon style={{ color: 'red' }} /> 
                             ) : (
                               <FavoriteBorder style={{ color: 'black' }} /> 
                             )}
        </Button>
          <div style={{paddingTop:100}}>
          <Typography variant="h4">{product.brandName}</Typography>
            <Typography variant="body1">{product.description}</Typography>
            <Typography variant="body1">Color: {product.color}</Typography>
            
            {selectedPrice && <Typography variant="body1">Price: ${selectedPrice}</Typography>}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #000", padding: "5px", borderRadius: 50, marginBottom: 10 }}>
              <Button onClick={handleDecreaseQuantity}>-</Button>
              <Typography variant="body1" style={{ margin: "0 10px" }}>{quantity}</Typography>
              <Button onClick={handleIncreaseQuantity}>+</Button>
            </div> 
            {selectedPrice && <Typography variant="body1">Total Price: ${selectedPrice*quantity}</Typography>}
            <div style={{ paddingTop: 50 }}> 
            {product.status!="Active" && <p>Currently Not Available To Buy.</p>}
                <Button onClick={handleAddToCart} color="warning" variant="contained" style={{ marginRight: '90px',borderRadius:50 }} disabled={product.status!="Active"}>Add To Cart</Button>
                <Button onClick={handleBuyNow} color="primary" variant="contained" style={{borderRadius:50 }} disabled={product.status!="Active"}>Buy Now</Button>
            </div>

          </div>
        </Grid>
      </Grid>
    </div>
  );
};

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Grid, Button, IconButton, Checkbox,Badge } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Select, MenuItem } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export const Cart = () => {
    const location = useLocation();
    const { id,token } = location.state;
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    const [checkedItems, setCheckedItems] = useState({});  
    const[checkedData,setCheckedData]=useState([]); 

    const[inventory,setInventory]=useState([]); 
    const [showSizesForProductId, setShowSizesForProductId] = useState(null);
    const[showSize,setShowSize]=useState(false);
   

    useEffect(() => {
        fetchCartItems();
       
    }, [id]); 

  
    const handleQuantityChange = async(itemId, quantity,e,iid,cid) => {
        
        const data={userId:id,productId:itemId,quantity,inventoryId:iid} 
       
        const send=await fetch(`https://localhost:7199/api/Product/Update Cart/${cid}`,{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json', 
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        })

        
        const updatedCart = cart.map((item) => {
            if (item.id === itemId) {
                return { ...item, quantity };
            }
            return item;
        });
        setCart(updatedCart); 
        setCheckedData(updatedCart);
    };
    

    const fetchCartItems = async () => {
        try {
            const response = await fetch(`https://localhost:7199/api/Product/Get Cart Items By User Id/${id}`,{
                headers: {
                    
                    Authorization: `Bearer ${token}`,
                  }, 
            });
            if (response.ok) {
                const data = await response.json();
                setCart(data);

                const initialCheckedState = {};
                data.forEach((item) => {
                    initialCheckedState[item.id] = true;
                });
                setCheckedItems(initialCheckedState);
                setCheckedData(data)
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    }; 

    const fetchInventory = async (pid) => {
        try {
            const response = await fetch(`https://localhost:7199/api/Product/Get Inventory Details by ProductId/${pid}`,{
                headers: {
                    
                   // Authorization: `Bearer ${token}`,
                  }, 
            });
            if (response.ok) {
                const data = await response.json();
                setInventory(data);
                console.log(data)

            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    const handleCheckboxChange = async (itemId, e,item) => {
        e.stopPropagation(); 
       
        setCheckedItems((prevState) => ({
            ...prevState,
            [itemId]: !prevState[itemId],
        }));   

        if (!checkedItems[itemId]) {
           
            setCheckedData((prev) => [...prev, item]);
        } else {
            
            setCheckedData((prev) => prev.filter((checkedItem) => checkedItem.id !== itemId));
        }
       
       
    };

    const handleDelete = async (cartid, e) => {
        e.stopPropagation();

        const data = await fetch(`https://localhost:7199/api/Product/Delete Cart by cartid/${cartid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (data.ok) {
            console.log("Deleted cart Successfully"); 
            var count = parseInt(sessionStorage.getItem("Count"));
            sessionStorage.setItem("Count",count-1);
            
            if (cart.length !== 1)
             fetchCartItems();
            else 
            setCart([]); 
          
        }
        console.log("Clicked", cartid);
    };  
   const handleButtonClick=async(pid)=>{  
    
    navigate("../view", { state: { uid: id, pid: pid,token:token } })

   } 
   const handleBuy=async()=>{
    if(checkedData.length!=0) 
    {

        navigate("../buy",{state:{data:checkedData,token:token}}); 
    }
    
    else
    window.alert("Select atleast one item");
   } 


   const handleSizeChange = async (selectedItem,pid,cid,quantity) => {
     
    const updatedCart = cart.map((cartItem) => {
        if (cartItem.id === pid) {
            return { ...cartItem, productSize:selectedItem.productSize,iid:selectedItem.id,price:selectedItem.price };
        } 
        
        return cartItem;
    }); 
    setCheckedData(updatedCart);
   
    await Promise.resolve(setCart(updatedCart)); 

    const data={userId:id,productId:pid,quantity,inventoryId:selectedItem.id} 
   
       
    const send=await fetch(`https://localhost:7199/api/Product/Update Cart/${cid}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    })
   
};



    return (
        <div style={{ padding: 90 }}>
            {cart.length === 0 ? (
                <Typography variant="h5" style={{ position: "absolute", top: "50%", left: "40%" }}>
                    No Products in Cart
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {cart.map((item) => (
                        <Grid item xs={12} key={item.id}>
                            <Button
                                 onClick={() =>handleButtonClick(item.id) }
                               
                                fullWidth
                                style={{ textAlign: "left" }}
                            >
                                <Card style={{ width: "100%" }}>
                                    <CardContent>
                                        <Grid container alignItems="flex-start">
                                            <Grid item>
                                                <Checkbox
                                                    checked={checkedItems[item.id] || false}
                                                    
                                                    onClick={(e)=>handleCheckboxChange(item.id,e,item)}
                                                    style={{ paddingTop: 0 }}/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={3}>
                                                        <img
                                                            src={item.image}
                                                            alt={item.brandName}
                                                            style={{
                                                                maxWidth: "100%",
                                                                maxHeight: "200px",
                                                                width: "auto",
                                                                height: "auto",
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={9}>
                                                        <CardContent>
                                                            <Typography variant="h5" component="div">
                                                                {item.brandName}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {item.description}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {item.color}
                                                            </Typography>
                                                           
                                                            <Typography variant="body2">
                                                                Quantity:
                                                                <Select
                                                                    value={item.quantity}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    onChange={(e) => handleQuantityChange(item.id, e.target.value,e,item.iid,item.cid)} 
                                                                
                                                                    style={{ marginLeft: "8px",lineHeight:'1',height:'25px',border:"none",outline:'none',appearance:'none',backgroundColor:'transparent' }}
                                                                >
                                                                    {[...Array(5)].map((_, index) => (
                                                                        <MenuItem key={index + 1} value={index + 1}>
                                                                            {index + 1}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                Variant: {item.productSize}
                                                                <Button
                                                                    variant="outlined"
                                                                    onClick={(e) => {e.stopPropagation();setShowSizesForProductId(item.id);fetchInventory(item.id);setShowSize(!showSize)}}
                                                                    style={{ marginLeft: 0 ,border:'none',color:'black'}}
                                                                > 
                                                                {!showSize ?<ExpandMoreIcon style={{left:'0'}}/>:<ExpandLessIcon style={{left:'0'}} /> }
                                                                    
                                                                </Button> 
                                                                {showSize && (
                                                                    <>
                                                                {showSizesForProductId === item.id && (
                                                                    <div style={{ display: 'flex', marginTop: 8 }}>
                                                                        {inventory.length > 0 ? (
                                                                            inventory.map((detail) => (
                                                                                <div key={detail.id}>
                                                                                    {detail.stock > 0 && (
                                                                                        <Button
                                                                                        variant="outlined"
                                                                                        color={detail.stock < 30 ? "error" : "primary"}
                                                                                        onClick={(e) => {e.stopPropagation();handleSizeChange(detail, item.id,item.cid,item.quantity)}}
                                                                                        style={{ width: 120, height: 40, borderRadius: 60, marginRight: 10, flexDirection: 'column', display: 'flex' }} >
                                                                                        <Typography variant="body1" >
                                                                                            {detail.productSize}
                                                                                        </Typography>
                                                                                        <Typography variant="body1" >
                                                                                            {detail.price}
                                                                                        </Typography>
                                                                                    </Button>
                                                                                    
                                                                                    )}

                                                                                
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <MenuItem value="">
                                                                                Loading...
                                                                            </MenuItem>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                </>)}
                                                            </Typography>

                                                            <Typography variant="body2">
                                                                Unit Price: {item.price}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                Total Price: {item.quantity * item.price}
                                                            </Typography>
                                                            <IconButton
                                                                aria-label="delete"
                                                                color="error"
                                                                style={{ marginLeft: "auto" }}
                                                                onClick={(e) => handleDelete(item.cid, e)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </CardContent>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Button>
                        </Grid>
                    ))} 
                  
                  <Grid container justifyContent="center">
    <Button onClick={handleBuy}>Proceed to buy</Button>
</Grid>
               

                </Grid>
            )} 
           
        </div>
    );
};

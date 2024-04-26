import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Grid, Button, IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';

export const Wishlist = () => {
    const location = useLocation();
    const { id,token } = location.state;
    const [wishlistItems, setWishlistItems] = useState([]); 
    const navigate=useNavigate();
    
    useEffect(() => {
        fetchWishlistItems();
    }, [id]);  

    const fetchWishlistItems = async () => {
        try {
            const response = await fetch(`https://localhost:7199/api/Product/Get Wishlisted Products By Userid/${id}`,{
                headers: {
                    
                    Authorization: `Bearer ${token}`,
                  }, 
            });
            if (response.ok) {
                const data = await response.json();
                setWishlistItems(data);
            } else {
                console.error("Error in fetching products from wishlist");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCardClick = (productId) => { 
        navigate('../view',{state:{uid:id,pid:productId,token:token}});
        console.log(productId);
    }; 

    const handleWishlist = async (productId, e) => {
        e.stopPropagation(); 
        const data = await fetch(`https://localhost:7199/api/Product/Deleted from Wishlist/${id}%2C${productId}?uid=${id}&pid=${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (data.ok) {
            console.log("Deleted Successfully");  
            if(wishlistItems.length!=1)
            fetchWishlistItems(); 
            else
            setWishlistItems([]);
        }
    };

    return (
        <div style={{ padding: 80 }}>
            <Grid container spacing={3}> 
                {wishlistItems.length === 0 ?  
                    <Typography variant="h5" style={{ position: 'absolute', top: "50%", left: "40%" }}>No Products in wishlist</Typography> 
                    : wishlistItems.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Button onClick={() => handleCardClick(item.id)} style={{ width: '100%' }}>
                                <Card>
                                    <IconButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={(e) => handleWishlist(item.id, e)}>
                                        <FavoriteIcon  style={{ color: 'red' }}/> 
                                    </IconButton>
                                    <CardMedia
                                        component="img"
                                        src={item.image}
                                        alt={item.brandName} 
                                        style={{ maxWidth: '100%', maxHeight: '200px', width: 'auto', height: 'auto' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {item.brandName}
                                        </Typography>
                                        {/* <Typography variant="body2" color="textSecondary">
                                            {item.description}
                                        </Typography> */} 
                                        <Grid item style={{ display: 'flex', alignItems: 'center', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        <Typography variant="body1" style={{ color: 'black' }}>{item.description}</Typography>
                                        </Grid>
                                        <Typography variant="body2" color="textSecondary">
                                            {item.color}
                                        </Typography>
                                        <Typography variant="body2">
                                            ${item.price}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Button>
                        </Grid>
                    ))
                }
            </Grid>
        </div>
    );
};

import { Recommendations } from "./Recommendations";
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Recommendations.css'; // Import custom CSS file for styling
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar'; 
import { Card, CardContent, Grid, Typography } from '@mui/material';

export const DisplayProducts = () => {
    const [products, setProducts] = useState([]);
    const [recommendedBrandProducts, setRecommendedBrandProducts] = useState([]);
    const brandSliderRef = React.useRef(null); 
    const navigate = useNavigate(); 
    let uid=0;

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        centerMode: true,
        centerPadding: '60px',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '20px'
                }
            }
        ]
    }; 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const request = await fetch(`https://localhost:7199/api/Product/GetAllProducts`);
                if (request.ok) {
                    const response = await request.json(); 
                    const uniqueBrandNames = Array.from(new Set(response.map((x) => x.brandName)));
                    setRecommendedBrandProducts(uniqueBrandNames); 
                    
                    
                    const randomProducts = getRandomSubset(response, 20); 
                    setProducts(randomProducts);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);
    
    // Function to get a random subset of products
    const getRandomSubset = (array, size) => {
        const shuffledArray = array.slice().sort(() => 0.5 - Math.random());
        return shuffledArray.slice(0, size);
    };
    

    const handleBrandClick = (brandName) => {
        navigate(`brand`,{state:{uid,brand:brandName}});
    }; 
    const handleBrandPrevClick = () => {
      brandSliderRef.current.slickPrev();
    };
  
    const handleBrandNextClick = () => {
      brandSliderRef.current.slickNext();
    };

    const handleProductClick = (productId) => {
        console.log("Clicked product ID:", productId);
        navigate(`view`,{state:{uid,pid:productId}})
    }; 
    const logstatus =() => { 

        const logcheck= sessionStorage.getItem('isLoggedIn') === "true"; 
        if(logcheck) 
        {
            const userString = sessionStorage.getItem("UToken");
            const parsedUser = JSON.parse(userString);
            uid = parsedUser.id; 
            return true;
        }
        else 
        return false;
    }
    

    return ( 
        <>
            {logstatus() && 
            
            <Recommendations />  
            }

            <h6 style={{textAlign:'left',paddingLeft:30}}>Pick up Your Favourite Brand</h6>
            <div className="slider-container" style={{ paddingBottom: 70 }}>
                <Slider ref={brandSliderRef} {...sliderSettings}>
                    {recommendedBrandProducts.map(brandName => (
                        <div key={brandName}>
                            
                                <Avatar
                                    sx={{ width: 100, height: 100, backgroundColor: '#ccc', cursor: 'pointer', margin: '0 auto' }}
                                    onClick={() => handleBrandClick(brandName)}
                                >
                                    {brandName}
                                </Avatar>
                           
                        </div>
                    ))}
                </Slider>
                <div className="navigation-buttons">
                    <button onClick={handleBrandPrevClick}>&#10094;</button>
                    <button onClick={handleBrandNextClick}>&#10095;</button>
                </div> 
            </div> 
            <h2>Featured Products</h2>
            <div className="product-cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px',paddingBottom:50}}>
    {products.map((product, index) => (
        <div key={index} className="product-card">
            <Card onClick={() => handleProductClick(product.id)}>
                <Grid item>
                    <img src={product.image} alt={product.description} style={{ maxWidth: '100%', maxHeight: '200px', width: 'auto', height: 'auto' }} />
                </Grid>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {product.brandName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.description}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    ))}
</div>

        </>
    );
};

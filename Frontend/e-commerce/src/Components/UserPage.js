import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';

import {CgArrowLeft}  from "react-icons/cg"
import Button from '@mui/material/Button';
import ArrowBack from '@mui/icons-material/ArrowBack';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useLocation, useNavigate } from "react-router-dom";
import { DisplayProducts } from "./DisplayProducts";

export const UserPage = () => { 
    let id=0;
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [subCategories, setSubCategories] = useState([]);  
    const[wishlist,setWishlist]=useState([]); 
    const [token,SetToken]=useState("");

    const location=useLocation();
    const navigate=useNavigate();

    const images = [
        { name: 'Men', imageUrl: 'data:image/png;base64,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' },
        {name:'Women',imageUrl:'data:image/jpeg;base64,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'},
        {name:'Kids',imageUrl:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsJCQcJCQcJCQkJCwkJCQkJCQsJCwsMCwsLDA0QDBEODQ4MEhkSJRodJR0ZHxwpKRYlNzU2GioyPi0pMBk7IRP/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAC0AK4DASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAQFAQMGBwL/xAA/EAACAgEBBQUFBAcHBQAAAAABAgADEQQFEiExUQYTQWFxIoGRocEUMlJyIyQzQpKx0RVDU2JjsvAWZILC4f/EABoBAQADAQEBAAAAAAAAAAAAAAABAgUDBAb/xAAjEQADAAIBBQEAAwEAAAAAAAAAAQIDETEEEhMhQWEUMlFS/9oADAMBAAIRAxEAPwD1uIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCJov1mi02e/1NFR54ssUN7l5/KQLO0OxU5ah3P+nVYfmQBKVkmeWXnHVcItolGe0+yR+5qz6Vp9Xgdp9kn9zVj1rT6PKefH/pfwZP+S8iVKdodivzvsT89Nn/AKgybRr9n6nAo1VDseShxv8A8J9r5S85IrhlHjueUSYlVtnaNmzV0NqANvXlbazj26ghLYPUcMf/AGWVViW11W1nKWotiHqrDIMlWm3P1EOWkq+M+4iJYqIiIAiIgCIiAIiIAiDOS2xt17i+l0LlaRlbblOGt6qhHJfPx9PvcsuWca2zrixVlepLbaG3tDoi1df6xqFJBStgEQ9Hfl7hn3TmdVtrauryGvNVZ/u9PmsYPgSPaPxkKupn48l6/wBJJWtE5D3nnMy82TJ+I04w48X6yKKrW47p48yeGfjxmWpdVLErw8OMlzDDeVl6gice1HXveyDEkJQOb/AfUzcFVeQA9JVSWeRfCFut0PwMwfPn5yfBAPMA+uDJ7CPIRLL9RalSW22OlO8KldiwQNjIXPoJbaPaW2dQuztmaArUa6lqa3dDndXnY5YEBQMYAHv48KixN12AHA8RjoZ9V2anS2V21O9Vg4oynBHkfqJM25e9iomlrS/D0Wiuyqquuy57nVcNbYFDOepCAD5TZKXZO3Ktbu6fUbterxwxwS7HinQ9R8PK6m3Fzc7kxLiorVCIiXKCIiAIiIAiJ8W2JTVdc5wlVb2Of8qgsYBz/aPaRqX7BSxD2rvallPFazyr4fi8fL805ipN9uP3Rz/pGovs1N9+osPt3OXbyzyA8hyHpPpbFrrAAyzHe8h4cZiZMnkt0+Dcx4/FClckkYHAcvKJE76zIyxxkcBjElnAyfCVT2RUtCJFsuZsheC+XMzV458ZDouseyfGQOc0i4CsMeLcRjqR4yOzMxJY5MOiqjZOiQ0tdPNeh+k+rbd/AXO7jj1J847kT2PZKyDyx7phlVwVPL5j0kJWZDlTj+R9ZMRg6hh48x0MlPZFS59kQhkfgSGRgQVOCCOIIInbbE2n/aGnK2kfaqN1bfDfU/dsA8/Hz9ZxVpBsf1x8OEl7J1R0e0NJZnCO4ou6GuwhePocH3S+DJ47/GVz4vJH6j0CIibRiiIiAIiIAlR2iu7rZlyjnfZVQPQnfPyBlvOd7VMRptEng2oZj/41kfWcc71jbO2BbySjk4iJhm6Jta0tWq+PJvQcpqiNhrYiIgCJ9V122nFVbufHcBIHqeUmV7L1b/tClY8zvt8F4fOCG0iDNlNN17FakLYzvEfdXhnieUtqtl6RMGwvaejHdX+Ff6ycqoihUVVUclUAAegEnRR5F8OXmyuworgDJOMdAesmbQ0bVu99a5rclnA/cY8zjoZXyOC/qkJg5w2OBwcHoZmIJPSdNb32n0t3+LRVZ/GgabZC2Sc7L2Wf+z0/+wCTZ9BL3KZ89S1TQiIlioiIgCc72qH6toW6ah1+NZP0nRSk7TIW2crAfs9VU59CGT6zjnW8dHfp3rJJxkyqu7KiDed2CqB4kzEttl6bCnUuPafK1eSci3v/AOc5hm3T0tmW2Yo0u4uDqAQ+/wDibGNweXSVBBBIIIIOCDzBHgZ1MhazQpqM2V4W7xJ+6/k3n5ydHKb/ANKOWGz9HXfvXWjeRW3ETjhmABJbykKyq2piliFW6Ec/MHlLPZVy7ltJPtBu8UdVIAOPT6yEdKfr0WSqqgKoCqOQUAAegEzESx5xERAHP4YlTrdAFDXUD2RkvWPAfiX6iW0QWTaOWiS9fpxRdlRiu0F0HgDniv8AzrITZ3XwOO6cfCVPQnv2eibKUrs3ZanmNHpvmgMmTXp6+6o09f8Ah01J/CoE2T6CVqUj56nttiIiWKiIiAJA2xUbtmbQQcxSbR61EWfST5qvtpqrZreKHK7uMlsjG6BK3py0y0tqk0ec1Vm62qpedjBc9BzJ+GZ0qqqKqqMKoCqOgHACV2k0fcau7LBhXUChxjHeMQM58QB85ZcfADPhnlnzxMBG3dbNGp1ek0gB1FoUsMqigtYw6hR4eZxKyztBQDirS2N52WKvyUH+czq6dhbOU63bOpVnuc4fUsxNzjiVp09XEgehx1kOnb3YbUWCkNRXkgK2q0ZpqJP+oRge/E6qKa2kcncp6bLjTairXIq20rk1raUPtKAceJHmJn+ztGGDoLK2B3ga7GGD5ZzJNVNFSqKkRV3VC7mMFMcMEeHSfc5lt64A4AePmeZmZiZggxKzV7VGm+7TvgWGtt5yhBAPQHoZZyLrE2VVS+p2gNLXRW2Wt1OAgcjkM82PgACZKG0uSFVt7RuQLabav8wK2r78YPyMtKrabkWyp1etuTIcj09ZzX/UHYOxjUSgXOO8bQWpX67yrvD4S50ek0lZr1Wz797S6hAxVLO9ouQ53XrbOcj1PiPS1RU/2WiFU1wbNoU97pnIHtVfpV64HBh8P5Sn0lX2jV6Kj/F1NKH8u8C3yBnR4B4EZBGCOoPhIWyNMmn1/wBpub9HpbL6lAXJ3ioUOfLBMrKTpJnTu1DOyiYBDAEcQQCCORBmZvmGIiIAiIgCVu1A/wCrn9wb4PkxxjMsp82IlisjqGVuBBnPLHfDkvjrspUc2AAWYc23c+4YEzJur0S6dBYjsVLhSrD7uQfGQpjXDh6ZqRatbRD2v2e2Hrdn6rV61tX9p1a6eqvUUJ3tmnWtia6KgUKJUW9q0ndBySzADK+MsrIzI2N5SVbdZWG8Dg4ZSQR757frmOo2ZtDZ1j31UavT3VHUaUO12nLjIcontMn4gOOCeYJ3fKj2U7VNb3Wl2cdYjOUr1Ogv09ujfBxvd9vjA/MAR0mv09zULRnZZc09nVdj6O1Om0Vd2r0zHYV9Fd+jse1GtpFjYDJWCWFZ4Eg8gd4eInXTb2f0ek2FsjR6C62n7VVRWdZVVqbtQnf7gD90tzEgE+ACjJJwMzVPD1cyqTX09PT02tMRBIGMkceWTjMTxnqMO4RWYq7Y5JWM2Ox4BEB/eJwB6zzftjpu1SaqvU7YoWnSWW3UbNrquWymtK+YUKc5I4kkAnyxhfUNJZXVqK3s+6N4ZIzukjGZQ9udhajben02q2QiazV6Vz9oqXVubBQUxu0Uu/cg5wW4AnA4nGDo9HM+6+ni6mntL4eZ7G0Ol2jtHTabWW6mrRkW26uzRhX1IqReApTDMzFiowqMcZIBxw9mbZWz9mAnQq1VWrc3tQPZpSzdAZ668ALvcCwGBkZwCTnzHYnZva9W09najaaX7Nq016akJvqNpag1HIr0tFLG0b3JmO6ACePT1C7UXalhZYoQ4wtaneCDOcE8s9Z16u5Udv0p08t1tcGqYAVd4jhvHeb1wBn5TJ4cfKWun2dUO7stJdsK24RhQcZ49Zm48dZHqT23kULbJGiDjS0B853cjPPdJJHykiIm1M9qSMqnt7EREsQIiIAiIgGu6oXVWVn94YB6HmDKBlZGZWGGUkEdCJ0cha3R98O9r/agYI/GP6zydThdruXKPTgyKHp8FPNFmj0Nzmy3S6ayw83sprZz6sRn5yQQQSDkEHBB4EGYmWm0aHpnyiV1qFrREUclrUKvwUYn1ESAYKIxJIzld3j08oyBujPE5A88CGBPJip8gD/OYVMEsWLMRjJxwHPAA4QD6mu3T6W7HfUU2Y5d7Wjke9hNkQnrgGuqjTUBhRTTUG4sKa0rDeu4BNkT7rrstcV1rvMfgB1J6SfbY9JH3pqTfdWmPZB338kX+vKX8j6XTJpkwDvO2DY3U9B5Dwkia/T4vHPvlmZmyd9euBERPQcRERAEREAREQBERAI2o0lOo4n2bPB15+8eMrLdFqqsnd30/FXx+I5y8iefJ08ZPfDO0Zqj0c1/Mc4nRPVTZ9+tG/MoM0toNE390B+VmH8jPI+jr4z0Lqp+oo4lydm6M+Fg9HP1gbN0Y5q59bG+kr/Eyfhb+TBTTIBY7qgs3RQSfgJeLotEvKlD+bLf7puVEQYRVUdFAA+UvPR19ZV9UviKmnZ+osINn6JOhwXPu5SzpopoXdrUD8R5sx6sZtiezHgjHxyea8tXyIiJ2OQiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIB//9k='}
    ]; 
    useEffect(()=>{

        const fetchUser=()=>{  
            if(sessionStorage.getItem("isLoggedIn")=="true")
            {
            const userString = sessionStorage.getItem("UToken");
            const parsedUser = JSON.parse(userString);
            id = parsedUser.id; 
            SetToken(parsedUser.token);
            console.log(token,"new token")
            
            } 
            else{
                id=0;
            }

        };
        fetchUser();
    })


    useEffect(() => {
        const fetchProducts = async () => {
            const data = await fetch(`https://localhost:7199/api/Product/GetAllProducts`);
            if (data.ok) {
                const response = await data.json();
                setProducts(response);
                const uniqueCategories = [...new Set(response.map(product => product.category))];
                setCategories(uniqueCategories);
            }
        } 
        const fetchwishlist=async()=>{ 
            if(sessionStorage.getItem("isLoggedIn")==true)
            {
               
                const data=await fetch(`https://localhost:7199/api/Product/Get Wishlist By userId/${id}`,{
                    headers:{
                        Authorization: `Bearer ${token}`,
                    }
                });
                if(data)
                {
                    const response=await data.json();
                    setWishlist(response);
                    console.log(response);
                }
            }
        
        }
        fetchProducts();
        fetchwishlist();
    }, [id]);

    useEffect(() => {
        if (selectedCategory) {
            const filteredSubCategories = [...new Set(products
                .filter(product => product.category === selectedCategory)
                .map(product => product.subCategory))];
            setSubCategories(filteredSubCategories);
        } else {
            setSubCategories([]);
        }
        setSelectedSubCategory(""); 
    }, [selectedCategory, products]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    }

    const handleSubCategoryChange = (subCategory) => {
        setSelectedSubCategory(subCategory);
    } 

    const handleWishlist=async(pid)=>{ 
        const logstatus=(sessionStorage.getItem('isLoggedIn')=="true");   
        if(logstatus)
        {
            const check=wishlist.includes(pid);
            if(!check)
            { 
                let data={userId:id,productId:pid}
              
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
                const data=await fetch(`https://localhost:7199/api/Product/Deleted from Wishlist/${id}%2C${pid}?uid=${id}&pid=${pid}`,
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
        }
        else 
        {
           navigate('/log') 
        }
    }

    return ( 
        <div style={{ paddingTop: 100 }}>
        <div >
            {!selectedCategory && (
                <Grid container spacing={2} justifyContent="center">
                    {categories.map((category) => (
                        <Grid item key={category}>
                            <div style={{ textAlign: 'center' }}>
                                <Avatar sx={{ width: 100, height: 100, backgroundColor: '#ccc', cursor: 'pointer' }} onClick={() => handleCategoryChange(category)}>
                                    <img src={images.find(image => image.name === category)?.imageUrl} alt={category} style={{ width: '100%' }} />
                                </Avatar>
                                <Badge badgeContent={category} color="black">
                                    <Typography variant="body1" align="center" style={{ marginTop: 8 }}>
                                        &nbsp;
                                    </Typography>
                                </Badge>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            )}
            {selectedCategory && !selectedSubCategory && (
                <div>
                   
                   
                    <Grid container spacing={2} justifyContent="center"> 
                    <Grid item xs={12} style={{ textAlign: 'left' }}>
                            <Button variant="outlined" startIcon={<CgArrowLeft />} onClick={() => setSelectedCategory("")}>
                                
                            </Button>
                        </Grid>

                        {subCategories.map((subCategory) => (
                            <Grid item key={subCategory}>
                                <div style={{ textAlign: 'center' }}>
                                    <Avatar sx={{ width: 100, height: 100, backgroundColor: '#ccc', cursor: 'pointer' }} onClick={() => handleSubCategoryChange(subCategory)}>
                                        <img src={images.find(image => image.name === subCategory)?.imageUrl} alt={subCategory} style={{ width: '100%' }} />
                                    </Avatar>
                                    <Badge badgeContent={subCategory} color="black">
                                        <Typography variant="body1" align="center" style={{ marginTop: 8 }}>
                                            &nbsp;
                                        </Typography>
                                    </Badge>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            )}
            {selectedSubCategory && (
           <div style={{ marginBottom: 50 }}>
          
           <Grid container spacing={2}>
           <Grid container alignItems="center" style={{paddingTop:20}}>
                <Grid item xs={1}>
                    <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => setSelectedSubCategory("")}></Button>
                </Grid>
                <Grid item xs={11} style={{ textAlign: 'center' }}>
                    <h2 style={{ margin: 0 }}>{selectedSubCategory}</h2>
                </Grid>
            </Grid>

             {products
               .filter(product => product.subCategory === selectedSubCategory)
               .map(product => (
                 <Grid item key={product.id}>
                   <div style={{ marginBottom: '20px', width: '300px' }}>
                    
                       <Grid container direction="column" spacing={1}>
                       <Button onClick={() => navigate('view',{state:{uid:id,pid:product.id,token}})} style={{ width: '100%' }}>
                         <Grid item>
                           <img src={product.image} alt={product.description} style={{ maxWidth: '100%', maxHeight: '200px', width: 'auto', height: 'auto' }} />
                         </Grid> 
                         </Button>
                         <Grid item style={{ display: 'flex', alignItems: 'center', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                           <Typography variant="h6" style={{ color: 'black' }}>{product.brandName}</Typography>
                           <Button onClick={() => handleWishlist(product.id)} style={{ padding: '0px', minWidth: 'auto', marginRight: '5px' ,marginLeft:'auto'}}>
                             {wishlist.includes(product.id) ? (
                               <FavoriteIcon style={{ color: 'red' }} /> 
                             ) : (
                               <FavoriteBorder style={{ color: 'black' }} /> 
                             )}
                           </Button>
                         </Grid>
                         <Grid item style={{ display: 'flex', alignItems: 'center', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                           <Typography variant="body1" style={{ color: 'black' }}>{product.description}</Typography>
                           
                           
                         </Grid>
                       </Grid>
                    
                   </div>
                 </Grid>
               ))}
           </Grid>
         </div>

          
            
            )}
        </div>  
        <DisplayProducts/>
        </div>
    );
}

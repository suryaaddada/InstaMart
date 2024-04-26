import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, Button, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const ViewMultipleProducts = () => {
    const location = useLocation();
    const searchQuery = location.state?.searchQuery || '';
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [subcategories, setSubCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [expanded, setExpanded] = useState(false); 
    const[savingFilteredProduct,setSavingFilteredProduct]=useState([]);
    const[user,setUser]=useState('');
    const navigate=useNavigate(); 
    let uid=0; 
    const[utoken,setUserToken]=useState('');
    const[vtoken,setVendorToken]=useState('');
   
    

    useEffect(()=>{

        const fetchUser=()=>{  
            if(sessionStorage.getItem("isLoggedIn")=="true")
            {
                if(sessionStorage.getItem("UToken")!=null)
                {
                    
                    const userString = sessionStorage.getItem("UToken");
                    const parsedUser = JSON.parse(userString);
                    uid = parsedUser.id;
                    setUser('User')
                    setUserToken(parsedUser.token);
                    console.log('user')
                }
                else{
                    const userString = sessionStorage.getItem("VToken");
                    const parsedUser = JSON.parse(userString);
                    uid = parsedUser.id;
                    setUser('Vendor') 
                    setVendorToken(parsedUser.token);
                    console.log('vendor')
                }
            } 
            else{
                uid=0;
            }

        };
        fetchUser();
    })
    


    useEffect(() => {
        const fetchData = async () => {
            try { 
                var response;
                if(user=='Vendor')
                response=await fetch(`https://localhost:7199/api/Product/Get All Vendor Products/${uid}`,{
            headers:{
                Authorization: `Bearer ${vtoken}`,
            }})
                 

                else 
                response = await fetch('https://localhost:7199/api/Product/GetAllProducts');
                const data = await response.json();
                console.log("Fetched products:", data);
                setProducts(data);
                console.log(data); 


                const allCategories = [...new Set(data.map(product => product.category))].sort();
                const allBrands = [...new Set(data.map(product => product.brandName))].sort();
                const allSubCategories = [...new Set(data.map(product => product.subCategory))].sort();
                const allColors = [...new Set(data.map(product => product.color))].sort();
                setCategories(allCategories);
                setBrands(allBrands);
                setSubCategories(allSubCategories);
                setColors(allColors);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
    }, [user]);

    useEffect(() => {
        let filtered = products.filter(product => {
            const keywords = searchQuery.toLowerCase().split(' ');
            return keywords.every(keyword =>
                product.brandName.toLowerCase().includes(keyword) ||
                product.color.toLowerCase().includes(keyword) ||
                product.subCategory.toLowerCase().includes(keyword) ||
                product.description.toLowerCase().includes(keyword) ||
                product.category.toLowerCase().includes(keyword)
            );
        });
        setFilteredProducts(filtered);
        setSavingFilteredProduct(filtered);
    }, [searchQuery, products]);

    const applyFilters = () => {
        let filtered = savingFilteredProduct;

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product => selectedCategories.includes(product.category));
        }
        if (selectedBrands.length > 0) {
            filtered = filtered.filter(product => selectedBrands.includes(product.brandName));
        }
        if (selectedSubCategories.length > 0) {
            filtered = filtered.filter(product => selectedSubCategories.includes(product.subCategory));
        }
        if (selectedColors.length > 0) {
            filtered = filtered.filter(product => selectedColors.includes(product.color));
        }

        console.log("Filtered products:", filtered);
        setFilteredProducts(filtered);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(item => item !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    const handleBrandChange = (brand) => {
        setSelectedBrands(prev => {
            if (prev.includes(brand)) {
                return prev.filter(item => item !== brand);
            } else {
                return [...prev, brand];
            }
        });
    };

    const handleSubCategoryChange = (subcategory) => {
        setSelectedSubCategories(prev => {
            if (prev.includes(subcategory)) {
                return prev.filter(item => item !== subcategory);
            } else {
                return [...prev, subcategory];
            }
        });
    };

    const handleColorChange = (color) => {
        setSelectedColors(prev => {
            if (prev.includes(color)) {
                return prev.filter(item => item !== color);
            } else {
                return [...prev, color];
            }
        });
    };

    const resetFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setSelectedSubCategories([]);
        setSelectedColors([]);
        setFilteredProducts(savingFilteredProduct);
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleButtonClick=async(pid)=>{
        if(user=="Vendor")
        { 
            const request = await fetch(`https://localhost:7199/api/Product/Get Grouped Product By Vendor id/${uid}`,{
                headers:{
                    Authorization: `Bearer ${vtoken}`,
                }
            });
                if (request.ok) {
                    const response=await request.json();
                    const requiredproduct=response.filter(x=>x.id==pid); 
                    const product={...requiredproduct[0]}
                    navigate("../VProduct", { state: { Product: product, vendorId: uid,token:vtoken } });
                }
           
        } 
        else{
            navigate('../view', { state: { uid, pid: pid,token:utoken } });
        }
    }

    return (
        <div style={{ display: 'flex', height: '100vh', paddingTop: 80 ,paddingBottom:130}}>
            <div style={{ width: '200px', position: 'fixed', top: 30, left: 0, bottom: 0, backgroundColor: '#f0f0f0', padding: '60px 20px 40px ' }}>
                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Category
                    </AccordionSummary>
                    <AccordionDetails style={{ textAlign: 'left' }}>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {categories.map((category, index) => (
                                <li key={index}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={category}
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                        />
                                        {category}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Brand
                    </AccordionSummary>
                    <AccordionDetails style={{ textAlign: 'left' }}>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {brands.map((brand, index) => (
                                <li key={index}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={brand}
                                            checked={selectedBrands.includes(brand)}
                                            onChange={() => handleBrandChange(brand)}
                                        />
                                        {brand}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Subcategory
                    </AccordionSummary>
                    <AccordionDetails style={{ textAlign: 'left' }}>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {subcategories.map((subcategory, index) => (
                                <li key={index}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={subcategory}
                                            checked={selectedSubCategories.includes(subcategory)}
                                            onChange={() => handleSubCategoryChange(subcategory)}
                                        />
                                        {subcategory}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Color
                    </AccordionSummary>
                    <AccordionDetails style={{ textAlign: 'left' }}>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {colors.map((color, index) => (
                                <li key={index}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={color}
                                            checked={selectedColors.includes(color)}
                                            onChange={() => handleColorChange(color)}
                                        />
                                        {color}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </AccordionDetails>
                </Accordion>
                <div style={{ textAlign: 'left', marginTop: '10px' }}>
                    <Button variant="contained" color="primary" onClick={applyFilters} style={{ marginBottom: '10px', width: '100%' }}>Apply Filters</Button>
                    <Button variant="contained" color="secondary" onClick={resetFilters} style={{ width: '100%' }}>Reset Filters</Button>
                </div>
            </div>
            <div style={{ marginLeft: '220px', padding: '30px 30px 120px 30px', width: 'calc(100% - 220px)' }}>
            <Grid container spacing={3} justifyContent="center" style={{paddingBottom:90}}>
                {filteredProducts.map(product => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Button
                            onClick={() => handleButtonClick(product.id)}
                            style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                        >
                            <Card style={{ width: '100%' }}>
                            <CardContent>
                                <h2>{product.brandName}</h2>
                                <img src={product.image} alt={product.brandName} style={{ width: '100px', height: '100px' }} />
                                <div style={{ maxHeight: '3.6em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    <p>{product.description}</p>
                                    {product.description.length < 35 && <p>&nbsp;</p>} 
                                </div>
                                <p>{product.color}</p>
                            </CardContent>

                            </Card>
                        </Button>
                    </Grid>
                ))}
                {filteredProducts.length === 0 && (
                    <Grid item xs={12}>
                        <p>No products available for selected filters.</p>
                    </Grid>
                )}
            </Grid>
        </div>
        </div>
    );
};

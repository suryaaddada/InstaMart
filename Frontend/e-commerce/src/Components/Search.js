import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
 
const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [categoryAccordionOpen, setCategoryAccordionOpen] = useState(false);
  const [brandAccordionOpen, setBrandAccordionOpen] = useState(false);
  const [subCategoryAccordionOpen, setSubCategoryAccordionOpen] = useState(false);
  const [colorAccordionOpen, setColorAccordionOpen] = useState(false);

   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7199/api/Product/GetAllProducts');
        const data = await response.json();
        setProducts(data);
        // Extract unique categories, brands, subcategories, and colors from all products
        const allCategories = [...new Set(data.map(product => product.category))];
        const allBrands = [...new Set(data.map(product => product.brandName))];
        const allSubCategories = [...new Set(data.map(product => product.subCategory))];
        const allColors = [...new Set(data.map(product => product.color))];
        setCategories(allCategories);
        setBrands(allBrands);
        setSubCategories(allSubCategories);
        setColors(allColors);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []);

  const applyFilters = () => {
    let filtered = products.filter(product => {
      const keywords = searchQuery.toLowerCase().split(' ');
      return keywords.every(keyword =>
        product.brandName.toLowerCase().includes(keyword) || 
        product.color.toLowerCase().includes(keyword)||
        product.subCategory.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
      );
    });
  
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (selectedBrand) {
      filtered = filtered.filter(product => product.brandName.toLowerCase() === selectedBrand.toLowerCase());
    }
    if (selectedSubCategory) {
      filtered = filtered.filter(product => product.subCategory.toLowerCase() === selectedSubCategory.toLowerCase());
    }
    if (selectedColor) {
      filtered = filtered.filter(product => product.color.toLowerCase() === selectedColor.toLowerCase());
    }
  
    setFilteredProducts(filtered);
  };

  const handleSearchClick = () => {
    applyFilters();
    //setSearchQuery(''); 
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
  };

  const handleSubCategoryChange = (subcategory) => {
    setSelectedSubCategory(subcategory);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const toggleCategoryAccordion = () => {
    setCategoryAccordionOpen(!categoryAccordionOpen);
  };

  const toggleBrandAccordion = () => {
    setBrandAccordionOpen(!brandAccordionOpen);
  };

  const toggleSubCategoryAccordion = () => {
    setSubCategoryAccordionOpen(!subCategoryAccordionOpen);
  };

  const toggleColorAccordion = () => {
    setColorAccordionOpen(!colorAccordionOpen);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedSubCategory('');
    setSelectedColor('');
    setSearchQuery('');
    setFilteredProducts([]);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '200px', position: 'fixed', top: 0, left: 0, bottom: 0, backgroundColor: '#f0f0f0', padding: '20px' }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Category
          </AccordionSummary>
          <AccordionDetails style={{ textAlign: 'left' }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {categories.map((category, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="radio"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={() => handleCategoryChange(category)}
                    />
                    {category}
                  </label>
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Brand
          </AccordionSummary>
          <AccordionDetails style={{ textAlign: 'left' }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {brands.map((brand, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="radio"
                      value={brand}
                      checked={selectedBrand === brand}
                      onChange={() => handleBrandChange(brand)}
                    />
                    {brand}
                  </label>
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Subcategory
          </AccordionSummary>
          <AccordionDetails style={{ textAlign: 'left' }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {subcategories.map((subcategory, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="radio"
                      value={subcategory}
                      checked={selectedSubCategory === subcategory}
                      onChange={() => handleSubCategoryChange(subcategory)}
                    />
                    {subcategory}
                  </label>
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Color
          </AccordionSummary>
          <AccordionDetails style={{ textAlign: 'left' }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {colors.map((color, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="radio"
                      value={color}
                      checked={selectedColor === color}
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
          <Button variant="contained" color="primary" onClick={applyFilters}>Apply Filters</Button>
          <Button variant="contained" color="secondary" onClick={resetFilters} style={{ marginLeft: '10px' }}>Reset Filters</Button>
        </div>
      </div>

      <div style={{ marginLeft: '220px', padding: '20px', width: 'calc(100% - 220px)' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearchClick}>Search</button>

        <div>
          {filteredProducts.length === 0 && <p>No products available for selected filters.</p>}
          {filteredProducts.map(product => (
            <div key={product.id}>
              <h2>{product.brandName}</h2>
              <p>Description: {product.description}</p>
              <p>Category: {product.category}</p>
              <p>Subcategory: {product.subCategory}</p>
              <p>Color: {product.color}</p>
              <img src={product.image} alt={product.brandName} style={{ width: '100px', height: '100px' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;

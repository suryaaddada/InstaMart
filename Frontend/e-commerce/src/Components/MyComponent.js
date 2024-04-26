// // // // // // import { Alert } from 'react-bootstrap';

// // // // // // export const MyComponent = () => {
// // // // // //     return (
// // // // // //         <Alert variant="danger">
// // // // // //             This is a danger alert—check it out!
// // // // // //         </Alert>
// // // // // //     );
// // // // // // };

// // // // // import Snackbar from '@mui/material/Snackbar';
// // // // // import MuiAlert from '@mui/material/Alert';
// // // // // import { useState } from 'react';

// // // // // export const MyComponent = () => {
// // // // //     const [open, setOpen] = useState(true); 

// // // // //     const handleClose = (event, reason) => {
// // // // //         if (reason === 'clickaway') {
// // // // //             return;
// // // // //         }
// // // // //         setOpen(false);
// // // // //     };

// // // // //     return (
// // // // //         <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
// // // // //             <MuiAlert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
// // // // //                 This is an error message!
// // // // //             </MuiAlert>
// // // // //         </Snackbar>
// // // // //     );
// // // // // };


// // // // import { toast } from 'react-toastify';
// // // // import 'react-toastify/dist/ReactToastify.css'; 
// // // // import { ToastContainer } from 'react-toastify';
// // // // import swal from 'sweetalert';
// // // // import Swal from 'sweetalert2';

// // // // export const MyComponent = () => {
// // // //     const notify = () => {Swal.fire({
// // // //         title: "Custom animation with Animate.css",
// // // //         showClass: {
// // // //           popup: `
// // // //           animate__rollOut
// // // //           `
// // // //         }
// // // //     })
        
// // // // };

// // // //     return (
// // // //         <div>
// // // //             <button onClick={notify}>Notify</button>
// // // //             {/* <ToastContainer /> */}
// // // //         </div>
// // // //     );
// // // // };
// // // import React from 'react';
// // // import AppBar from '@mui/material/AppBar';
// // // import Toolbar from '@mui/material/Toolbar';
// // // import Typography from '@mui/material/Typography';
// // // import Button from '@mui/material/Button';
// // // import LogoutIcon from '@mui/icons-material/Logout';

// // // export const MyComponent = () => {
// // //   return (
// // //     <AppBar position="static">
// // //       <Toolbar>
// // //         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
// // //           Welcome 
// // //         </Typography>
// // //         <Button color="inherit" startIcon={<LogoutIcon />} >Logout</Button>
// // //       </Toolbar>
// // //     </AppBar>
// // //   );
// // // }

// // import React, { useEffect, useState } from 'react';
// // import Modal from '@mui/material/Modal';
// // import Backdrop from '@mui/material/Backdrop';
// // import Typography from '@mui/material/Typography';
// // import { makeStyles } from '@mui/styles';

// // const useStyles = makeStyles((theme) => ({
// //   modal: {
// //     display: 'flex',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   messageContainer: {
// //     backgroundColor: '#fff',
// //     boxShadow: theme.shadows[5],
// //     padding: theme.spacing(2, 4, 3),
// //     borderRadius: '8px',
// //     textAlign: 'center',
// //   },
// // }));

// // export const MyComponent = () => {
// //   const classes = useStyles();
// //   const [open, setOpen] = useState(false);
// //   const [user, setUser] = useState({ isapproved: false });

// //   useEffect(() => {
// //     const ApprovedVendor = () => {
// //       if (user && user.isapproved === false) {
// //         setOpen(true);
// //       }
// //     };

// //     ApprovedVendor();
// //   }, [user]);

// //   const handleClose = () => {
   
// //     console.log("Closed")
// //   };

// //   return (
// //     <div>
// //       {/* Your component JSX */}

// //       <Modal
// //         className={classes.modal}
// //         open={open}
// //         BackdropComponent={Backdrop}
// //         BackdropProps={{
// //           invisible: true,
// //           style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
// //           onClick: handleClose, 
// //         }}
// //       >
// //         <div className={classes.messageContainer}>
// //           <Typography variant="h5" gutterBottom>
// //             You are not approved yet.
// //           </Typography>
// //         </div>
// //       </Modal>
// //     </div>
// //   );
// // }; 

// import React from 'react';
// import { Avatar, Grid, Typography, Badge } from '@mui/material';

// const categories = [
//   { name: 'Men', imageUrl: 'data:image/jpeg;base64,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' },

//   { name: 'Women', imageUrl: 'data:image/jpeg;base64,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' },

 
// ];

// export const MyComponent = () => {
//   return (
//     <Grid container spacing={2} justifyContent="center">
//       {categories.map((category, index) => (
//         <Grid item key={index}>
//           <div style={{ textAlign: 'center' }}>
//             <Avatar sx={{ width: 100, height: 100, backgroundColor: '#ccc' }}>
//               <img src={category.imageUrl} alt={category.name} style={{ width: '100%' }} />
//             </Avatar>
//             <Badge badgeContent={category.name} color="black">
//               <Typography variant="body1" align="center" style={{ marginTop: 8 }}>
//                 &nbsp;
//               </Typography>
//             </Badge>
//           </div>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };
import React, { useState, useEffect } from 'react';

export const MyComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [subcategories, setSubCategories] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7199/api/Product/GetAllProducts');
        const data = await response.json();
        setProducts(data);
        applyFilters(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []);

  const applyFilters = (data) => {
    let filtered = data.filter(product => {
      const keywords = searchQuery.toLowerCase().split(' ');
      return keywords.every(keyword =>
        product.brandName.toLowerCase().includes(keyword) || 
        product.color.toLowerCase().includes(keyword)||
        product.subCategory.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
      );
    });
  
    if (selectedSubCategory) {
      filtered = filtered.filter(product => product.subCategory.toLowerCase() === selectedSubCategory.toLowerCase());
    }
    if (selectedColor) {
      filtered = filtered.filter(product => product.color.toLowerCase() === selectedColor.toLowerCase());
    }
  
    setFilteredProducts(filtered);
  
    // Extract unique categories and colors
    const uniqueSubCategories = [...new Set(filtered.map(product => product.subCategory))];
    const uniqueColors = [...new Set(filtered.map(product => product.color))];
    setSubCategories(uniqueSubCategories);
    setColors(uniqueColors);
  };
  

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    applyFilters(products);
  };

  const handleSubCategoryChange = (event) => {
    setSelectedSubCategory(event.target.value);
    applyFilters(products);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
    applyFilters(products);
  };

  return (
    <div style={{ padding: 60 }}>
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <button onClick={applyFilters}>Search</button>

      <div>
        <label htmlFor="category">Category:</label>
        <select id="category" value={selectedSubCategory} onChange={handleSubCategoryChange}>
          <option value="">All</option>
          {subcategories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="color">Color:</label>
        <select id="color" value={selectedColor} onChange={handleColorChange}>
          <option value="">All</option>
          {colors.map((color, index) => (
            <option key={index} value={color}>{color}</option>
          ))}
        </select>
      </div>

      <div>
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
  );
};

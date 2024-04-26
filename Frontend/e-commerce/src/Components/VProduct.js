import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add'; 
import SendIcon from "@mui/icons-material/Send"; 
import { AddCircle} from "@mui/icons-material";


export const VProduct = () => {
    const location = useLocation();
    const { Product, vendorId ,token} = location.state || {};
    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState(Product);
    const [prod, setProduct] = useState({});
    const [newSize, setNewSize] = useState({ productId: editedProduct.id, productSize: '', stock: '', price: '' });
    const [addClick, setAddClick] = useState(false); 
    const [editSizeChange,setEditSizeChange] =useState(0);
    const navigate = useNavigate();


    // Function to handle changes in the edited product details
    const handleEditChange = (id, field, value) => {
        const updatedSizes = editedProduct.sizes.map(size => {
            if (size.id === id) {
                return { ...size, [field]: value };
            }
            return size;
        });
        setEditedProduct(prevState => ({
            ...prevState,
            sizes: updatedSizes
        })); 
        setEditSizeChange(id);
    };

    useEffect(() => {
        const fetchInfo = () => {
            setProduct({
                id: editedProduct.id,
                brandName: editedProduct.brandName,
                image: editedProduct.image,
                description: editedProduct.description,
                category: editedProduct.category,
                subCategory: editedProduct.subCategory,
                color: editedProduct.color,
                vendorId: vendorId,
                status: 'Active'
            });
        };
        fetchInfo();
    }, [editedProduct]);

    const handleInputChange = (event, attribute) => {
        setProduct({ ...prod, [attribute]: event.target.value });
    };

    const handleUpdate = async (id, productSize, stock, price) => {
        console.log("Up", id, productSize, stock, price, prod.id);
        try {
            const updatedSizes = editedProduct.sizes.map(item => {
                if (item.id === id) {
                    return { ...item, productSize, stock, price };
                }
                return item;
            });

            setEditedProduct(prevState => ({
                ...prevState,
                sizes: updatedSizes
            })); 
            setEditSizeChange(0);

            const data = { id, productId: prod.id, productSize, price, stock };
            console.log(data);
            const update = await fetch(`https://localhost:7199/api/Product/Update Inventory Items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (update.ok) {
                console.log("Inventory Updated Successfully");
            }

        } catch (error) {
            console.error("Failed to update");
        }
        // setIsEditing(false);
    };

    const handleDelete = async (id) => {
        try {
            const updatedSizes = editedProduct.sizes.filter(size => size.id !== id);
            setEditedProduct(prevState => ({
                ...prevState,
                sizes: updatedSizes
            }));
            const response = await fetch(`https://localhost:7199/api/Product/Delete Inventory Items/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            if (response.ok) {
                console.log("Inventory Deleted Successfully");
            }

        } catch (error) {
            console.error("Failed to Delete");
        }
        setIsEditing(false);
    }



    const handleSave = async () => {
        try {
            const update = await fetch(`https://localhost:7199/api/Product/UpdateProduct/${prod.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(prod),
            })
            if (update.ok) {
                console.log("Updated Successfully");
            }
        } catch (error) {
            console.error("Failed to update");
        }

        setIsEditing(false);
    };

    const handleNewSizeChange = (field, value) => {
        setNewSize(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleAddSize = async () => {
        try {


            if(newSize.productSize.trim()!=='' && newSize.stock.trim()!=='' && newSize.price.trim()!=='')

            {
                setEditedProduct(prevState => ({
                    ...prevState,
                    sizes: [...prevState.sizes, newSize]
                }));
                console.log(newSize);
    
                const posting = await fetch(`https://localhost:7199/api/Product/Add Items Into Inventory`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(newSize),
                });
                if (posting.ok) {
                    console.log("Posting Successful");
                    setNewSize({ productId: prod.id, productSize: '', stock: '', price: '', size: '' });
                    setAddClick(false);
                } else {
                    console.error("Posting failed:", posting.statusText);
                    setNewSize({ productId: prod.id, productSize: '', stock: '', price: '', size: '' });
                }
            }
             else {
                console.log("SizeCheck failed. Add Variant Details."); 
                setNewSize({ productId: prod.id, productSize: '', stock: '', price: '', size: '' });
                alert("Add Variant Details");
            }
        } catch (error) {
            console.error("Error in handleAddSize:", error);
        }
    };
    
   
    

    const handleDeleteProduct = async () => {
        try {

            const data = await fetch(`https://localhost:7199/api/Product/Delete/${prod.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            if (data.ok) {
                console.log("Product Deleted Successfully");
                navigate("/log/vendorbar");
                setEditedProduct({});
                setNewSize();
                setProduct();
            }
        } catch (error) {
            console.log("Error in Deleting the Product")
        }
    }

    return (
        <div style={{ display: "flex", gap: "20px", marginTop: "40px", padding: 30, marginBottom: "50px" }}>
            {/* Left section: Product details */}
            <div style={{ flex: 1 }}>
                <Card>
                    <CardContent>
                        <Typography fullWidth variant="body1" component="div" margin="dense">
                            <TextField
                                label="Brand" margin="dense"
                                value={prod.brandName}
                                onChange={e => handleInputChange(e, 'brandName')}
                                disabled={!isEditing}
                            />
                        </Typography>
                        <Typography fullWidth variant="body1" component="div" margin="dense">
                            <TextField
                                label="Category" margin="dense"
                                value={prod.category}
                                onChange={e => handleInputChange(e, 'category')}
                                disabled={!isEditing}
                            />
                        </Typography>
                        <Typography fullWidth variant="body1" component="div" margin="dense">
                            <TextField margin="dense"
                                label="Color"
                                value={prod.color}
                                onChange={e => handleInputChange(e, 'color')}
                                disabled={!isEditing}
                            />
                        </Typography>
                        <Typography fullWidth variant="body1" component="div" margin="dense">
                            <TextField margin="dense"
                                label="Description"
                                value={prod.description
                                }
                                onChange={e => handleInputChange(e, 'description')}
                                disabled={!isEditing}
                            />
                        </Typography>
                        <Typography fullWidth variant="body1" component="div" margin="dense">
                            <TextField margin="dense"
                                label="Subcategory"
                                value={prod.subCategory}
                                onChange={e => handleInputChange(e, 'subCategory')}
                                disabled={!isEditing}
                            />
                        </Typography>
                        {isEditing &&
                            <Typography fullWidth variant="body1" component="div" margin="dense">
                                <TextField margin="dense"
                                    label="Image URL"
                                    value={prod.image}
                                    onChange={e => handleInputChange(e, 'image')}
                                    disabled={!isEditing}
                                />
                            </Typography>
                        }
                    </CardContent>
                </Card>
        
            </div>
        
            {/* Middle section: Product image */}
            <div>
                <CardMedia
                    component="img"
                    src={prod.image}
                    alt={prod.brandName}
                    style={{ width: 300 }}
                />
                {isEditing && ( 
                    <Tooltip title="Save" arrow>
                    <IconButton onClick={handleSave}>
                        <SaveIcon color="primary" />
                    </IconButton>
                    </Tooltip>
                )}
                {isEditing && (
                    <Tooltip title="Cancel" arrow>
                    <IconButton onClick={() =>{ setIsEditing(false);  setEditSizeChange(0)}}>
                        <CancelIcon color='error' />
                    </IconButton> 
                    </Tooltip>
                )}
                {!isEditing && ( 
                    <Tooltip title="Edit" arrow>
                    <IconButton onClick={() => setIsEditing(true)}>
                        <EditIcon color='info' />
                    </IconButton>
                    </Tooltip>
                )}
                {!isEditing && ( 
                    <Tooltip title="Delete" arrow>
                    <IconButton onClick={handleDeleteProduct}>
                        <DeleteIcon  color='error' />
                    </IconButton>
                    </Tooltip>
                )}
            </div>
        
            {/* Right section: Product size table */}
            <div style={{ flex: 1,position:'relative' }}>
                <TableContainer component={Card}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Size</TableCell>
                                <TableCell>Stock</TableCell>
                                <TableCell>Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {editedProduct.sizes.map((size) => (
                                <TableRow key={size.id}>
                                    <TableCell>
                                        <TextField
                                            value={size.productSize}
                                            onChange={e => handleEditChange(size.id, 'productSize', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={size.stock}
                                            onChange={e => handleEditChange(size.id, 'stock', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={size.price}
                                            onChange={e => handleEditChange(size.id, 'price', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {isEditing && (
                                            <> 
                                            {editSizeChange===size.id && 
                                            //  size.id === editSizeChange && 
                                            <Tooltip title="Save" arrow>
                                                <IconButton onClick={() => handleUpdate(size.id, size.productSize, size.stock, size.price)}> 

                                                    <SaveIcon color='primary' />
                                                </IconButton> 
                                                </Tooltip>
                                            } 
                                            <Tooltip title="Delete" arrow>
                                                <IconButton onClick={() => handleDelete(size.id)}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                {addClick && (
                                    <>
                                        <TableCell>
                                            <TextField
                                                value={newSize.productSize}
                                                onChange={e => handleNewSizeChange('productSize', e.target.value)}
        
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={newSize.stock}
                                                onChange={e => handleNewSizeChange('stock', e.target.value)}
        
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={newSize.price}
                                                onChange={e => handleNewSizeChange('price', e.target.value)}
        
                                            />
                                        </TableCell>
                                        <TableCell> 
                                        <Tooltip title="Post" arrow>
                                           <IconButton onClick={handleAddSize}>
                                                <SendIcon color="primary" />
                                            </IconButton> 
                                            </Tooltip>
                                            <Tooltip title="Cancel" arrow>
                                            <IconButton onClick={() => setAddClick(false)}>
                                                <CancelIcon color="error" />
                                            </IconButton>
                                            </Tooltip>
        
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableBody>
                    </Table> 
                    {!addClick &&  
                    <Tooltip title="Add Variant" arrow>
                    <IconButton onClick={() => {setAddClick(true)}} style={{ position: 'relative', bottom: 0, right: -100  }}>
                  
                   <AddCircle sx={{ fontSize: '2rem'}}  color= 'primary'  /> 
                   
                </IconButton> 
                </Tooltip>
                }
                </TableContainer>
                
            </div>
        </div>
        );
        };
        
        
        
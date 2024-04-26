import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, MenuItem, Select } from "@mui/material";
import { useLocation } from "react-router-dom";

export const AdminOrders = () => {
  const [orderedItems, setOrderedItems] = useState([]);
  const [tab, setTab] = useState("Ordered"); 
  const location=useLocation();
  const {token}=location.state;
  useEffect(() => {
    
    fetchOrders();
  }, []); 

  const fetchOrders = async () => {
    try {
      const getOrders = await axios.get('https://localhost:7199/api/Order/Get all Ordered_Items',{
        headers: {
                    
          Authorization: `Bearer ${token}`,
        }, 
      });
      if (getOrders.status === 200) {
        setOrderedItems(getOrders.data);
      }
    } catch (error) {
      console.error("Error in fetching orders");
    }
  }

  useEffect(() => {
    fetchOrders();
    filterItemsByStatus();
  }, [tab]); 

  const filterItemsByStatus = () => {
    return orderedItems.filter(item => item.orderStatus === tab);
  }; 
  const handleChange=async(status,id)=>{
    try{
        const request = await fetch(`https://localhost:7199/api/Order/Order Status Change/${id}?order_Status=${status}&${(status === "Delivered") ? "&delivered_date=" + new Date().toISOString() : ""}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if(request.ok)
    {
        const response=await request.text();
        console.log(response);  
        
        fetchOrders();
    }
}catch(error)
{
    console.error("Error in updating")
}
  }

  return (
    <div style={{ paddingTop: 90,paddingBottom:40 }}>
      <div className="tabs" >
        <Button onClick={() => setTab("Ordered")}    variant={tab==="Ordered"?"contained":'outlined'} > Ordered</Button>
        <Button onClick={() => setTab("Out for Delivery")} variant={tab==="Out for Delivery"?"contained":'outlined'}>Out for Delivery</Button>
        <Button onClick={() => setTab("Delivered")} variant={tab==="Delivered"?"contained":'outlined'}>Delivered</Button>
        <Button onClick={() => setTab("Raise Return")} variant={tab==="Raise Return"?"contained":'outlined'}>Return Raised</Button>
       
      </div>
      <div className="card-container"> 
      {filterItemsByStatus().length === 0 ? (
        <div>No orders found.</div>
      ) : (
        filterItemsByStatus().map(item => (
          <div key={item.id} style={{ marginBottom: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5, boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={item.image} alt={item.brandName} style={{ width: 100, height: 100, marginRight: 20 }} />
                <div style={{ paddingRight: 340 }}>
                  <h3 style={{textAlign:'left'}}>{item.brandName}</h3>
                  <p>{item.description}</p>
                  <p>Color: {item.color}</p>
                </div>
              </div>
              <div>
                <label htmlFor={`actions-${item.id}`}><b>Actions</b></label>
                <Select id={`actions-${item.id}`} style={{ marginLeft: 10 }} value={item.orderStatus}
                     onChange={(e) => handleChange(e.target.value, item.id)} >
                    {tab === "Ordered" && [
                      <MenuItem key="ordered" value="Ordered">Ordered</MenuItem>,
                      <MenuItem key="outForDelivery" value="Out for Delivery">Out For Delivery</MenuItem>
                    ]}
                    {tab === "Out for Delivery" && [
                      <MenuItem key="outForDelivery" value="Out for Delivery">Out For Delivery</MenuItem>,
                      <MenuItem key="delivered" value="Delivered">Delivered</MenuItem>
                    ]}
                    {tab === "Delivered" && (
                      <MenuItem key="delivered" value="Delivered">Delivered</MenuItem>
                    )}
                    {tab === "Raise Return" && [
                      <MenuItem key="" value="Raise Return">Select an Option</MenuItem>,
                      <MenuItem key="acceptReturn" value="Accept Return">Return Accepted</MenuItem>,
                      <MenuItem key="rejectReturn" value="Reject Return">Return Rejected</MenuItem>
                    ]}
                </Select>


              </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};

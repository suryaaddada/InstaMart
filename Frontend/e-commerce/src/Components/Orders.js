import { useEffect, useState } from "react";
import {  useLocation, useNavigate } from "react-router-dom"; 
import { FaChevronRight } from 'react-icons/fa6';


export const Orders = () => {
    const user = sessionStorage.getItem("UToken"); 
    const parseduser = JSON.parse(user);
    const id = parseduser.id;   
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate(); 
    const location=useLocation();
    const{token}=location.state;
   
    

    useEffect(() => {
        const fetchOrders = async () => { 
            try {
                const request = await fetch(`https://localhost:7199/api/Order/Get All Orders Based On User Id/${id}`,{
                    headers: {
                    
                        Authorization: `Bearer ${token}`,
                      }, 
                });
                if(request.ok) {
                    const response = await request.json(); 
                    console.log(response);
                    setOrders(response);
                } else {
                    console.log("Error in fetching previous orders");
                }
            } catch(error) {
                console.error("Error:", error);
            }
        }
        fetchOrders();
    }, [id]);

    const handleCardClick = (order) => {
       
       
      
       var  data =orders.filter(o=>o.id==order.id);
    //    var filtered=data.filter(o=>o.pid!=order.pid);
        console.log("filtered",data); 
        navigate('../summary', { state:{data:order,sameorder:data,uid:id,token} }); 
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    };

    return (  
        <div style={{ padding: '100px 50px 50px 50px'}}>
          
            {orders.map((order, index) => (
                <div 
                    key={index} 
                    style={{ 
                        marginBottom: 20, 
                        padding: 10, 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: 5, 
                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <button 
                        style={{ 
                            display: 'flex', 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            border: 'none', 
                            background: 'none', 
                            cursor: 'pointer',
                            flex: '1'  // Allow the button to expand
                        }} 
                        onClick={() => handleCardClick(order)}
                    >
                        <img src={order.image} alt="Product" style={{ width: 100, height: 100, marginRight: 20 }} />
                        <div style={{textAlign:'left'}}>
                            <p>{order.brandName}</p>
                            <p>{order.description}</p>
                            <p>Size: {order.productSize}</p>
                            <p>Order Date: {formatDate(order.date)}</p>
                            <p> <b>{order.orderStatus}</b></p>
                        </div> 
                    </button>
                    <FaChevronRight />
                </div>
            ))}
        </div>
    );
};

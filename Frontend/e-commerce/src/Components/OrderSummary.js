import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { Button } from "@mui/material";
import "./animation.css";

import { Download } from "./Download"; 
import {TbArrowBackUp} from "react-icons/tb"




export const OrderSummary = () => {
    const location = useLocation();
    const  { data, uid ,token} = location.state;  
    const [sameorder, setSameOrder] = useState(location.state.sameorder); 
    const [original,setOriiginal]=useState(location.state.sameorder);  

    const [invoiceGenerated, setInvoiceGenerated] = useState(false);

    

    

    const navigate = useNavigate();
    const [showBreakup, setShowBreakup] = useState(false);  
    const[showFullBreakUp,setShowFullBreakUp]=useState(false);
    useEffect(()=>{ 
        const filteringProduct=()=>{
            var filteredData=original.filter(x=>x.pid!=data.pid);
            setSameOrder(filteredData); 
           
        }
       filteringProduct();
    },[original,data]);
 
    const handleGeneratePDF = () => { 

        const jsonData={...data};  
        delete jsonData.image; 
        sessionStorage.setItem('data',JSON.stringify(jsonData));
        navigate('../invoice',{state:{token}});
        
      
    //    Download(jsonData);
    //     setInvoiceGenerated(true);
    }
    const handleOrderedStatus=async(date,id)=>{
        try{
           console.log(data)
            const request=await fetch(`https://localhost:7199/api/Order/Order Status Change/${id}?order_Status=Raise Return&delivered_date=${date}`,{
                method:'PATCH',
                headers: {
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${token}`,
                },
            });
            if(request.ok)
            {
                const response=await request.text();
                console.log(response); 
                navigate(-1);
               
            }
        }catch(error)
        {
            console.error("Error in updating")
        }
    }

    const isWithinNextSevenDays = (deliveredDateStr) => {
        // Convert deliveredDateStr to a Date object
        const deliveredDate = new Date(deliveredDateStr);
        // Get the current date
        const currentDate = new Date();
        // Calculate the date 7 days from the delivered date
        const nextSevenDays = new Date(deliveredDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // Adding milliseconds for 7 days
      
        return currentDate <= nextSevenDays;
      };
      
    

    return (
        <div style={{ padding: '90px 0px 100px 0px' }}>
            <div style={{ padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'left' }}>
                    <div style={{ textAlign: 'center' }}> 
                    <div> 
                        <Button style={{position:'fixed',top:100,left:50}} onClick={()=>navigate("../orders",{state:{token}})}><TbArrowBackUp  style={{ fontSize: 30 }}/></Button>
                    </div>
                        <button onClick={() => navigate(`../view`, { state: { uid, pid: data.pid,token } })} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                            <img src={data.image} alt="Product" style={{ width: 200, height: 200, marginBottom: 20 }} />
                        </button>
                        <div>
                            <p>{data.brandName}</p>
                            <p>{data.description}</p>
                            <p><strong>Size:</strong> {data.productSize}</p>
                            <p><b>{data.orderStatus}</b></p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>Order Id: {data.id} | Payment Id: {data.paymentId}</div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}> 
        {sameorder.length!==0?` Total Item Price: ${data.price + (data.paymentType === "COD" ? 20 : 0)} `:` Total Order Price: ${data.amount }`}
            
        </div>
        <div>
            <button onClick={() => setShowBreakup(!showBreakup)} style={{ cursor: 'pointer', color: '#dc3545', border: 'none', padding: '0', background: 'none' }}>View Breakup</button>
        </div>
    </div>
</div>



            {showBreakup && ( 
                <div className="backdrop" onClick={() => setShowBreakup(!showBreakup)}>
                <div className="card">
                    <div className="close-button" onClick={() => setShowBreakup(!showBreakup)}>
                        X
                    </div>
                    <h3>Payment Information</h3>
                    <div className="label-value">
                        <span className="label">MRP:</span>
                        <span className="value">{data.price}</span>
                    </div>
                    <div className="label-value">
                        <span className="label">{data.quantity}x{data.brandName} &nbsp; {data.description}:</span>
                        <span className="value">{data.quantity * data.price}</span>
                    </div>
                    {data.paymentType === "COD" &&
                        <div className="label-value">
                            <span className="label">Additional Charges:</span>
                            <span className="value">20</span>
                        </div>
                    }
                    <div className="label-value">
                        <span className="label">Total Paid:</span>
                        <span className="value">{data.quantity * data.price + (data.paymentType === "COD" ? 20 : 0)}</span>
                    </div> 
                    {data.orderStatus === "Accept Return" &&
                        <div className="label-value">
                            <span className="label">Amount Refunded:</span>
                            <span className="value">{data.quantity * data.price}</span>
                        </div>
                    }
                    <div className="label-value">
                        <span className="label">Payment Method:</span>
                        <span className="value">{data.paymentType}</span>
                    </div>
                </div>
            </div>
            
             
                
            )} 


            {showFullBreakUp && ( 
                 <div className="backdrop" onClick={() => setShowFullBreakUp(!showFullBreakUp)}>
                 <div className="card">
                     <div className="close-button" onClick={() => setShowFullBreakUp(!showFullBreakUp)}>
                         X
                     </div>
                     <h3>Payment Information</h3>
                     {original.map((item, index) => (
                         <div key={index} className="label-value">
                            
                             <span className="label">{item.quantity} X {item.brandName} &nbsp; {item.description}:</span>
                             <span className="value">{item.quantity * item.price}</span> 
                           
                             {item.orderStatus=="Accept Return" && 
                             <div className="refunded-section" > 
                             
                                
                             <span ><b> Amount Refunded :</b></span>
                             <span> {item.quantity * item.price}</span>
                             </div>
                             }
                         </div>
                     ))}
                     {data.paymentType === "COD" && 
                         <div className="label-value">
                             <span className="label">Additional Charges:</span>
                             <span className="value">20</span>
                         </div>
                     }
                     <div className="label-value">
                         <span className="label">Total Paid:</span>
                         <span className="value">{data.amount}</span>
                     </div>
                     <div className="label-value">
                         <span className="label">Payment Method:</span>
                         <span className="value">{data.paymentType}</span>
                     </div>
                 </div>
             </div>
             
                
            )}

            
            <div style={{ padding: '20px', borderRadius: '10px', marginBottom: '20px', textAlign: 'left' }}>
                <h6 style={{ marginBottom: '10px' }}>Sold By: <span>{data.shopName}</span></h6>  
                {data.orderStatus=="Delivered" &&  
                    <div> 
                          {isWithinNextSevenDays(data.deliveredDate) && 
                            <div style={{ display: 'flex', justifyContent: 'center',marginBottom:'20px'}}> 
                            <Button variant="outlined" color="error" style={{ width: '100%' }} onClick={()=>handleOrderedStatus(data.deliveredDate,data.orderid)}>Raise Return</Button>
                            </div> 
                        }
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button variant="outlined"  style={{ width: '100%' }} onClick={handleGeneratePDF}>Get Invoice</Button>
                        </div>  
                    </div>

                }
            </div>


            <div style={{ padding: '20px', borderRadius: '10px', marginBottom: '20px', textAlign: 'left' }}>
                <h6>Delivery Address</h6>
                <div style={{ marginBottom: '5px' }}>
                    <p style={{ margin: '0' }}>{data.name} || {data.mobile}</p>
                    <p style={{ margin: '0' }}>{data.address}, {data.city}, {data.state} - {data.pincode}.</p>
                </div>
            </div>



            {sameorder.length !== 0 && (
                <div style={{ padding: '20px', borderRadius: '10px', textAlign: 'left' }}>
                    <h4>Other items in this order</h4>
                    {sameorder.map((item, index) => (
                        <button key={index} style={{ width: '100%', border: 'none', background: 'none', padding: '0', margin: '0', cursor: 'pointer', display: 'block', marginBottom: '10px' }} onClick={() =>navigate(`../summary`, { state:{data:item,sameorder:original,uid} } ) }>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={item.image} alt="Product" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                <div style={{textAlign:'left',paddingLeft:20}}>
                                    <p>{item.brandName}</p>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        </button>
                    ))} 
                   
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
        Total Order Price: {data.amount + (data.paymentType === "COD" ? 20 : 0)}
        </div>
        <div>
            <button onClick={() => setShowFullBreakUp(!showBreakup)} style={{ cursor: 'pointer', color: '#dc3545', border: 'none', padding: '0', background: 'none' }}>View Breakup</button>
        </div>
    </div>
                </div>
            )}
        </div>
    );
};

import React, { useEffect, useState,useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js'; 
import logo from '../logo.png'
import QRCode from 'qrcode.react'; 
import { jsPDF } from 'jspdf';
import { useReactToPrint } from "react-to-print";
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export const Invoice = () => {
  const [data, setData] = useState({});
  const [vendor, setVendor] = useState({}); 
  const [encodedData, setEncodedData] = useState(''); 

  const qrCodeRef = useRef(null); 
  const contentRef = useRef(null); 

  const location=useLocation();
  const {token}=location.state;
  
  useEffect(() => {
    const sessionData = sessionStorage.getItem("data");
    const parsed = JSON.parse(sessionData);
    setData(parsed);
  }, []); 


  useEffect(() => {
    const fetchVendor = async () => {
      const request = await fetch(`https://localhost:7199/api/Vendor/Get Vendor/${data.vendorId}`,{
        headers: {
                    
          Authorization: `Bearer ${token}`,
        }, 
      });
      if (request.ok) {
        const response = await request.json();
        setVendor(response); 
       
      }
    }
    fetchVendor();
  }, [data]);

 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day}-${month}-${year}, ${hours}:${minutes} ${ampm}`;
  };

  function generateUniqueId() {
    const uuid = uuidv4();
    const combinedData = JSON.stringify({ data, uuid });
    const hexHash = CryptoJS.SHA256(combinedData).toString();
    let decimalId = parseInt(hexHash.substring(0, 12), 16);
    return String(decimalId);
  }
  


  useEffect(() => {
    
    try { 
        const encoded = encodeURIComponent(JSON.stringify(data));
        setEncodedData(encoded);
    } catch (error) {
        console.error('Error encoding data for QR code:', error);
        setEncodedData(''); 
    }
}, [data]);  

const handleQRCodeClick = () => {
  const content = contentRef.current;

  // Create a new instance of jsPDF with A4 size dimensions
  const doc = new jsPDF('p', 'pt', 'a4');

  // Function to add the image directly to the PDF
  const addImageToPDF = () => {
    

    // Render the rest of the content using html2canvas
    html2canvas(content, {
      scale: 1,
      windowWidth: content.offsetWidth,
      windowHeight: content.offsetHeight,
    }).then((canvas) => {
      const contentImgData = canvas.toDataURL('image/jpeg');

      // Add the image of the content to the PDF
      doc.addImage(contentImgData, 'JPEG', 0, 0, 595, 842); // Assuming A4 size

      // Save the PDF
      doc.save('invoice.pdf');
    }).catch((error) => {
      console.error('Error rendering content to canvas:', error);
      alert('Error rendering content to PDF. Please try again.');
    });
  };


  // Add the image directly to the PDF
  addImageToPDF();
};



  return (
    <div style={{ padding: 90 }}   ref={contentRef}> 
     <style>
        {`
          th, td {
            border-bottom: 1px solid black;
            padding: 16px;
          }
          
           
          
        `}
      </style>
      <center style={{ fontWeight: "bolder",fontSize:25 }}><b>Tax Invoice</b></center> 
      <br/><br/><br/>
      <div style={{ marginBottom: 50 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '50%' }}>
            <div style={{ textAlign: 'left' }}>
              <h6 >Order ID: <span style={{ fontWeight:'normal'}}>{data && data.id ? data.id.toString().padStart(5, '0') : 'N/A'} </span></h6>
              <h6>Order Date: <span   style={{ fontWeight:'normal'}}>{formatDate(data.date)} </span></h6>
             <h6>Payment Id:<span  style={{ fontWeight:'normal'}}> {data.paymentId} </span></h6>
              <h6>Payment Type: <span  style={{ fontWeight:'normal'}}> {data.paymentType} </span></h6>
            </div>
          </div>
          <div style={{ width: '50%' }}>
            <div style={{ textAlign: 'right' }}>
              <h6>Invoice ID: <span style={{ fontWeight:'normal'}}>{generateUniqueId()}</span></h6>
              <h6>Invoice Date: <span style={{ fontWeight:'normal'}}>{formatDate(data.date)}</span></h6>
              <h6>Place of Supply: <span style={{ fontWeight:'normal'}}>{data.state}</span></h6>
              <h6>Nature of Supply: <span style={{ fontWeight:'normal'}}>Goods</span></h6>
            </div>
          </div>
        </div>
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '45%' }}>
          <div style={{ textAlign: 'left' }}>
            <h5>Sold By:</h5>
            <p style={{ marginBottom: '5px' }}>{vendor.shopName},</p>
            <p style={{ marginBottom: '5px' }}>{vendor.address},</p>
            <p style={{ marginBottom: '5px' }}>{vendor.city},{vendor.state}-{vendor.pincode}</p>
          </div>

          </div>
          <div style={{ width: '45%' }}>
            <div style={{ textAlign: 'left' }}>
              <h5>Shipping Address:</h5>
             
              <p style={{ marginBottom: '5px' }}>{data.name} - {data.mobile} </p> 
                          
              <p style={{ marginBottom: '5px' }}>{data.address},</p>
              <p style={{ marginBottom: '5px' }}>{data.city},{data.state}-{data.pincode}</p>
             
            </div>
          </div> 
          <div style={{ width: '10%' }}>
           <QRCode 
           value={encodedData}  
          onClick={handleQRCodeClick} />     
          </div>
        </div> 
        <hr/>
        <div style={{ marginBottom: 50 }}>
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
       
        <th >Brand</th>
        <th >Description </th>
        <th >Quantity</th>
        <th>Gross Amount</th>
        <th >Total</th>
      </tr>
    </thead>
    <tbody>
      
      <tr >
       
        <td >{data.brandName}</td>
        <td >{data.description}</td>
        <td >{data.quantity}</td>
        <td >{data.price}</td>
        <td >{data.quantity * data.price}</td>
      </tr>  
      {data.paymentType=="COD" && 
      <tr > 
        <td colSpan='1'> </td>
        <td >COD Charges</td> 
        <td>1</td>
        <td>20</td>
        <td >20</td>
      </tr> }

      <tr>
        <td colSpan="4" style={{ textAlign: 'right', padding: 8 }}><b>Total Price:</b></td>
        <td style={{ borderBottom: '1px solid black', padding: 8 }}>{(data.quantity * data.price) + (data.paymentType === 'COD' ? 20 : 0)}
       <br/> All values are in INR</td>
      </tr>
      
    </tbody>
  </table>  
  
</div> 
<div style={{textAlign:'left'}}>
<b>Declaration</b>
  <br/>
  <p>The goods sold are intended for end user consumption and not for resale.</p>
</div> 
<hr/>

<div style={{ marginBottom: 50 }}>
  
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    
    <div style={{ width: '50%' ,textAlign:'left'}}>
      <h6  style={{fontWeight:'bold'}}>Registered Address:</h6>
      <p>Savadika Private Retail limited,1st floor,Building no:355,Connaught Place,New Delhi,Delhi - 110001</p>
    </div>
    
    <div style={{ width: '50%' }}>
      <p>Purchase Made On:</p>
      
      
      <img src={logo} alt="instamart" style={{ width: 100, height: 100 }} />
    </div>
  </div>
</div> 
<hr/>




      </div>
    </div>
  );
};

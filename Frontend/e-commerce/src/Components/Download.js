import React, { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode.react';
import logo from '../logo.png';

export const Download = ({ data, onPDFGenerated }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!data) return;

   
const generatePDF = () => {
  const content = contentRef.current;

  // Create a new instance of jsPDF with A4 size dimensions
  const doc = new jsPDF('p', 'pt', 'a4');

  // Function to add the image directly to the PDF
  const addImageToPDF = (imageUrl) => {
    doc.addImage(imageUrl, 'JPEG', 20, 20, 100, 100); // Adjust position and size as needed

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

  // Log the image URL to verify correctness
  console.log('Image URL:', data.image);

  // Add the image directly to the PDF
  addImageToPDF(data.image);
};




    generatePDF();
  }, [data, onPDFGenerated]);

  return (
    <div style={{ display: 'none' }} ref={contentRef}>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Tax Invoice</h1>
        <div style={{ marginBottom: '20px' }}>
         
          {/* Add more data fields as needed */}
        </div>
        <hr style={{ margin: '20px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <p><b>Sold by:</b> Company Name</p>
            <p><b>Address:</b> Address of the company</p>
          </div>
          <div>
            <p><b>Shipping address:</b> Customer Address</p>
          </div>
          <div>
            <QRCode value={'sample_encoded_data'} />
          </div>
        </div>
        <hr style={{ margin: '20px 0' }} />
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Item 1</td>
              <td>1</td>
              <td>$10</td>
              {/* Add more table rows as needed */}
            </tr>
          </tbody>
        </table>
        <div style={{ textAlign: 'left' }}>
          <b>Declaration</b>
          <p>The goods sold are intended for end user consumption and not for resale.</p>
        </div>
        <hr style={{ margin: '20px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h6 style={{ fontWeight: 'bold' }}>Registered Address:</h6>
            <p>Savadika Private Retail limited, 1st floor, Building no: 355, Connaught Place, New Delhi, Delhi - 110001</p>
          </div>
          <div>
            <p>Purchase Made On:</p>
           
          </div>
        </div>
        <hr style={{ margin: '20px 0' }} />
      </div>
    </div>
  );
};

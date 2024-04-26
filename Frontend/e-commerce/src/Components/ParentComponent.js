import React, { useState } from 'react';

const ParentComponent = () => {
  const [pdfData, setPdfData] = useState(null);
  const jsonData = { name: 'surya', age: 22 };

  const handlePDFGenerated = (data) => {
    setPdfData(data);
  };

  const handleDownloadPDF = () => {
    if (pdfData) {
      downloadPDF(pdfData);
    } else {
      console.error('PDF data is not available.');
    }
  };

  const downloadPDF = (pdfData) => {
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoice.pdf';
    a.click();
  };
  

  return (
    <div>
      {!pdfData && (
        <Download data={jsonData} onPDFGenerated={handlePDFGenerated} />
      )}
      {pdfData && (
        <button onClick={handleDownloadPDF}>Download PDF</button>
      )}
    </div>
  );
};
 

const Download = ({ data, onPDFGenerated }) => {
  // Simulate PDF generation using the provided data
  const generatePDF = (data) => {
    // Replace this with your actual PDF generation logic
    const dummyPdfData = `PDF Data for ${data.name}, Age: ${data.age}`;
    onPDFGenerated(dummyPdfData);
  };

  // Call generatePDF when component mounts
  React.useEffect(() => {
    generatePDF(data);
  }, [data]);

  return null; // Render nothing
};

export default ParentComponent;

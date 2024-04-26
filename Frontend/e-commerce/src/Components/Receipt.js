import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
 
const Receipt = () => {
  const [billData, setBillData] = useState(null); 
  let [busData, setBusData] = useState(null); 
  const [touristData, setTouristData] = useState(null); 
  const contentRef = useRef(null);
  const nav = useNavigate();
 
  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;
 
  const printReceipt = useReactToPrint({
    content: () => contentRef.current,
  });
 
  const bill = async () => {
    const bookingId = localStorage.getItem("bookingId");
    const receiptData = await axios
      .get(`https://localhost:7127/api/Bookings/${bookingId}`)
      .then(async (res) => {
        setBillData(res.data);
 
        await axios
          .get(`https://localhost:7127/api/Signups/${res.data.signupId}`)
          .then((res2) => {
            setTouristData(res2.data);
          })
          .catch((err) => {
            console.log(err);
          });
 
        await axios
          .get(`https://localhost:7127/api/Buses/${res.data.busId}`)
          .then((res3) => {
            setBusData(res3.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
 
  useEffect(() => {
    const allFunc = async () => {
      bill();
    };
    allFunc();
  }, []);
 
  return (
<>
      {billData && touristData && busData ? (
<div className="container mt-4 container-form">
<div className="card">
<div className="card-body">
<div
                className="container content my-3 mt-5"
                ref={contentRef}
                style={{ marginBottom: "100px", marginTop: "0px" }}
>
<div className="row">
<div className="col-lg-12">
<div className="card">
<div className="card-body">
<div className="invoice-title">
<h4 className="float-end font-size-15">
                            Invoice{" "}
<span className="badge bg-success font-size-12 ms-2">
                              Paid
</span>
</h4>
<div className="mb-4">
<h2 className="mb-1 text-muted">RedBus</h2>
</div>
<div className="text-muted">
<p className="mb-1">
<i className="uil uil-envelope-alt me-1"></i>{" "}
                              redbusapp@gmail.com
</p>
<p>
<i className="uil uil-phone me-1"></i> 9182169738
</p>
</div>
</div>
 
                        <hr className="my-4"></hr>
 
                        <div className="row">
<div className="col-sm-6">
<div className="text-muted">
<h5 className="font-size-16 mb-3">Billed To:</h5>
<h5 className="font-size-15 mb-2">
                                {touristData.firstName +
                                  " " +
                                  touristData.lastName}
</h5>
<p className="mb-1">{touristData.email}</p>
<p>{touristData.phoneNumber}</p>
</div>
</div>
<div className="col-sm-6">
<div className="text-muted text-sm-end">
<div className="mt-3">
<h5 className="font-size-15 mb-1">
                                  Invoice Date:
</h5>
<h5>
<p>{date}</p>
</h5>
</div>
<div className="mt-4">
<h5 className="font-size-15 mb-1">Bus Name</h5>
<h5>
<p>{busData.busName}</p>
</h5>
</div>
<div className="mt-4">
<h5 className="font-size-15 mb-1">Bus Number</h5>
<h5>
<p>{busData.busNumber}</p>
</h5>
</div>
</div>
</div>
</div>
 
                        <div className="py-2">
<h5 className="font-size-15">Booking Details</h5>
<div className="table-responsive">
<table className="table align-middle table-nowrap table-centered mb-0">
<thead>
<tr>
<th style={{ width: "70px" }}>No.</th>
<th>bookingId</th>
<th>Source</th>
<th>Destination</th>
<th>Boarding Time</th>
<th>Category</th>
<th>No.of Seats</th>
<th>SeatNumbers</th>
<th>Total Fare</th>
<th>Status</th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<th scope="row">01</th>
<td>
<div>
<h5 className="text-truncate font-size-14 mb-1">
                                        {billData.bookingId}
</h5>
</div>
</td>
<td>{busData.source}</td>
<td>{busData.destination}</td>
<td>{busData.arrivalTime}</td>
<td>{busData.category}</td>
<td>{billData.numberOfSeats}</td>
<td>{billData.selectedSeat}</td>
<td>{billData.totalFare}</td>
<td>{billData.status}</td>
</tr>
</tbody>
</table>
</div>
<div className="d-print-none mt-4">
<div className="float-end">
<button className="btn btn-success me-1">
<i className="fa fa-print"></i>
</button>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div style={{ paddingLeft: "110px" }}>
<button
              className="btn btn-primary my-3"
              onClick={printReceipt}
              style={{ marginRight: "20px" }}
>
              Print
</button>
<button className="btn btn-primary my-4" onClick={() => nav(-1)}>
              Cancel
</button>
</div>
</div>
      ) : (
<p
          style={{
            marginLeft: "400px",
            marginTop: "100px",
            color: "black",
            fontSize: "30px",
            fontWeight: "600",
          }}
>
          Loading...
</p>
      )}
</>
  );
};
 
export default Receipt;
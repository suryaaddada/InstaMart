
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Signup } from './Components/Signup';
import { Nav } from './Components/Nav';
import { Login } from './Components/Login';
import { UserBar } from './Components/UserBar';
import {AdminBar} from './Components/AdminBar';
import { VendorBar } from './Components/VendorBar';
import { Error } from './Components/Error';
import { VendorPage } from './Components/VendorPage';
import { VendorProfile } from './Components/VendorProfile';
import { Vendor } from './Components/Vendor';
import { VendorPassword } from './Components/VendorPassword';
import { VProduct } from './Components/VProduct';
import { AddProduct } from './Components/AddProduct';
import { MyComponent } from './Components/MyComponent';
import { UserPage } from './Components/UserPage';
import { User } from './Components/User';
import { UserProfile } from './Components/UserProfile';
import { UserPassword } from './Components/UserPassword';
import { Orders } from './Components/Orders';
import { SavedAddress } from './Components/SavedAddress';
import { AddShipping } from './Components/AddShipping';
import { AdminPage } from './Components/AdminPage';
import { Admin } from './Components/Admin';
import { AdminProfile } from './Components/AdminProfile';
import { AdminPassword } from './Components/AdminPassword';
import { ViewProduct } from './Components/ViewProduct';
import { Wishlist } from './Components/Wishlist';
import { Cart } from './Components/Cart';
import { Buy } from './Components/Buy';
import { Acc } from './Components/Acc';
import { PayPAl } from './Components/PayPal';
import { ViewMultipleProducts } from './Components/ViewMultipleProducts';
import Search from './Components/Search';
import { OrderSummary } from './Components/OrderSummary';
import { Invoice } from './Components/Invoice';
import ParentComponent from './Components/ParentComponent';
import { BrandProduct } from './Components/BrandProduct';

import { VendorApproval } from './Components/VendorApproval';
import { SpecificVendor } from './Components/SpecificVendor';
import { AdminProduct } from './Components/AdminProduct';
import { ForgetPassword } from './Components/ForgetPassword';
import { AdminOrders } from './Components/AdminOrders';
import { ProtectedRoute } from './ProtectedRoute';
import {Get} from './Practice/Get';




function App() { 
  
  return (
    <div className="App">
     <Routes>


     <Route path="nav"  element={<Nav/>}/>   
      <Route path="check" element={<MyComponent/>}/> 
      <Route path="acc" element={<Acc/>}/> 
      <Route path="paypal" element={<PayPAl/>}/> 
      <Route path="searched" element={<Search/>}/>  
      <Route path='parent' element={<ParentComponent/>}/> 
      <Route path='practice' element={<Get/>}/>


      <Route path="register" element={<Signup/>} />  
      <Route path="forgot" element={<ForgetPassword/>}/>

     <Route path="/" element={<UserBar/>} >      {/*  jwt */}
        <Route path="" element={<UserPage/>}/> {/*Route  */}   {/*  jwt */}
        <Route path="User" element={<User/>}/>    {/*  jwt */}
        <Route path="uprofile" element={<UserProfile/>}/>    {/*  jwt */}
        <Route path="upassword" element={<UserPassword/>}/>   {/*  jwt */}
        <Route path="orders" element={<Orders/>}/>              {/*  jwt */}                   
        <Route path='summary' element={<OrderSummary/>}/>            {/*  jwt */}    
        <Route path="address" element={<SavedAddress/>}/>     {/*  jwt */}
        <Route path="add" element={<AddShipping/>}/>       {/*  jwt */}
        <Route path="view" element={<ViewProduct/>}/>    {/*Route  */}   {/*  jwt */}
         <Route path="wishlist" element={<Wishlist/>}/>  {/*  jwt */}
        <Route path="cart" element={<Cart/>}/>           {/*  jwt */}
        <Route path="buy" element={<Buy/>} />       {/*  jwt */}
        <Route path="search" element={<ViewMultipleProducts/>}/>   {/*Route  */}
        <Route path="invoice" element={<Invoice/>}/>    {/*  jwt */}
        <Route path="brand" element={<BrandProduct/>}/>

     </Route> 

     {/* <Route path="/" element={<UserBar/>} >      
        <Route path="" element={<UserPage/>}/> 
        <Route path="User" element={<ProtectedRoute><User/></ProtectedRoute>}/>
        <Route path="uprofile" element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>
        <Route path="upassword" element={<ProtectedRoute><UserPassword/></ProtectedRoute>}/>
        <Route path="orders" element={<ProtectedRoute><Orders/></ProtectedRoute>}/>                               
        <Route path='summary' element={<ProtectedRoute><OrderSummary/> </ProtectedRoute>}/>              
        <Route path="address" element={<ProtectedRoute><SavedAddress/></ProtectedRoute>}/> 
        <Route path="add" element={<ProtectedRoute><AddShipping/></ProtectedRoute>}/> 
        <Route path="view" element={<ViewProduct/>}/>   
        <Route path="wishlist" element={<ProtectedRoute><Wishlist/></ProtectedRoute>}/>  
        <Route path="cart" element={<ProtectedRoute><Cart/></ProtectedRoute>}/>  
        <Route path="buy" element={<ProtectedRoute><Buy/></ProtectedRoute>} />  
        <Route path="search" element={<ViewMultipleProducts/>}/>  
        <Route path="invoice" element={<ProtectedRoute><Invoice/></ProtectedRoute>}/> 
        <Route path="brand" element={<ProtectedRoute><BrandProduct/> </ProtectedRoute>}/>

     </Route>  */}
       
      
      {/* <Route path="/log" element={<ProtectedRoute><Login/> </ProtectedRoute>} > */}
      <Route path="/log" element={<Login/> } >
     
              {/* <Route path="userbar" element={<UserBar/>}>
                    <Route path="" element={<UserPage/>}/>
                    <Route path="User" element={<User/>}/>
                    <Route path="uprofile" element={<UserProfile/>}/>
                    <Route path="upassword" element={<UserPassword/>}/>
                    <Route path="orders" element={<Orders/>}/>
                       
                   
                    <Route path='summary' element={<OrderSummary/>}/>
                        
                    
                    <Route path="address" element={<SavedAddress/>}/> 
                    <Route path="add" element={<AddShipping/>}/> 
                    <Route path="view" element={<ViewProduct/>}/> 

                    <Route path="wishlist" element={<Wishlist/>}/>  

                    <Route path="cart" element={<Cart/>}/>  
                    <Route path="buy" element={<Buy/>} />  
                    <Route path="search" element={<ViewMultipleProducts/>}/>  

                    <Route path="invoice" element={<Invoice/>}/> 
                    <Route path="brand" element={<BrandProduct/>}/>
                  

                    
                   

              </Route>  */}

              <Route path='adminbar' element={<AdminBar/>} >    {/*  jwt */}
                <Route path="" element={<AdminPage/>}/> 
                <Route path="approvals" element={<VendorApproval/>}/>   {/*  jwt */}
                <Route path="Admin" element={<Admin/>}/>    {/*  jwt */}
                <Route path="aprofile" element={<UserProfile/>}/>  {/*  jwt */}
               
                <Route path="apassword" element={<UserPassword/>}/>     {/*  jwt */}
                <Route path='vendor' element={<SpecificVendor/>}/>   {/*  jwt */}
                <Route path="product" element={<AdminProduct/>}/>    {/*  jwt */}
                <Route path="orders" element={<AdminOrders/>}/>    {/*  jwt */}

              </Route>

              <Route path="vendorbar"  element={<VendorBar/>}>  {/*  jwt */}
                    <Route path="" element={<VendorPage/>}/>  {/*  jwt */}
                    <Route path="AddProduct" element={<AddProduct/>}/>   {/*  jwt */}
                    <Route path="VProduct" element={<VProduct/>}/>  {/*  jwt */}
                    <Route path="vendor" element={<Vendor/>}/>   {/*  jwt */}
                    <Route path="vprofile" element={<VendorProfile/>}/> {/*  jwt */}
                    <Route path="vpassword" element={<VendorPassword/>}/>   {/*  jwt */}

                    <Route path='search' element={<ViewMultipleProducts/>}/>
                    


                

              </Route>
      </Route>  

      <Route path="*"  element={<Error/>}/>
     </Routes>
    </div>
  );
}

export default App;

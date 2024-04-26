import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login } from './Components/Login';

export const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    const loginStatus = sessionStorage.getItem('isLoggedIn');
    const string = sessionStorage.getItem("UToken");
    const parsed = JSON.parse(string);

    if (loginStatus) {
      console.log("Login Success")
      setLogin(true);
      setUser(parsed.role);
      console.log(user);
    } else {
      console.log('invoked')
      navigate('/log');
    }
  }, [navigate]);

  
  if (login) {
    if (user == "User") {
     
      navigate(-1);
      return null; 
       
    } else {
     
      return children;
    }
  } else {
    
    return <Login />;
  }
};

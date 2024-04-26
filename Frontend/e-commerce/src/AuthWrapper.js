import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login } from './Components/Login';



const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    
    const loginStatus = sessionStorage.getItem('isLoggedIn');

    if (loginStatus)
    {
      setIsAuthorized(true);
    } else {
   
      navigate('/log');
    }
  }, [navigate]);

  return isAuthorized ? children: <Login/>;
};

export default AuthWrapper;
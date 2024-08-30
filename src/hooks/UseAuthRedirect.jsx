

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {   
    console.log('entro al effect');
    const user = sessionStorage.getItem('user');

    if (!user) {
      console.log('Redireccionando');
      navigate('/login'); 
    }
  }, [navigate]);

};




import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if the user is authenticated

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/auth" />;
};

export default PrivateRoute;
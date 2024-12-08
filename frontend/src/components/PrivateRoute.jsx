import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/auth" />;
};

export default PrivateRoute;


// const PrivateRoute = ({component: Component, ...rest }) => {
//   const isAuthenticated = !!localStorage.getItem('token');
//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         isAuthenticated ? (
//           <Component {...props} />
//         ) : (
//           <Navigate to="/auth" />
//         )
//       }
//     />
//   );
// };

// export default PrivateRoute;
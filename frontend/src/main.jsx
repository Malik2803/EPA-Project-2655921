import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, Flex, Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './AuthPage';
import HomePage from './HomePage';
import Reports from './Reports';
import Notifications from './Notifications';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';

const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<PrivateRoute component={HomePageWithSidebar} />} />
        <Route path="/reports" element={<PrivateRoute component={ReportsWithSidebar} />} />
        <Route path="/notifications" element={<PrivateRoute component={NotificationsWithSidebar} />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
};

const HomePageWithSidebar = () => (
  <Flex>
    <Sidebar />
    <Box ml="250px" p="4" flex="1">
      <HomePage />
    </Box>
  </Flex>
);

const ReportsWithSidebar = () => (
  <Flex>
    <Sidebar />
    <Box ml="250px" p="4" flex="1">
      <Reports />
    </Box>
  </Flex>
);

const NotificationsWithSidebar = () => (
  <Flex>
    <Sidebar />
    <Box ml="250px" p="4" flex="1">
      <Notifications />
    </Box>
  </Flex>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <Main />
    </ChakraProvider>
  </React.StrictMode>
);

export default Main;
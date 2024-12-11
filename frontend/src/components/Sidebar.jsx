import React from 'react';
import { Link } from 'react-router-dom';
import { Box, VStack, Text } from '@chakra-ui/react';

const Sidebar = () => {
  return (
    <Box w="250px" p="4" bg="gray.100" h="100vh" position="fixed">
      <VStack align="start" spacing="4">
        <Text fontSize="2xl" fontWeight="bold">My App</Text>
        <Link to="/">
          <Text fontSize="lg">Dashboard</Text>
        </Link>
        <Link to="/reports">
          <Text fontSize="lg">Reports</Text>
        </Link>
        <Link to="/notifications">
          <Text fontSize="lg">Notifications</Text>
        </Link>
      </VStack>
    </Box>
  );
};

export default Sidebar;
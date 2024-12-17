import React, { useEffect, useState } from 'react';
import{ Box, Text, Table, Thead, Tbody, Tr,  Th, Td, Button, useToast } from '@chakra-ui/react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Replace with actual user ID retrieval logic
        if (!userId) {
          throw new Error('User ID not found in local storage');
        }
        console.log('User ID:', userId); // Log the user ID
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/notifications/${userId}`, {
          method: 'GET', // Ensure the correct HTTP method is used
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('API response:', data); // Log the API response
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch notifications');
        }
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          throw new Error('API response is not an array');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: 'An error occurred.',
          description: error.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    };

    fetchNotifications();
  }, [toast]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5000/api/notifications/${notificationId}`, {
        method: 'DELETE', // Ensure the correct HTTP method is used
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'An error occurred.',
        description: error.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>Notifications</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Message</Th>
            <Th>Status</Th>
            <Th>Sent At</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {notifications.map((notification) => (
            <Tr key={notification.id}>
              <Td>{notification.message}</Td>
              <Td>{notification.status}</Td>
              <Td>{new Date(notification.created_at).toLocaleString()}</Td>
              <Td>
                <Button colorScheme="blue" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                  Mark as Read
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Notifications;
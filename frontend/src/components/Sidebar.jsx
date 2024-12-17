import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, VStack, Text, useColorModeValue, Flex, Icon, Spacer } from '@chakra-ui/react';
import { MdOutlineDashboard } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { IoIosNotifications } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";

const Sidebar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  const handleSetActive = (path) => {
    setActive(path);
  };

  const bgColor = useColorModeValue("gray.200", "gray.700");
  const activeBgColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Box w="250px" p="4" bg={bgColor} h="100vh" position="fixed">
      <VStack align="start" spacing="6" height="100%">
        <Text fontSize="35" fontWeight="bold">FSC System</Text>
        <Flex
          as={Link}
          to="/home"
          align="center"
          p="2"
          borderRadius="md"
          bg={active === '/home' ? activeBgColor : "transparent"}
          onClick={() => handleSetActive('/home')}
          _hover={{ bg: activeBgColor }}
        >
          <Icon as={MdOutlineDashboard} boxSize="6" mr="3" />
          <Text fontSize="lg">Dashboard</Text>
        </Flex>
        <Flex
          as={Link}
          to="/reports"
          align="center"
          p="2"
          borderRadius="md"
          bg={active === '/reports' ? activeBgColor : "transparent"}
          onClick={() => handleSetActive('/reports')}
          _hover={{ bg: activeBgColor }}
        >
          <Icon as={TbReportAnalytics} boxSize="6" mr="3" />
          <Text fontSize="lg">Reports</Text>
        </Flex>
        <Flex
          as={Link}
          to="/notifications"
          align="center"
          p="2"
          borderRadius="md"
          bg={active === '/notifications' ? activeBgColor : "transparent"}
          onClick={() => handleSetActive('/notifications')}
          _hover={{ bg: activeBgColor }}
        >
          <Icon as={IoIosNotifications} boxSize="6" mr="3" />
          <Text fontSize="lg">Notifications</Text>
        </Flex>
        <Spacer />
        <Flex
          as={Link}
          to="/settings"
          align="center"
          p="2"
          borderRadius="md"
          bg={active === '/settings' ? activeBgColor : "transparent"}
          onClick={() => handleSetActive('/settings')}
          _hover={{ bg: activeBgColor }}
        >
          <Icon as={IoIosSettings} boxSize="6" mr="3" />
          <Text fontSize="lg">Settings</Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Sidebar;
import { Box, Button, Container, Flex, Text, useColorMode, useColorModeValue, Image } from "@chakra-ui/react";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";
import CreateTaskModal from "./CreateTaskModal";
import FilterModal from "./FilterModal";

const Navbar = ({ tasks,setTasks, setFilters }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';  // Redirect to the login page
  };

  return (
    <Container maxW={"1200px"}>
      <Box px={4} my={4} borderRadius={5} bg={useColorModeValue("gray.200", "gray.700")}>
        <Flex h="16" alignItems={"center"} justifyContent={"space-between"}>
          <Flex alignItems={"center"} justifyContent={"center"} gap={6} display={{ base: "none", sm: "flex" }}>
            <Image src="/logo.svg" alt="FSC Logo" boxSize="90px" />
            <Text fontSize={"lg"} fontWeight={500} display={{ base: "none", md: "block" }}>
							Welcome to FSC System
						</Text>
          </Flex>
          <Flex gap={3} alignItems={"center"}>
            <CreateTaskModal setTasks={setTasks} tasks={tasks} />
            <FilterModal setFilters={setFilters} />
            <Button> <IoIosNotifications size={20} /> </Button>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <IoMoon /> : <LuSun size={20} />}
            </Button>
            <Button colorScheme={"blue"} onClick={logout}>Logout</Button>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
};

export default Navbar;
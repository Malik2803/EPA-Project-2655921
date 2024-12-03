import { Box, Button, Container, Flex, Text, useColorMode, useColorModeValue} from "@chakra-ui/react";
import { IoMoon} from "react-icons/io5";
import {LuSun} from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";
import CreateTaskModal from "./CreateTaskModal";

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    return  (
    <Container maxW={"900px"}>
        <Box
            px={4}
            my={4}
            borderRadius={5}
            bg = {useColorModeValue("gray.200","gray.700")}
        >
            <Flex h="16"
                alignItems = {"center"}
                justifyContent = {"space-between"}
                >
                <Flex
                    alignItems={"center"}
                    justifyContent={"center"}
                    gap={6}
                    display={{base: "none", sm: "flex"}}
                >
                    <Box>Home</Box>
                    <Box>Dashboard</Box>
                    <Box>Help</Box>
                </Flex>
                <Flex gap={3} alignItems={"center"}>
                    <Text fontSize={"lg"} fontWeight ={500} display={{base: "none", md: "block"}}>
          
                    </Text>
                        <CreateTaskModal />
                        <Button> <IoIosNotifications size={20} /> </Button>
                        <Button onClick = {toggleColorMode}>
                        {colorMode === "light" ? <IoMoon /> : <LuSun size={20} />}
                        </Button>
                        <Button colorScheme={"blue"}>Logout</Button>
                
 
                </Flex>
            </Flex>
        </Box>
    </Container>
    );
};

export default Navbar;
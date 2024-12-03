import {Stack, Container } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import TaskGrid from "./components/TaskGrid";

function HomePage() {
  return (
    <Stack minH={"100vh"}>
      <Navbar />
      <Container maxW={"1200px"} my={4}>

        <TaskGrid />
      </Container>
    </Stack>
  );
}

export default HomePage;


import {Stack, Container } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import TaskGrid from "./components/TaskGrid";
import {useState} from 'react';

export const BASE_URL = "http://localhost:5000/api";

function HomePage() {
    const [tasks, setTasks] = useState([]);
    return (
        <Stack minH={"100vh"}>
            <Navbar setTasks={setTasks} />
            <Container maxW={"1200px"} my={4}>
            <TaskGrid tasks={tasks} setTasks={setTasks} />
      </Container>
    </Stack>
  );
}

export default HomePage;


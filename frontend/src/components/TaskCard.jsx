import React from 'react';
import { Card, CardBody, CardHeader, Heading, Text, Badge, Stack, Flex, IconButton, useToast } from '@chakra-ui/react';
import { BiTrash } from "react-icons/bi";
import EditModal from './EditModal';
import { BASE_URL } from "../HomePage";

const TaskCard = ({ task, setTasks }) => {
  const toast = useToast();

  // Function to delete task
  const handleDeleteUser = async () => {
    try {
      const response = await fetch(BASE_URL + "/tasks/" + task.id, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
      toast({
        title: "Task deleted.",
        description: "Task has been deleted successfully.",
        status: "success",
        duration: 4000,
        position: "bottom-centre",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 4000,
        position: "bottom-centre",
        isClosable: true,
      });
    }
  };

  // Function to format date and time to dd/mm/yy hh:mm
  const formatDateTime = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString('en-GB', options).replace(',', '');
  };

  return (
    <Card>
      <CardHeader>
        <Flex gap={4}>
          <Flex flex={"1"} gap={"4"} alignItems={"center"}>
            <Stack spacing={1}>
              <Heading as="h3" size="md">
                {task.title}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                ID: {task.id}
              </Text>
            </Stack>
          </Flex>
          <Flex>
            <EditModal task={task} setTasks={setTasks} />
            <IconButton
              variant="ghost"
              colorScheme="red"
              size="sm"
              aria-label="Delete Task"
              icon={<BiTrash size={20} />}
              onClick={handleDeleteUser}
            />
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack spacing={3}>
          <Text>{task.description}</Text>
          <Flex gap={2} alignItems="center">
            <Badge colorScheme={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}>
              {task.priority} Priority
            </Badge>
            <Badge colorScheme={task.status === 'In Progress' ? 'blue' : task.status === 'Pending' ? 'orange' : task.status === 'Complete' ? 'green' : 'red'}>
              {task.status}
            </Badge>
          </Flex>
          <Flex gap={15}>
            <Text>
              <strong>Assignee:</strong> {task.assignee}
            </Text>
            { <Text>
              <strong>Team:</strong> {task.team}
            </Text>}
          </Flex>
          <Flex gap={2}>
            <Text>
                <strong>Start:</strong> {formatDateTime(task.start_date)}
            </Text>
            <Text>
                <strong>End:</strong> {formatDateTime(task.end_date)}
            </Text>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default TaskCard;
import { Card, CardBody, CardHeader, Heading, Text, Badge, Stack, Flex, IconButton } from '@chakra-ui/react';
import { BiTrash } from "react-icons/bi";
import EditModal from './EditModal';

const TaskCard = ({ task }) => {
  return (
    <Card>
      <CardHeader>
        <Flex gap={4}> 
            <Flex flex={"1"} gap={"4"} alignItems={"center"}>
            <Heading as="h3" size="md">
                {task.title}
            </Heading>
            </Flex>
            <Flex>
            <EditModal/>
            <IconButton
                variant="ghost"
                colorScheme="red"
                size="sm"
                aria-label="Delete Task"
                icon={<BiTrash size={20} />}
            />
            </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack spacing={3}>
          <Text>{task.description}</Text>
          <Text>
            <strong>Assignee:</strong> {task.assignee}
          </Text>
          <Text>
            <strong>Start Date:</strong> {task.startDate}
          </Text>
          <Text>
            <strong>End Date:</strong> {task.endDate}
          </Text>
          <Badge colorScheme={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'yellow' : 'green'}>
            {task.priority}
          </Badge>
          <Badge colorScheme={task.status === 'In Progress' ? 'blue' : task.status === 'Pending' ? 'orange' : task.status === 'Complete' ? 'green' : 'red'}>
            {task.status}
          </Badge>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default TaskCard;
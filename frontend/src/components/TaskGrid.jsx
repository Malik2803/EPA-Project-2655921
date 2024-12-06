import { useEffect, useState } from 'react';
import { Grid, Flex, Spinner, Text } from '@chakra-ui/react';
import TaskCard from './TaskCard';
import PropTypes from 'prop-types';
import {BASE_URL} from "../HomePage";

const TaskGrid = ({ tasks, setTasks }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await fetch(BASE_URL + "/tasks");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        setTasks(data);
      } catch (error) {
        console.error(error);
      } finally {
        // Add a delay of 1 second before setting isLoading to false
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };
    getTasks();
  }, [setTasks]);

  return (
    <>
      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" height="80vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap={4}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} setTasks={setTasks} />
          ))}
        </Grid>
      )}
      {!isLoading && tasks.length === 0 && (
        <Flex justifyContent={"center"}>
            <Text fontSize={"xl"}>
                <Text as={"span"} fontSize={"2xl"} fontWeight={"bold"} mr={2}>
                    No tasks found
                </Text>
            </Text>
        </Flex>
        )}
    </>
  );
};

TaskGrid.propTypes = {
  tasks: PropTypes.array.isRequired,
  setTasks: PropTypes.func.isRequired,
};

export default TaskGrid;
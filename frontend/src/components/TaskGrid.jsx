import React, { useEffect, useState } from 'react';
import { Grid, Flex, Spinner, Text, useToast } from '@chakra-ui/react';
import TaskCard from './TaskCard';
import PropTypes from 'prop-types';
import { BASE_URL } from '../HomePage';

const TaskGrid = ({ tasks, setTasks, filters }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Token is missing");
        }
        console.log("Token:", token);  // Debugging log
        const response = await fetch(BASE_URL + "/tasks", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("Response status:", response.status);  // Debugging log
        const data = await response.json();
        console.log("Response data:", data);  // Debugging log
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch tasks");
        }
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };
    getTasks();
  }, [setTasks]);

  const filteredTasks = tasks.filter(task => {
    const matchesPriority = filters.priority ? task.priority === filters.priority : true;
    const matchesStatus = filters.status ? task.status === filters.status : true;
    const matchesTaskName = filters.taskName ? task.title.toLowerCase().includes(filters.taskName.toLowerCase()) : true;
    const matchesStartDate = filters.startDate ? new Date(task.start_date) >= new Date(filters.startDate) : true;
    const matchesEndDate = filters.endDate ? new Date(task.end_date) <= new Date(filters.endDate) : true;
    const matchesTeam = filters.team ? task.team === filters.team : true;
    const matchesAssignee = filters.assignee ? task.assignee === filters.assignee : true;
    return matchesPriority && matchesStatus && matchesTaskName && matchesStartDate && matchesEndDate && matchesTeam && matchesAssignee;
  });


  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <Flex justifyContent="center">
       <Text fontSize={"xl"}>
                <Text as={"span"} fontSize={"2xl"} fontWeight={"bold"} mr={2}>
                    No tasks found
                </Text>
            </Text>
      </Flex>
    );
  }

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
      {filteredTasks.map(task => (
        <TaskCard key={task.id} task={task} setTasks={setTasks}/>
      ))}
    </Grid>
  );
};

export default TaskGrid;
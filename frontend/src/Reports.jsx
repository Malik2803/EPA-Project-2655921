import React, { useState, useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Checkbox, Button, useToast, Flex } from '@chakra-ui/react';
import { BASE_URL } from './HomePage';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/tasks`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch tasks');
        }
        setTasks(data);
      } catch (error) {
        toast({
          title: 'An error occurred.',
          description: error.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    };

    fetchTasks();
  }, [toast]);

  const handleSelectTask = (taskId) => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(taskId)
        ? prevSelectedTasks.filter((id) => id !== taskId)
        : [...prevSelectedTasks, taskId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((task) => task.id));
    }
    setSelectAll(!selectAll);
  };

  const handleExport = () => {
    const selectedTaskData = tasks.filter((task) => selectedTasks.includes(task.id));
    const worksheet = XLSX.utils.json_to_sheet(selectedTaskData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
    XLSX.writeFile(workbook, 'Task_Report.xlsx');
  };

  return (
    <Box p={4}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                isChecked={selectAll}
                onChange={handleSelectAll}
              />
            </Th>
            <Th>Title</Th>
            <Th>Description</Th>
            <Th>Status</Th>
            <Th>Priority</Th>
            <Th>Start Date</Th>
            <Th>End Date</Th>
            <Th>Assignee</Th>
            <Th>Team</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tasks.map((task) => (
            <Tr key={task.id}>
              <Td>
                <Checkbox
                  isChecked={selectedTasks.includes(task.id)}
                  onChange={() => handleSelectTask(task.id)}
                />
              </Td>
              <Td>{task.title}</Td>
              <Td>{task.description}</Td>
              <Td>{task.status}</Td>
              <Td>{task.priority}</Td>
              <Td>{new Date(task.start_date).toLocaleString()}</Td>
              <Td>{new Date(task.end_date).toLocaleString()}</Td>
              <Td>{task.assignee}</Td>
              <Td>{task.team}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex justifyContent="flex-end" mt={5}>
        <Button colorScheme="blue" onClick={handleExport} isDisabled={selectedTasks.length === 0}>
          Export Selected Tasks
        </Button>
      </Flex>
    </Box>
  );
};

export default Reports;
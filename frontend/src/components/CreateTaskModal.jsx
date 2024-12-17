import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Select, Textarea, useDisclosure, useToast, SimpleGrid } from '@chakra-ui/react';
import { BASE_URL } from '../HomePage';
import { BiAddToQueue } from "react-icons/bi";

const CreateTaskModal = ({ tasks, setTasks }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [team, setTeam] = useState('');
  const [assignee, setAssignee] = useState('');
  const [usernames, setUsernames] = useState([]);
  const [userMap, setUserMap] = useState({});  // Map of usernames to user IDs
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const toast = useToast();
  const role = localStorage.getItem('role');  // Get user role from local storage

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(BASE_URL + "/users", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        const userMap = {};
        data.forEach(user => {
          userMap[user.username] = user.id;
        });
        setUserMap(userMap);
        setUsernames(data.map(user => user.username));
      } catch (error) {
        console.error("Error fetching usernames:", error);
      }
    };

    fetchUsernames();
  }, []);
  const findNextAvailableSlot = (tasks) => {
    const workHoursStart = 9;
    const workHoursEnd = 17;
    const slotDuration = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

    let currentDate = new Date();
    currentDate.setMinutes(0, 0, 0); // Reset minutes and seconds

    while (true) {
      const day = currentDate.getDay();
      const hour = currentDate.getHours();

      // Skip weekends
      if (day === 0 || day === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(workHoursStart);
        continue;
      }

      // Skip non-working hours
      if (hour < workHoursStart) {
        currentDate.setHours(workHoursStart);
      } else if (hour >= workHoursEnd) {
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(workHoursStart);
        continue;
      }

      const slotStart = new Date(currentDate);
      const slotEnd = new Date(slotStart.getTime() + slotDuration);

      // Check if the slot is within working hours
      if (slotEnd.getHours() > workHoursEnd) {
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(workHoursStart);
        continue;
      }

      // Check for overlaps with existing tasks
      const isOverlap = tasks.some(task =>
        (new Date(task.start_date) < slotEnd && new Date(task.end_date) > slotStart)
      );

      if (!isOverlap) {
        return { start: slotStart, end: slotEnd };
      }

      currentDate.setTime(slotEnd.getTime());
    }
  };

  const hasOverlappingTask = (tasks, assignee_id, startDate, endDate) => {
    return tasks.some(task =>
      task.assignee_id === assignee_id &&
      ((new Date(task.start_date) < new Date(endDate) && new Date(task.end_date) > new Date(startDate)))
    );
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    // Validation to ensure no field is empty
    if (!title || !description || !priority || !status || !startDate || !endDate || !team || !assignee) {
      toast({
        title: "Error",
        description: "All fields are required.",
        status: "error",
        duration: 3000,
        position: "bottom-centre",
        isClosable: true,
      });
      return;
    }

      // Validation to ensure end date/time is after start date/time
  if (new Date(endDate) <= new Date(startDate)) {
    toast({
      title: "Error",
      description: "End date/time must be after start date/time.",
      status: "error",
      duration: 3000,
      position: "bottom-centre",
      isClosable: true,
    });
    return;
  }

    try {
      const token = localStorage.getItem('token');
      const assignee_id = userMap[assignee];  // Map assignee to assignee_id

      // Check for overlapping tasks
      const overlapResponse = await fetch(BASE_URL + "/check-overlap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ assignee_id, start_date: startDate, end_date: endDate }),
      });
      const overlapData = await overlapResponse.json();
      if (overlapData.overlap) {
        toast({
          title: "Error",
          description: "The assignee already has a task assigned during the specified time.",
          status: "error",
          duration: 3000,
          position: "bottom-centre",
          isClosable: true,
        });
        return;
      }

      // Create the task
      const response = await fetch(BASE_URL + "/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, priority, status, start_date: startDate, end_date: endDate, team, assignee_id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setTasks(prevTasks => [...prevTasks, data]);
      toast({
        title: "Task created.",
        description: "Task has been created successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose();
      clearForm();
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 3000,
        position: "bottom-centre",
        isClosable: true,
      });
    }
  };

  const handleScheduleTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(BASE_URL + "/tasks", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      const nextSlot = findNextAvailableSlot(data);
      setStartDate(nextSlot.start.toISOString().slice(0, 16));
      setEndDate(nextSlot.end.toISOString().slice(0, 16));
    } catch (error) {
      console.error("Error scheduling task:", error);
      toast({
        title: "An error occurred.",
        description: error.message || "Unexpected error occurred.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setPriority('');
    setStatus('');
    setStartDate('');
    setEndDate('');
    setTeam('');
    setAssignee('');
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  return (
    <>
    
        <Button onClick={onOpen} leftIcon={<BiAddToQueue />} iconSpacing={0} size="md">
        </Button>
    

      <Modal isOpen={isOpen} onClose={handleClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select placeholder="Select Priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select placeholder="Select Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Start Date/Time</FormLabel>
                <Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>End Date/Time</FormLabel>
                <Input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Team</FormLabel>
                <Select placeholder="Select Team" value={team} onChange={(e) => setTeam(e.target.value)}>
                  <option value="Team 1">Team 1</option>
                  <option value="Team 2">Team 2</option>
                  <option value="Team 3">Team 3</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Assignee</FormLabel>
                <Select placeholder="Select Assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                  {usernames.map(username => (
                    <option key={username} value={username}>{username}</option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateTask}>
              Create
            </Button>
            <Button colorScheme="green" mr={3} onClick={handleScheduleTask}>
              Auto-Schedule
            </Button>
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateTaskModal;
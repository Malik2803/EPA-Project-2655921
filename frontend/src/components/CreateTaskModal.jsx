import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Select, Textarea, useDisclosure, useToast, SimpleGrid } from '@chakra-ui/react';
import { BASE_URL } from '../HomePage';
import { BiAddToQueue } from "react-icons/bi";

const CreateTaskModal = ({ setTasks }) => {
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
  const toast = useToast();
  const role = localStorage.getItem('role');  // Get user role from local storage
  console.log("User role:", role);  // Log the user role

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

    if (isOpen) {
      fetchUsernames();
    }
  }, [isOpen]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const assignee_id = userMap[assignee];  // Map assignee to assignee_id
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
      console.error("Error creating task:", error);
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
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
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
                  <option value="team1">Team 1</option>
                  <option value="team2">Team 2</option>
                  <option value="team3">Team 3</option>
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
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateTaskModal;
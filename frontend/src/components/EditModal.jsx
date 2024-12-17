import React, { useState, useEffect } from 'react';
import { IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Select, Textarea, useDisclosure, useToast, Button } from '@chakra-ui/react';
import { BiEditAlt } from "react-icons/bi";
import { BASE_URL } from '../HomePage';

const EditModal = ({ task, setTasks }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [startDate, setStartDate] = useState(task.start_date);
  const [endDate, setEndDate] = useState(task.end_date);
  const [team, setTeam] = useState(task.team);
  const [assignee, setAssignee] = useState(task.assignee);
  const [usernames, setUsernames] = useState([]);
  const [userMap, setUserMap] = useState({});  // Map of usernames to user IDs
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

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

  const handleTaskUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
      setIsLoading(false);
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
    setIsLoading(false);
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
        body: JSON.stringify({ assignee_id, start_date: startDate, end_date: endDate, task_id: task.id }),  // Include task ID
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
        setIsLoading(false);
        return;
      }


      const response = await fetch(`${BASE_URL}/tasks/${task.id}`, {
        method: "PUT",
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
      toast({
        title: "Task updated.",
        description: "Task has been updated successfully.",
        status: "success",
        duration: 3000,
        position: "bottom-centre",
        isClosable: true,
      });
      onClose();
      setTasks((prevTasks) => prevTasks.map((t) => (t.id === task.id ? data : t)));
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 3000,
        position: "bottom-centre",
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <IconButton
        variant="ghost"
        colorScheme="blue"
        size="sm"
        aria-label="Edit Task"
        icon={<BiEditAlt size={20} />}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleTaskUpdate}>
          <ModalContent>
            <ModalHeader>Edit Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
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
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit" isLoading={isLoading}>
                Update
              </Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default EditModal;
import React, { useState } from 'react';
import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, Textarea, Select, FormControl, FormLabel, HStack, IconButton, useToast } from "@chakra-ui/react";
import { BiEditAlt } from "react-icons/bi";
import { BASE_URL } from "../HomePage";

const EditModal = ({task,setTasks}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [taskData, setTaskData] = useState({
    title: task.title,
    description: task.description,
    start_date: task.start_date,
    end_date: task.end_date,
    priority: task.priority,
    status: task.status,
    assignee: task.assignee,
    team: task.team
  });
  const toast = useToast();
  const handleTaskUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(BASE_URL + "/tasks/" + task.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData),
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
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Task Name</FormLabel>
              <Input
                name="title"
                placeholder="e.g Openshift Upgrade v1.13.1"
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                placeholder="Task Description"
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              />
            </FormControl>

            <HStack spacing={4} mt={4}>
              <FormControl>
                <FormLabel>Start Date/Time</FormLabel>
                <Input
                  type="datetime-local"
                  name="start_date"
                  value={taskData.start_date}
                  onChange={(e) => setTaskData({ ...taskData, start_date: e.target.value })}
                  maxWidth="200px"
                  />
              </FormControl>
              <FormControl>
                <FormLabel>End Date/Time</FormLabel>
                <Input
                  type="datetime-local"
                  name="end_date"
                  value={taskData.end_date}
                  onChange={(e) => setTaskData({ ...taskData, end_date: e.target.value })}
                  maxWidth="200px"
                  />
              </FormControl>
            </HStack>

            <HStack spacing={4} mt={4}>
              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select
                  name="priority"
                  placeholder="Select priority"
                  value={taskData.priority}
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                  >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  placeholder="Select status"
                  value={taskData.status}
                  onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                  >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Complete">Complete</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </FormControl>
            </HStack>

            <HStack spacing={4} mt={4}>
              <FormControl>
                <FormLabel>Assignee</FormLabel>
                <Input
                  name="assignee"
                  placeholder="Assignee"
                  value={taskData.assignee}
                  onChange={(e) => setTaskData({ ...taskData, assignee: e.target.value })}
                  />
              </FormControl>

              <FormControl>
                <FormLabel>Team</FormLabel>
                <Select
                  name="team"
                  placeholder="Select team"
                  value={taskData.team}
                  onChange={(e) => setTaskData({ ...taskData, team: e.target.value })}
                  >
                  <option value="Team 1">Team 1</option>
                  <option value="Team 2">Team 2</option>
                  <option value="Team 3">Team 3</option>
                  
                </Select>
              </FormControl>
            </HStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} isLoading = {isLoading} onClick={handleTaskUpdate}>
              Update
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default EditModal;
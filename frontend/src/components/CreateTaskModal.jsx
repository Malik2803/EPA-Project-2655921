import React, { useState } from 'react';
import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, Textarea, Select, FormControl, FormLabel, HStack, useToast } from "@chakra-ui/react";
import { BiAddToQueue } from "react-icons/bi";
import { BASE_URL } from "../HomePage";

const CreateTaskModal = ({ setTasks }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    priority: "",
    status: "",
    assignee: "",
    team: ""
  });

  const toast = useToast();

  const resetForm = () => {
    setTaskData({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      priority: "",
      status: "",
      assignee: "",
      team: ""
    });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    // Validate that end date/time is after start date/time
    if (new Date(taskData.end_date) <= new Date(taskData.start_date)) {
      toast({
        title: "Validation Error",
        description: "End date/time must be after start date/time",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(BASE_URL + "/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setTasks((prevTasks) => [...prevTasks, data]);
      toast({
        title: "Task created.",
        description: "Task has been created successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      resetForm();
      onClose();
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} leftIcon={<BiAddToQueue />} iconSpacing={0} size="md">
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleCreateTask}>
          <ModalContent>
            <ModalHeader>Create Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Task Name</FormLabel>
                <Input
                  name="Task Name"
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

              <HStack spacing={2} mt={4}>
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
              <Button colorScheme="blue" mr={3} type="submit" isLoading={isLoading}>
                Create
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default CreateTaskModal;
import React, { useState, useEffect } from 'react';
import { Button, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, FormControl, FormLabel, Select, Input, useDisclosure } from '@chakra-ui/react';
import { FaFilter } from "react-icons/fa";
import { BASE_URL } from '../HomePage';

const FilterDrawer = ({ setFilters }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [taskName, setTaskName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [team, setTeam] = useState('');
  const [assignee, setAssignee] = useState('');
  const [usernames, setUsernames] = useState([]);

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
        setUsernames(data.map(user => user.username));
      } catch (error) {
        console.error("Error fetching usernames:", error);
      }
    };

    if (isOpen) {
      fetchUsernames();
    }
  }, [isOpen]);

  const applyFilters = () => {
    setFilters({ priority, status, taskName, startDate, endDate, team, assignee });
    onClose();
  };

  const resetFilters = () => {
    setPriority('');
    setStatus('');
    setTaskName('');
    setStartDate('');
    setEndDate('');
    setTeam('');
    setAssignee('');
    setFilters({ priority: '', status: '', taskName: '', startDate: '', endDate: '', team: '', assignee: '' });
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen}>
        <FaFilter size={15} />
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Filter Tasks</DrawerHeader>
          <DrawerBody>
            <FormControl>
              <FormLabel>Task Name</FormLabel>
              <Input placeholder="Enter Task Name" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Priority</FormLabel>
              <Select placeholder="Select Priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Status</FormLabel>
              <Select placeholder="Select Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Start Date/Time</FormLabel>
              <Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>End Date/Time</FormLabel>
              <Input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Team</FormLabel>
              <Select placeholder="Select Team" value={team} onChange={(e) => setTeam(e.target.value)}>
                <option value="team1">Team 1</option>
                <option value="team2">Team 2</option>
                <option value="team3">Team 3</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Assignee</FormLabel>
              <Select placeholder="Select Assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                {usernames.map(username => (
                  <option key={username} value={username}>{username}</option>
                ))}
              </Select>
            </FormControl>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={resetFilters}>
              Reset
            </Button>
            <Button colorScheme="blue" onClick={applyFilters}>
              Apply
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FilterDrawer;
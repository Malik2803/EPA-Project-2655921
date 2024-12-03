import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, Textarea, Select, FormControl, FormLabel, HStack, IconButton } from "@chakra-ui/react";
import { BiEditAlt } from "react-icons/bi";

const EditModal = () => {

const { isOpen, onOpen, onClose } = useDisclosure();

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
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Task ID</FormLabel>
              <Input placeholder="Task ID" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea placeholder="Task Description" />
            </FormControl>

            <HStack spacing={4} mt={4}>
              <FormControl>
                <FormLabel>Start Date</FormLabel>
                <Input type="date" />
              </FormControl>
              <FormControl>
                <FormLabel>End Date</FormLabel>
                <Input type="date" />
              </FormControl>
            </HStack>

            <HStack spacing={4} mt={4}>
              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select placeholder="Select priority">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>State</FormLabel>
                <Select placeholder="Select state">
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Complete">Complete</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </FormControl>
            </HStack>

            <FormControl mt={4}>
              <FormLabel>Assignee</FormLabel>
              <Input placeholder="Assignee" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default EditModal;
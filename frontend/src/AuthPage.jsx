import React, { useState } from 'react';
import { Box, Button, VStack, FormControl, FormLabel, Input, HStack, Center, Heading, useToast, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
/*     if (!username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    } */
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      localStorage.setItem('token', response.data.token);
      toast({
        title: "Login successful.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate('/home');
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.response.data.error,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !name || !role || !gender) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/users', { username, email, password, name, role, gender });
      toast({
        title: "Registration successful.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setIsLogin(true);
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.response.data.error,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Center minH="100vh">
      <Box width = "30%" mx="auto" mt={8} p={6} borderWidth={3} borderRadius="lg">
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          {isLogin ? "Sign In" : "Sign Up"}
        </Heading>
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <VStack spacing={8}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="30%">
                Login
              </Button>
              <HStack>
                <Button variant="link" onClick={() => setIsLogin(false)}>
                  Dont have an account? Register here
                </Button>
              </HStack>
            </VStack>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Input value={role} onChange={(e) => setRole(e.target.value)} />
              </FormControl>
              <HStack width="95%" justifyContent="space-between">
                <FormControl>
                  <FormLabel></FormLabel>
                  <RadioGroup onChange={setGender} value={gender}>
                    <Stack direction="row">
                      <Radio value="male">Male</Radio>
                      <Radio value="female">Female</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                <Button type="submit" colorScheme="blue" width = "60%">
                  Register
                </Button>
              </HStack>
              <HStack>
                <Button variant="link" onClick={() => setIsLogin(true)}>
                  Already have an account? Sign in here
                </Button>
              </HStack>
            </VStack>
          </form>
        )}
      </Box>
    </Center>
  );
};

export default AuthPage;
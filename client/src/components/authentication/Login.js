import { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const submitHandler = async () => {
        setLoading(true);

        if (!email || !password) {
            toast({
                title: "Please fill all fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                header: {
                    "Content-type": "application/json"
                }
            }
            const { data } = await axios.post("http://localhost:5000/api/user/login", { email, password }, config)
            toast({
                title: "Logged In Successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate('/chat');
        } catch (error) {
            toast({
                title: "Some error occurred",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
        }
    }

    return (
        <VStack spacing="5px" color={'black'}>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder="Enter your Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button
                            h="1.75rem"
                            size="sm"
                            onClick={() => setShow(!show)}
                        >
                            {show ? <FaEye /> : <FaEyeSlash />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme='blue'
                width={"100%"}
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>
        </VStack>
    )
}

export default Login
import { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pic, setPic] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', pics);
        formData.append('upload_preset', 'chatez');
        formData.append('cloud_name', 'dbgyz4jbl');

        fetch(`https://api.cloudinary.com/v1_1/dbgyz4jbl/image/upload`, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                setPic(data.url.toString());
                toast({
                    title: "Image Uploaded Successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                toast({
                    title: "Image Upload Failed",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                });
                setLoading(false);
            });
    }
    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
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
        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
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
                headers: {
                    "Content-type": "application/json"
                }
            }

            const { data } = await axios.post(
                'http://localhost:5000/api/user/register-user',
                { name, email, password, pic },
                config
            );

            toast({
                title: "Registration Successful",
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
            <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
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
            <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Re-enter your password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
            <FormControl id="pic">
                <FormLabel>Select Your Picture</FormLabel>
                <Input
                    type='file'
                    p={1.5}
                    accept='image/*'
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>

            <Button
                colorScheme='blue'
                width={"100%"}
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default SignUp
import { Box, Container, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import React from 'react';
import Login from '../components/authentication/Login';
import SignUp from '../components/authentication/SignUp';

const Home = () => {
    return (
        <Container maxW="xl" centerContent>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding={3}
                w="100%"
                m="40px 0 15px 0"
                borderWidth="1px"
                borderRadius="lg"
                bg="white"
            >
                <Text fontSize={"4xl"} fontFamily={'Work sans'} color={"black"}>ChatEZ</Text>
            </Box>
            <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" color={"black"}>
                <Tabs variant='soft-rounded'>
                    <TabList mb={"1em"}>
                        <Tab width={"50%"}>Login</Tab>
                        <Tab width={"50%"}>Signup</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Home
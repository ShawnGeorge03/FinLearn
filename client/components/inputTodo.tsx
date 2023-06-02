"use client";

import React, { useState } from 'react';
import { Stack, Input, Button, useToast, Flex, Box } from '@chakra-ui/react'

const InputTodo = () => {

    const toast = useToast()
    const [value, setValue] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (value === '') {
            toast({
                title: "Please enter the text.",
                status: "warning",
                duration: 2000,
                isClosable: true,
            })
            return;
        }

        try {
            const body = { description: value } // description is the key which is the same as the database schema field
            const response = await fetch("http://localhost:5000/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            // const win: Window = window; // trying to do window.location but TS does not allow this (ref: https://github.com/microsoft/TypeScript/issues/48949)
            // win.location = "/";

        } catch (e: any) {
            console.error(e.message)
        }

        setValue('')

    }
    return (
        <Flex bg="gray.100" align="center" justify="center" h="50vh">
            <Box bg="white" p={6} rounded="md" w={64}>
                <h1>Todo App</h1>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={5}>
                        <Input
                            mt={5}
                            value={value}
                            variant="outline"
                            type="text"
                            placeholder="Enter your todo..."
                            onChange={(e) => setValue(e.target.value)} />
                        <Button colorScheme="teal" type="submit">Add Todo</Button>
                    </Stack>
                </form>
            </Box>
        </Flex>
    )

};

export default InputTodo;

'use client';

import React, { useState, useEffect } from 'react';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input
} from '@chakra-ui/react'

interface EditTodoProps {
    todo: any,
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
}

const EditTodo = ({ todo, isOpen, onClose }: EditTodoProps) => {

    const [editTodoName, setEditTodoName] = useState<string>(todo.description)

    // update todo
    const updateDescription = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            const body = { description: editTodoName }
            const response = await fetch(`http://localhost:5000/todos/${todo._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json " },
                body: JSON.stringify(body)
            })
            onClose();
            // const win: Window = window; // trying to do window.location but TS does not allow this (ref: https://github.com/microsoft/TypeScript/issues/48949)
            // win.location = "/";
        } catch (e: any) {
            console.error(e.message)
        }
    }

    useEffect(() => {
        setEditTodoName(todo.description) // to help in making sure the modal value corresponds to the value in the input field
    }, [todo])

    return (

        <Modal id={todo._id} isOpen={isOpen} onClose={() => {
            onClose();
            setEditTodoName(todo.description)
        }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Todo Name</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input placeholder='Edit your Todo item...' value={editTodoName} onChange={(e) => setEditTodoName(e.target.value)} />
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => updateDescription(e)}>
                        Edit
                    </Button>
                    <Button variant='ghost' onClick={() => {
                        onClose();
                        setEditTodoName(todo.description);
                    }}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditTodo;

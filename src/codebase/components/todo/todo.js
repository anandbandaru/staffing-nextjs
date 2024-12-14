import React, { useContext, useEffect, useState } from "react";
import configData from "../../../CONFIG_RELEASE.json";
import './todo.css';
import { Context } from "../../context/context";
import axios from 'axios';
import { Container, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

const ToDo = () => {
    const {
        APIPath,
        userName, userType } = useContext(Context);

    const [todos, setTodos] = useState({ data: [] });
    const [newTodo, setNewTodo] = useState('');
    const [apiLoading, setApiLoading] = useState(false);
    const [apiLoadingError, setApiLoadingError] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");
    const [itemCount, setItemCount] = useState(0);

    useEffect(() => {
        console.log("TODO SCREEN INTI HERE")
        setTimeout(() => {
            fetchTodos();
        }, 1);
    }, []);

    const fetchTodos = () => {
        setTodos({ data: [] });
        let apiUrl = APIPath + "/todos"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    //console.log(result);
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setDataAPIError(result.error.code + " - " + result.error.message);
                        setTodos({});
                        setApiLoadingError(true);
                        setItemCount(0);
                    }
                    else {
                        setTodos(result);
                        setItemCount(result.total);
                        setDataAPIError(result.total == 0 ? "No ToDo information present." : "ok");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setTodos({});
                    setItemCount(0);
                    console.log("RequestData:On JUST error: API call failed")
                    setDataAPIError("RequestData:On JUST error: API call failed");
                    setApiLoading(false);
                    setApiLoadingError(true);
                }
            )
    }

    const addTodo = async () => {
        await axios.post('/todos', { title: newTodo, userName });
        setNewTodo('');
        fetchTodos();
    };

    const deleteTodo = async (id) => {
        await axios.delete(`/todos/${id}`, { data: { userName } });
        fetchTodos();
    };

    const completeTodo = async (id) => {
        await axios.put(`/todos/${id}/complete`, { userName });
        fetchTodos();
    };

    return (
        <Container>
            <TextField
                label="New Todo"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                fullWidth
            />
            <Button variant="contained" color="primary" onClick={addTodo}>
                Add Todo
            </Button>
            <List>
                {todos.data.map((todo) => (
                    <ListItem key={todo.id} divider>
                        <ListItemText primary={todo.title} />
                        <IconButton edge="end" aria-label="complete" onClick={() => completeTodo(todo.id)}>
                            <CheckIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default ToDo;
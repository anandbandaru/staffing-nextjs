import React, { useContext, useEffect, useState } from "react";
import configData from "../../../CONFIG_RELEASE.json";
import './todo.css';
import { Context } from "../../context/context";
import axios from 'axios';
import {
    Container, TextField, Button, IconButton,
    Card, CardContent, CardActions, Checkbox, Chip, Stack, Menu, MenuItem
} from '@mui/material';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';


const ToDo = () => {
    const {
        APIPath,
        userName, userType } = useContext(Context);

    const [todos, setTodos] = useState({ data: [] });
    const [alerts, setAlerts] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(false);
    const [apiLoadingError, setApiLoadingError] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");
    const [itemCount, setItemCount] = useState(0);
    const [tabIndex, setTabIndex] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const handleMenuOpen = (event, todo) => {
        setAnchorEl(event.currentTarget);
        setSelectedTodo(todo);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTodo(null);
    };


    useEffect(() => {
        console.log("TODO SCREEN INTI HERE")
        setTimeout(() => {
            fetchTodos("Active");
        }, 1);
    }, []);

    const handleTabSelect = (index) => {
        setTabIndex(index);
        if (index === 0) {
            fetchTodos("Active")
        }
        else {
            fetchTodos("Completed")
        }
    };

    const fetchTodos = (todoType) => {
        setTodos({ data: [] });
        setApiLoading(true);
        let apiUrl = APIPath + "/todos/active"
        if (todoType === "Completed")
            apiUrl = APIPath + "/todos/completed"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    //console.log(result);
                    if (result.error) {
                        console.log(todoType + ":fetchTodos:On error return: setting empty")
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
                    console.log(todoType + ":fetchTodos:On JUST error: API call failed")
                    setDataAPIError(todoType + ":fetchTodos:On JUST error: API call failed");
                    setApiLoading(false);
                    setApiLoadingError(true);
                    setApiLoading(false);
                }
            )
    }

    const completeTodo = async (id) => {
        setApiLoading(true);

        axios.post(APIPath + `/todos/complete/${id}/${userName}`,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            },
        ).then((resp) => {
            setApiLoading(false);
            setApiLoadingError(false);
            
            fetchTodos("Active");
        })
            .catch(function (error) {
                console.log(error);
                setApiLoadingError(true);
                setApiLoading(false);
            });
    };

    const TodoList = () => {
        return (
            <div className="h-screen overflow-y-auto pb-36">
                {todos.data.map((todo, key) => (
                    <div key={key} divider="true" className="mb-2" >
                        <Card className="w-full mx-0">
                            <CardContent>
                                <div className={todo.Important ? "text-red-600 " : ""}>
                                    {todo.Important ?
                                        <>
                                            <ErrorOutlineOutlinedIcon className="text-red-600 mr-2" />{todo.title}
                                        </>
                                        : <>
                                            {todo.title}
                                        </>
                                    }
                                </div>
                            </CardContent>
                            <CardActions>
                                <Stack spacing={1} direction="row" className="">
                                    <Checkbox
                                        checked={todo.completed}
                                        disabled={todo.completed}
                                        onChange={() => completeTodo(todo.Id)}
                                    />
                                    <IconButton
                                        aria-label="more"
                                        aria-controls="todo-menu"
                                        aria-haspopup="true"
                                        onClick={(event) => handleMenuOpen(event, todo)}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    {/* {todo.Important ?
                                        <IconButton
                                            title="Important"
                                            aria-label="Important"
                                            aria-controls="todo-menu"
                                            aria-haspopup="true"
                                        >
                                            <ErrorOutlineOutlinedIcon className="bg-red-600 text-white" />
                                        </IconButton>
                                        : <></>} */}
                                </Stack>
                            </CardActions>
                        </Card>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div>
            <div >
                <Stack spacing={0} direction="row" className="items-center justify-center">
                    <div className="bg-pink-500 text-white px-2 w-full mb-2">TO DOs & ACTIONS</div>
                </Stack>
            </div>
            <div className="todoAPILoadingHolder">
                {apiLoading ?
                    <>
                        <div className="spinner"></div>
                    </>
                    :
                    <>
                    </>
                }
            </div>
            {todos ?
                <>
                    <Tabs selectedIndex={tabIndex} className="mx-2"
                        onSelect={handleTabSelect}>
                        <TabList className="todoTabsListHolder" >
                            <Tab label="Active" title="Active" ><AssignmentIcon /></Tab>
                            <Tab label="Completed" title="Completed" ><AssignmentTurnedInIcon /></Tab>
                            <Tab label="Actions" title="Actions" ><NotificationsActiveIcon /></Tab>
                        </TabList>
                        <TabPanel className="px-0">
                            <div className="h-screen overflow-y-auto pb-36">
                                {todos.data.map((todo, key) => (
                                    <div key={key} divider="true" className="mb-2" >
                                        <Card className="w-full mx-0">
                                            <CardContent>
                                                <div className={todo.Important ? "text-red-600 " : ""}>
                                                    {todo.Important ?
                                                        <>
                                                            <ErrorOutlineOutlinedIcon className="text-red-600 mr-2" />{todo.title}
                                                        </>
                                                        : <>
                                                            {todo.title}
                                                        </>
                                                    }
                                                </div>
                                            </CardContent>
                                            <CardActions>
                                                <Stack spacing={1} direction="row" className="">
                                                    <Checkbox
                                                        checked={todo.completed}
                                                        disabled={todo.completed}
                                                        onChange={() => completeTodo(todo.Id)}
                                                    />
                                                    <IconButton
                                                        aria-label="more"
                                                        aria-controls="todo-menu"
                                                        aria-haspopup="true"
                                                        onClick={(event) => handleMenuOpen(event, todo)}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Stack>
                                            </CardActions>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </TabPanel>
                        <TabPanel className="px-0">
                            <div className="h-screen overflow-y-auto pb-36">
                                {todos.data.map((todo, key) => (
                                    <div key={key} divider="true" className="mb-2" >
                                        <Card className="w-full mx-0">
                                            <CardContent>
                                                <div className={todo.Important ? "text-red-600 " : ""}>
                                                    {todo.Important ?
                                                        <>
                                                            <ErrorOutlineOutlinedIcon className="text-red-600 mr-2" />{todo.title}
                                                        </>
                                                        : <>
                                                            {todo.title}
                                                        </>
                                                    }
                                                </div>
                                            </CardContent>
                                            <CardActions>
                                                <Stack spacing={1} direction="row" className="">
                                                    <Checkbox
                                                        checked={todo.completed}
                                                        disabled={todo.completed}
                                                        onChange={() => completeTodo(todo.Id)}
                                                    />
                                                    <IconButton
                                                        aria-label="more"
                                                        aria-controls="todo-menu"
                                                        aria-haspopup="true"
                                                        onClick={(event) => handleMenuOpen(event, todo)}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Stack>
                                            </CardActions>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </TabPanel>
                        <TabPanel className="px-0">
                            Actions from DB entries will be listed here
                        </TabPanel>

                        <Menu className="todoItem"
                            id="todo-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {selectedTodo && [
                                <MenuItem key="createdBy">Created by: {selectedTodo.createdBy}</MenuItem>,
                                <MenuItem key="createdDate">Created on: {new Date(selectedTodo.createdDate).toLocaleString()}</MenuItem>,
                                selectedTodo.completed && [
                                    <MenuItem key="completedBy">Completed by: {selectedTodo.completedBy}</MenuItem>,
                                    <MenuItem key="completedDate">Completed on: {new Date(selectedTodo.completedDate).toLocaleString()}</MenuItem>
                                ]
                            ]}
                        </Menu>
                    </Tabs>
                </>
                :
                <>
                    No ToDos present
                </>}

        </div>
    );
};

export default ToDo;
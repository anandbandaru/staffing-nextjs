import React, { useContext, useEffect, useState } from "react";
import './todo.css';
import { Context } from "../../context/context";
import axios from 'axios';
import {
    Button, IconButton, Alert,
    Card, CardContent, CardActions, Checkbox, Stack, Menu, MenuItem, Snackbar
} from '@mui/material';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const ToDo = () => {
    const {
        APIPath,
        userName } = useContext(Context);

    const [todoType, setTodotype] = useState("");
    const [todos, setTodos] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(false);
    const [apiLoadingError, setApiLoadingError] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");
    const [itemCountActive, setItemCountActive] = useState(0);
    const [itemCountCompleted, setItemCountCompleted] = useState(0);
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

    const [openSnackError, setOpenSnackError] = React.useState(false);
    const handleCloseSnackError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackError(false);
    };
    const [openSnackSuccess, setOpenSnackSuccess] = React.useState(false);
    const handleCloseSnackSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackSuccess(false);
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
            setTodotype("Active")
            fetchTodos("Active")
        }
        else {
            setTodotype("Completed")
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
                        setItemCountCompleted(0);
                        setItemCountActive(0);
                    }
                    else {
                        setTodos(result);
                        if (todoType === "Completed")
                            setItemCountCompleted(result.total);
                        else
                            setItemCountActive(result.total);
                        setDataAPIError(result.total == 0 ? "No To Do information present." : "ok");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setTodos({});
                    setItemCountCompleted(0);
                    setItemCountActive(0);
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
            setOpenSnackError(false);
            setDataAPIError("")
            setOpenSnackSuccess(true);
        })
            .catch(function (error) {
                console.log(error);
                setApiLoadingError(true);
                setApiLoading(false);
                setOpenSnackError(true);
                setDataAPIError(error)
            });
    };


    return (
        <div>
            <Snackbar
                open={openSnackError}
                autoHideDuration={6000}
                onClose={handleCloseSnackError}
            >
                <Alert
                    onClose={handleCloseSnackError}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {dataAPIError.message}
                </Alert>
            </Snackbar>
            <Snackbar
                open={openSnackSuccess}
                autoHideDuration={6000}
                onClose={handleCloseSnackSuccess}
            >
                <Alert
                    onClose={handleCloseSnackSuccess}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    To Do item completed.
                </Alert>
            </Snackbar>
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
            {todos.data ?
                <>
                    <Tabs selectedIndex={tabIndex} className="mx-2"
                        onSelect={handleTabSelect}>
                        <TabList className="todoTabsListHolder" >
                            <Tab label="Active" title="Active" >
                                <AssignmentIcon />
                                <span className="todoCounts">{itemCountActive}</span>
                            </Tab>
                            <Tab label="Completed" title="Completed" >
                                <AssignmentTurnedInIcon />
                                <span className="todoCounts">{itemCountCompleted}</span>
                            </Tab>
                            <Tab label="Actions" title="Actions" >
                                <NotificationsActiveIcon />
                                <span className="todoCounts">0</span>
                                </Tab>
                        </TabList>
                        <TabPanel className="px-0">
                            <div className="h-screen overflow-y-auto pb-36">
                                {todos.data.map((todo, key) => (
                                    <div key={key} className="mb-2" >
                                        <Card className="w-full mx-0">
                                            <CardContent>
                                                <div className={todo.important ? "text-red-600 " : ""}>
                                                    {todo.important ?
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
                                                <div className={todo.important ? "text-red-600 " : ""}>
                                                    {todo.important ?
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
                    <div>
                        No To Dos present
                    </div>
                    <Button label="Fetch" onClick={fetchTodos} ></Button>
                </>}

        </div>
    );
};

export default ToDo;
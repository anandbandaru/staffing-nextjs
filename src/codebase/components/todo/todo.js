import React, { useContext, useEffect, useState } from "react";
import './todo.css';
import { Context } from "../../context/context";
import axios from 'axios';
import {
    Button, IconButton,
    Card, CardContent, CardActions, Checkbox, Stack, Menu, MenuItem
} from '@mui/material';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CustomSnackbar from "../snackbar/snackbar";
import MarkUnreadChatAltOutlinedIcon from '@mui/icons-material/MarkUnreadChatAltOutlined';
import RealtimeChatUpdate from "../realtime/realtimeChatUpdate";

const ToDo = () => {
    const [todos, setTodos] = useState({ data: [] });
    const [todosCompleted, setTodosCompleted] = useState({ data: [] });
    const [apiTodoLoading, setApiTodoLoading] = useState(false);
    const [itemCountActive, setItemCountActive] = useState(0);
    const [itemCountCompleted, setItemCountCompleted] = useState(0);
    const {
        APIPath, refreshTodos, setRefreshTodos, userType,
        userName } = useContext(Context);

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

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const showSnackbar = (severity, message) => {
        setSnackbarSeverity(severity);
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const fetchTodos = (todoType) => {
        setApiTodoLoading(true);
        let apiUrl = APIPath + "/todos/active";
        if (todoType === "Completed") {
            setTodosCompleted({ data: [] });
            apiUrl = APIPath + "/todos/completed";
        }
        else
            setTodos({ data: [] });

        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {

                        if (todoType === "Completed") {
                            setItemCountCompleted(0);
                            setTodosCompleted({});
                        }
                        else {
                            setItemCountActive(0);
                            setTodos({});
                        }
                        setItemCountActive(0);
                    } else {
                        if (todoType === "Completed") {
                            setItemCountCompleted(result.total);
                            setTodosCompleted(result);
                        }
                        else {
                            setTodos(result);
                            setItemCountActive(result.total);
                        }
                    }
                    setApiTodoLoading(false);
                },
                (error) => {
                    setApiTodoLoading(false);
                    setTodos({});
                    setTodosCompleted({});
                    setItemCountCompleted(0);
                    setItemCountActive(0);
                }
            );
    };
    useEffect(() => {
        setTimeout(async () => {
            fetchTodos("Active");
            fetchTodos("Completed");
            setRefreshTodos(false)
        }, 1);
    }, [refreshTodos]);

    const handleTabSelect = (index) => {
        setTabIndex(index);
        if (index === 0) {
            fetchTodos("Active")
        }
        else {
            fetchTodos("Completed")
        }
    };

    const completeTodo = async (id) => {
        axios.post(APIPath + `/todos/complete/${id}/${userName}`,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                }
            },
        ).then((resp) => {
            fetchTodos("Active");
            showSnackbar('success', "To Do is completed");
            fetchTodos("Completed");
        })
            .catch(function (error) {
                // console.log(error);
                showSnackbar('error', 'Error completing To do' + error);
            });
    };
    const closeTodo = async (id) => {
        axios.post(APIPath + `/todos/close/${id}/${userName}`,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                }
            },
        ).then((resp) => {
            fetchTodos("Active");
            showSnackbar('success', "To Do is closed");
            fetchTodos("Closed");
        })
            .catch(function (error) {
                // console.log(error);
                showSnackbar('error', 'Error closing To do' + error);
            });
    };


    return (
        <div>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <div >
                <Stack spacing={0} direction="row" className="items-center justify-center">
                    <div className="bg-pink-600 text-white px-2 pb-0.5 w-full mb-3">TO DOs & ACTIONS</div>
                </Stack>
            </div>
            <div className="todoAPILoadingHolder">
                {apiTodoLoading ?
                    <>
                        <div className="spinner"></div>
                    </>
                    :
                    <>
                    </>
                }
            </div>
            {todos && todos.data && todosCompleted && todosCompleted.data ?
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
                            {/* <Tab label="Chat" title="Chat" >
                                <MarkUnreadChatAltOutlinedIcon color="error" />
                                <span className="todoCounts">0</span>
                            </Tab> */}
                        </TabList>
                        <TabPanel className="px-0">
                            <div className="h-screen overflow-y-auto pb-56">
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
                                                <Stack spacing={0.5} direction="row" className="justify-center items-center">
                                                    <div>COMPLETE: </div>
                                                    <Checkbox
                                                        checked={todo.completed}
                                                        disabled={todo.completed}
                                                        onChange={() => completeTodo(todo.Id)}
                                                    />
                                                    {userType === "ADMIN" && (
                                                        <>
                                                            <div>CLOSE: </div>
                                                            <Checkbox
                                                                checked={todo.completedAdmin}
                                                                disabled={todo.completedAdmin}
                                                                onChange={() => closeTodo(todo.Id)}
                                                            />
                                                        </>
                                                    )}
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
                                {todosCompleted.data.map((todo, key) => (
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
                        {/* <TabPanel className="px-0">
                            Realtime chat messages
                            <RealtimeChatUpdate />
                        </TabPanel> */}

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
                            {selectedTodo && [
                                selectedTodo.completedAdmin && [
                                    <MenuItem key="completedByAdmin">Closed by: {selectedTodo.completedByAdmin}</MenuItem>,
                                    <MenuItem key="completedDateAdmin">Closed on: {new Date(selectedTodo.completedDateAdmin).toLocaleString()}</MenuItem>
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
                    <Button label="Fetch" onClick={fetchTodos} >CLICK HERE TO RELOAD</Button>
                </>}

        </div>
    );
};

export default ToDo;
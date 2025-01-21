import React, { useState, useContext } from 'react';
import configData from "../../../CONFIG_RELEASE.json";
import { Context } from "../../context/context";
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { Stack, MenuItem, Chip, Button, Paper, Autocomplete } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CustomSnackbar from "../snackbar/snackbar";

const UserTopPermissions = ({ users }) => {
    const { APIPath } = useContext(Context);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedTabs, setSelectedTabs] = useState([]);

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

    const handleUserChange = (event) => {
        // console.log("User selected: " + event.target.value)
        setSelectedUser(event.target.value);
        axios.get(APIPath + `/gettoppermissions/${event.target.value}`)
            .then(response => {
                if (response.data.STATUS === "FAIL")
                    showSnackbar('info', "Top tabs Permissions failure");
                else {
                    if (response.data.total === 0) {
                        setSelectedTabs([]);
                    }
                    else {
                        const dataArray = response.data.data.split(',').map(item => item.trim());
                        setSelectedTabs(dataArray)
                    }
                }
            })
            .catch(error => {
                showSnackbar('error', "Top tabs Permissions failure");
            });
    };
    const handleTabsChange = (event, value) => {
        // console.log("Tab selected: " + value)
        setSelectedTabs(value);
    };
    const handleSave = () => {
        setIsSubmitting(true);
        const tabsToSave = selectedTabs.join(',');
        axios.post(APIPath + '/updatetoppermissions', { userId: selectedUser, tabs: tabsToSave })
            .then(response => {
                if (response.data.STATUS === "FAIL")
                    showSnackbar('error', "Top tabs Permissions save failure");
                else {
                    showSnackbar('success', "Top tabs Permissions savd");
                }
                setIsSubmitting(false);
            })
            .catch(error => {
                setIsSubmitting(false);
                showSnackbar('error', "Top tabs Permissions save failure");
            });
    };

    return (
        <div className='py-0 my-1 mb-4'>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <Paper elevation={3} className="p-4">
                <div className='text-lg'>
                    TOP tabs Permissions
                </div>
                <div className="mt-4 ">
                    <Stack direction="column" spacing={2} className='my-5'>
                        <TextField
                            className='text-sm'
                            size="small"
                            margin="normal"
                            fullWidth
                            id="userId"
                            name="userId"
                            select
                            label="Users"
                            value={selectedUser}
                            onChange={handleUserChange}
                        >
                            {users.filter(user => user.jobTitle !== 'ADMIN').map((item, index) => (
                                <MenuItem key={index} value={item.userPrincipalName}>
                                    {item.userPrincipalName}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Autocomplete
                            className='text-sm'
                            size="small"
                            margin="normal"
                            multiple
                            options={configData.topTabs}
                            value={selectedTabs}
                            onChange={handleTabsChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Select Top tabs"
                                    placeholder="Select top tabs"
                                />
                            )}
                        />
                    </Stack>
                    <Button color="primary"
                        className='mb-4'
                        variant="contained"
                        onClick={handleSave}
                        disabled={isSubmitting || !selectedUser}>
                        {/* disabled={isSubmitting || !selectedUser || selectedTabs.length === 0}> */}
                        <SaveOutlinedIcon className="mr-1" />
                        Save
                    </Button>
                </div>
            </Paper>
        </div>
    );
};

export default UserTopPermissions;
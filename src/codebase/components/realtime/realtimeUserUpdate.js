import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import { database } from '../../../firebase';
import './realtime.css';
import { Stack } from '@mui/material';
import CustomSnackbar from "../snackbar/snackbar";
import Chip from '@mui/material/Chip';

const RealtimeUserUpdate = () => {
    const [dataUser, setDataUser] = useState(0);
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

    useEffect(() => {
        const dbRef = ref(getDatabase(), '/lastloginuser');
        // Read the current count value
        onValue(dbRef, (snapshot) => {
            const newData = snapshot.val();
            setDataUser(newData);
            showSnackbar('info', "RealtimeUserUpdate: Another user logged into the application: " + newData);
        });
    }, []);

    return (
        <div className='realtimeHolderUser'>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
        </div>
    );
};

export default RealtimeUserUpdate;
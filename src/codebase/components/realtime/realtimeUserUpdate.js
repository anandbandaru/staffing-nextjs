import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import './realtime.css';
import CustomSnackbar from "../snackbar/snackbar";

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
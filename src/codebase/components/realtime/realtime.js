import React, { useEffect, useState, useContext } from 'react';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import './realtime.css';
import { Stack } from '@mui/material';
import { Context } from "../../context/context";
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import CustomSnackbar from "../snackbar/snackbar";

const Realtime = () => {
    const { userName } = useContext(Context);
    const [dataCount, setDataCount] = useState(0);
    const [dataNote, setDataNote] = useState(0);
    const [updateOnce, setUpdateOnce] = useState(true);
    const [updateOnceUser, setUpdateOnceUser] = useState(true);
    const [blink, setBlink] = useState(false);
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

    // COUNT
    useEffect(() => {
        const dbRef = ref(getDatabase(), '/count');

        // Read the current count value
        onValue(dbRef, (snapshot) => {
            const newData = snapshot.val();
            if (newData !== dataCount) {
                setBlink(true);
                setTimeout(() => setBlink(false), 1000); // Remove blink class after 1 second
            }
            // console.log("setDataCount: " + newData);
            setDataCount(newData);
        });

        // Update the count value only once
        const updateCount = async () => {
            const currentCount = (await get(dbRef)).val();
            set(dbRef, currentCount + 1);
            setUpdateOnce(false);
        };
        if (updateOnce) {
            updateCount();
            setUpdateOnce(false);
        }
    }, []);

    // USER
    useEffect(() => {
        const dbRef = ref(getDatabase(), '/lastloginuser');

        // Read the current count value
        onValue(dbRef, (snapshot) => {
            const newData = snapshot.val();
            // console.log("CUrrent User: " + userName);
            if (newData !== userName) {
                showSnackbar('info', "Realtime: Another user logged into the application: " + newData);
            }
            // console.log("setDataUser: " + newData);
        });

        // Update the count value only once
        const updateUser = async () => {
            (await get(dbRef)).val();
            set(dbRef, "AUTH GOING ON..........");
            setTimeout(() => set(dbRef, userName), 10000);
            
            setUpdateOnceUser(false);
        };
        if (updateOnceUser) {
            updateUser();
            setUpdateOnceUser(false);
        }
    }, []);

    // NOTE
    useEffect(() => {
        const dbRef = ref(getDatabase(), '/note');
        // Read the current count value
        onValue(dbRef, (snapshot) => {
            const newData = snapshot.val();
            if (newData !== dataNote) {
                setBlink(true);
                setTimeout(() => setBlink(false), 1000); // Remove blink class after 1 second
                showSnackbar('warning', newData);
            }
            setDataNote(newData);
        });
    }, []);

    return (
        <div className='realtimeHolder'>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <Stack direction="row" spacing={1}>
                <NotificationsActiveOutlinedIcon color='warning' />
                <div className='flashing-div'>
                    <span className={`${blink ? 'blink changeColor' : ''}`}>
                        Notification: {dataNote ? dataNote : "0"}
                    </span>
                </div>
                <NotificationsActiveOutlinedIcon color='warning' />
            </Stack>
        </div>
    );
};

export default Realtime;
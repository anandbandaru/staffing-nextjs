import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import { database } from '../../../firebase';
import './realtime.css';
import { Stack } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CustomSnackbar from "../snackbar/snackbar";

const RealtimeNoteUpdate = () => {
    const [dataNote, setDataNote] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        const dbRef = ref(getDatabase(), '/note');
        // Read the current count value
        onValue(dbRef, (snapshot) => {
            const newData = snapshot.val();
            setDataNote(newData);
        });
    }, []);

    const handleChange = (event) => {
        setDataNote(event.target.value);
    };
    const updateNote = async () => {
        setIsSubmitting(true);
        const dbRef = ref(getDatabase(), '/note');
        await set(dbRef, dataNote);
        setIsSubmitting(false);
        //showSnackbar('warning', dataNote);
    };

    return (
        <div className='realtimeHolderNote'>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <Stack direction="column" spacing={2}>
                <TextField
                    size="small"
                    margin="normal"
                    fullWidth
                    multiline
                    rows={3}
                    id="note"
                    name="note"
                    label="Real time Note"
                    value={dataNote ? dataNote : ""}
                    onChange={handleChange}
                />
                <div className=''>
                    {isSubmitting ? (
                        <div className="spinner"></div>
                    ) : (
                        <Button color="primary" variant="contained"
                            onClick={updateNote} disabled={isSubmitting}>
                            <SaveOutlinedIcon className="mr-1" />
                            Save
                        </Button>
                    )}
                </div>
            </Stack>
        </div>
    );
};

export default RealtimeNoteUpdate;
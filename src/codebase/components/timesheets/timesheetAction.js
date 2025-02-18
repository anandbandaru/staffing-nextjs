import React, { useContext, useState } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Context } from "../../context/context";
import NewReleasesOutlinedIcon from '@mui/icons-material/NewReleasesOutlined';
import Button from '@mui/material/Button';
import axios from 'axios';
import { TextField } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ReplyAllOutlinedIcon from '@mui/icons-material/ReplyAllOutlined';
import emailjs from 'emailjs-com';

function TimesheetAction({ ID, timesheetNumber, mode, operation, manualLoadData, setApiLoading, showSnackbar, employeeID, startDate, endDate, jobName, personalEmail, applicationEmail }) {
    const { APIPath, userName } = useContext(Context);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notes, setNotes] = useState('');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        manualLoadData();
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const takeActionOnTimesheet = (type) => {
        if (window.confirm(`Are you sure you want to ${type.toLowerCase()} this timesheet?`)) {
            setApiLoading(true);
            setIsSubmitting(true);
            let apiUrl = APIPath + "/";
            if (type === "APPROVE") {
                apiUrl = APIPath + "/approvetimesheet";
            } else if (type === "REJECT") {
                apiUrl = APIPath + "/rejecttimesheet";
            } else if (type === "SENDBACK") {
                apiUrl = APIPath + "/sendbacktimesheet";
            }
            axios.post(apiUrl,
                {
                    timesheetId: ID,
                    actionBy: userName,
                    notes: notes,
                    action: type
                },
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                    }
                },
            ).then(
                (result) => {
                    if (result.error) {
                        showSnackbar('error', "Error occurred while taking action " + type + " on the timesheet");
                    } else {
                        if (result.data.STATUS === "FAIL") {
                            showSnackbar('error', result.data.ERROR.MESSAGE);
                        } else {
                            if (type === "SENDBACK") {
                                sendSentBackEmail(timesheetNumber,
                                    employeeID,
                                    startDate,
                                    endDate,
                                    jobName,
                                    personalEmail,
                                    applicationEmail);
                            }
                            showSnackbar('success', "Timesheet data modified.");
                            manualLoadData();
                        }
                    }
                    setApiLoading(false);
                    setIsSubmitting(false);
                },
                (error) => {
                    setApiLoading(false);
                    setIsSubmitting(false);
                    showSnackbar('error', "Error occurred while taking action " + type + " on the timesheet");
                }
            )
        }
    }

    const sendSentBackEmail = (tn, eid, tf, tt, tjn, pemail) => {
        console.log(tn);
        console.log(eid);
        console.log(tf);
        console.log(tt);
        console.log(tjn);
        console.log(pemail);
        console.log(notes);

        // Create a virtual form element
        const form = document.createElement('form');

        // Create and append input elements to the form
        const subjectInput = document.createElement('input');
        subjectInput.setAttribute('type', 'hidden');
        subjectInput.setAttribute('name', 'user_email');
        subjectInput.setAttribute('value', pemail);
        form.appendChild(subjectInput);

        const i_tn = document.createElement('input');
        i_tn.setAttribute('type', 'hidden');
        i_tn.setAttribute('name', 'tn');
        i_tn.setAttribute('value', tn);
        form.appendChild(i_tn);

        const i_eid = document.createElement('input');
        i_eid.setAttribute('type', 'hidden');
        i_eid.setAttribute('name', 'eid');
        i_eid.setAttribute('value', eid);
        form.appendChild(i_eid);

        const i_tf = document.createElement('input');
        i_tf.setAttribute('type', 'hidden');
        i_tf.setAttribute('name', 'tf');
        i_tf.setAttribute('value', tf);
        form.appendChild(i_tf);

        const i_tt = document.createElement('input');
        i_tt.setAttribute('type', 'hidden');
        i_tt.setAttribute('name', 'tt');
        i_tt.setAttribute('value', tt);
        form.appendChild(i_tt);

        const i_tjn = document.createElement('input');
        i_tjn.setAttribute('type', 'hidden');
        i_tjn.setAttribute('name', 'tjn');
        i_tjn.setAttribute('value', tjn);
        form.appendChild(i_tjn);

        const i_tjnotes = document.createElement('input');
        i_tjnotes.setAttribute('type', 'hidden');
        i_tjnotes.setAttribute('name', 'comments');
        i_tjnotes.setAttribute('value', notes);
        form.appendChild(i_tjnotes);

        //USING VSK.REMINDERS@OUTLOOK.COM
        emailjs.sendForm('service_9xt4dl9', 'template_7wygkr8', form, 'yj3Z8ada370vJfD3p')
            .then((result) => {
                showSnackbar('success', "Sent Back email sent to: " + pemail);
            }, (error) => {
                showSnackbar('error', "Error sending Sent Back email to user");
            });
    };

    return (
        <>
            <Stack direction="row" spacing={1} className='float-right'>
                <IconButton aria-label="Edit" title="Edit" color="primary" onClick={handleClick}>
                    <NewReleasesOutlinedIcon />
                </IconButton>
            </Stack>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0 }}>TIMESHEET ID: {timesheetNumber}</h2>
                        <IconButton aria-label="close" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <TextField
                        size="small"
                        margin="normal"
                        id="notes"
                        name="notes"
                        label="Notes"
                        className='w-[310px]'
                        multiline
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    {isSubmitting ? (
                        <div className="spinner"></div>
                    ) : (
                        <Stack direction="row" spacing={3}>
                            <Button color="success" variant="contained" type="submit"
                                size='small'
                                onClick={() => takeActionOnTimesheet("APPROVE")}
                                disabled={isSubmitting || !notes}>
                                <CheckCircleOutlinedIcon className="mr-1" />
                                Approve
                            </Button>
                            {/* <Button color="error" variant="contained" type="submit"
                                size='small'
                                onClick={() => takeActionOnTimesheet("REJECT")}
                                disabled={isSubmitting || !notes}>
                                <ThumbDownAltOutlinedIcon className="mr-1" />
                                Reject
                            </Button> */}
                            {mode !== "SentBack" && (
                                <Button color="warning" variant="contained" type="submit"
                                    size='small'
                                    onClick={() => takeActionOnTimesheet("SENDBACK")}
                                    disabled={isSubmitting || !notes}>
                                    <ReplyAllOutlinedIcon className="mr-1" />
                                    Send back
                                </Button>
                            )}
                        </Stack>
                    )}
                </div>
            </Popover>
        </>
    )
}

export default TimesheetAction;
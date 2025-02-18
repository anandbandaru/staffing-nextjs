import React, { useContext, useState } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { Context } from "../../context/context";
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import TimesheetReminderHistory from './timesheetReminderHistory';
import axios from 'axios';
import emailjs from 'emailjs-com';

function TimesheetEditReminders({ timesheetNumber, employeeID, startDate, endDate, jobName, personalEmail, applicationEmail, manualLoadData, showSnackbar }) {
    const { APIPath, userName } = useContext(Context);

    const sendReminder = (tn, eid, tf, tt, tjn, pemail) => {
        if (window.confirm(`Are you sure you want to send reminder?`)) {
            console.log(tn);
            console.log(eid);
            console.log(tf);
            console.log(tt);
            console.log(tjn);

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

            emailjs.sendForm('service_68p81qk', 'template_ekt8k16', form, 'r6Fya2Opl9134qi3r')
                .then((result) => {
                    showSnackbar('success', "Reminder email sent to: " + pemail);
                    console.log("sendReminder");
                    SendReminder(tn);
                }, (error) => {
                    showSnackbar('error', "Error sending email to user");
                });
        }
    };
    
    const SendReminder = (timesheetNumber) => {

        let apiUrl = APIPath + "/sendreminder";
        axios.post(apiUrl,
            {
                timesheetNumber: timesheetNumber,
                reminderSentBy: userName
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
                    showSnackbar('error', "Error occurred while saving reminder data");
                } else {
                    if (result.data.STATUS === "FAIL") {
                        showSnackbar('error', result.data.ERROR.MESSAGE);
                    } else {
                        showSnackbar('success', "Reminder data modified.");
                    }
                }
            },
            (error) => {
                showSnackbar('error', "Error occurred while saving reminder data");
            }
        )
    }

    return (
        <>
            <Stack direction="row" spacing={1} className='float-right'>
                <IconButton aria-label="SEND REMINDER"
                    title="SEND REMINDER" color="primary" onClick={() => {
                        sendReminder(timesheetNumber,
                            employeeID,
                            startDate,
                            endDate,
                            jobName,
                            personalEmail,
                            applicationEmail
                        )
                        manualLoadData();
                    }
                    } >
                    <NotificationAddIcon />
                </IconButton>
                <TimesheetReminderHistory timesheetNumber={timesheetNumber} viewType="POP" />
            </Stack>
        </>
    )
}

export default TimesheetEditReminders;
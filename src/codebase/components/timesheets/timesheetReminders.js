import React, { useContext, useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Context } from "../../context/context";
import NewReleasesOutlinedIcon from '@mui/icons-material/NewReleasesOutlined';
import Button from '@mui/material/Button';
import axios from 'axios';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';

function TimesheetReminders({ timesheetNumber, viewType }) {
    const { APIPath, userName } = useContext(Context);
    const [anchorEl, setAnchorEl] = useState(null);
    const [data, setData] = useState('');
    const [apiLoading, setApiLoading] = useState('');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        getReminders();
    }, [timesheetNumber]);

    const getReminders = () => {
        setApiLoading(true);
        let apiUrl = APIPath + "/gettimesheetreminders/" + timesheetNumber;
        axios.get(apiUrl).then(
            (result) => {
                if (result.error) {

                } else {
                    if (result.data.STATUS === "FAIL") {

                    } else {
                        setData(result.data)
                    }
                }
                setApiLoading(false);
            },
            (error) => {
                setApiLoading(false);
            }
        )
    }

    return (
        <>
            {viewType === "POP" ?
                <>
                    <Stack direction="row" spacing={1} className=''>
                        <IconButton aria-label="PAST REMINDERS" title="PAST REMINDERS" color="primary" onClick={handleClick}>
                            <NotificationsActiveOutlinedIcon />
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
                            <div className='reminderHistoryTitle'>Past Reminders:</div>
                            {data && data.data.length > 0 ?
                                data.data.map((item, index) => (
                                    <div key={index} value={item.Id} className='reminderHistoryRow'>
                                        {item.reminderSentDate} - {item.reminderSentBy}
                                    </div>
                                )) :
                                <>
                                    No reminders sent in the past
                                </>
                            }
                        </div>
                    </Popover>
                </>
                :
                <>
                    <div style={{ padding: '10px' }}>
                        <div className='reminderHistoryTitle'>Past Reminders:</div>
                        {data && data.data.length > 0 ?
                            data.data.map((item, index) => (
                                <div key={index} value={item.Id} className='reminderHistoryRow'>
                                    {item.reminderSentDate} - {item.reminderSentBy}
                                </div>
                            )) :
                            <>
                                No reminders sent in the past
                            </>
                        }
                    </div>
                </>
            }

        </>
    )
}

export default TimesheetReminders;
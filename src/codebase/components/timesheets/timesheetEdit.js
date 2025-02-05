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

function TimesheetEdit({ ID, timesheetNumber, mode, operation, manualLoadData, setApiLoading, showSnackbar }) {
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

export default TimesheetEdit;
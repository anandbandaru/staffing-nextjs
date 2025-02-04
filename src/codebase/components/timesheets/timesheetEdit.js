import React, { useContext } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Context } from "../../context/context";
import NewReleasesOutlinedIcon from '@mui/icons-material/NewReleasesOutlined';
import Button from '@mui/material/Button';
import GenericFileForm from '../forms/GenericFileForm';
import axios from 'axios';
import { TextField } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ReplyAllOutlinedIcon from '@mui/icons-material/ReplyAllOutlined';

function TimesheetEdit({ ID, timesheetNumber, operation, manualLoadData, setApiLoading, showSnackbar }) {
    const { APIPath, userName } = useContext(Context);
    const [open, setOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    //For dialog MUI
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    const handleClose = () => {
        setOpen(false);
        manualLoadData();
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));
    const takeActionOnTimesheet = (type) => {
        setApiLoading(true);
        setIsSubmitting(true);
        let apiUrl = APIPath + "/";
        if (type === "APPROVED") {
            apiUrl = APIPath + "/deleteexpense";
        }
        else if (type === "REJECT") {
            apiUrl = APIPath + "/deleteexpense";
        }
        else
            apiUrl = APIPath + "/deleteexpense";
        axios.post(apiUrl,
            {
                timesheetId: ID,
                actionBy: userName,
                notes: "",
                action: type
            },
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            },
        )
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        showSnackbar('error', "Error occured while taking action on the timesheet");
                    } else {
                        if (result.STATUS === "FAIL") {
                            showSnackbar('error', result.ERROR.MESSAGE);
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
                    showSnackbar('error', "Error occured while taking action on the timesheet");
                }
            )
    }

    return (
        <>
            <Stack direction="row" spacing={1} className='float-right'>
                <IconButton aria-label="Edit" title="Edit" color="primary" onClick={() => {
                    // window.alert(ownerID);
                    handleClickOpen();
                }
                }>
                    <NewReleasesOutlinedIcon />
                </IconButton>
            </Stack>
            <BootstrapDialog
                fullWidth
                className=""
                onClose={handleClose}
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle className="text-pink-600 w-60" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    TiMESHEET ID: {timesheetNumber}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>

                    <TextField
                        size="small"
                        margin="normal"
                        id="notes"
                        name="notes"
                        label="Notes"
                        className='w-[550px]'
                        multiline
                        rows={4}
                    />
                    {isSubmitting ? (
                        <div className="spinner"></div>
                    ) : (
                        <>
                            <Stack direction="row" spacing={3}>
                                <Button color="success" variant="contained" type="submit"
                                    onClick={() => {
                                        takeActionOnTimesheet("APPROVE");
                                    }}
                                    disabled={isSubmitting}>
                                    <CheckCircleOutlinedIcon className="mr-1" />
                                    Approve
                                </Button>
                                <Button color="error" variant="contained" type="submit"
                                    onClick={() => {
                                        takeActionOnTimesheet("REJECT");
                                    }}
                                    disabled={isSubmitting}>
                                    <ThumbDownAltOutlinedIcon className="mr-1" />
                                    Reject
                                </Button>
                                <Button color="warning" variant="contained" type="submit"
                                    onClick={() => {
                                        takeActionOnTimesheet("SENDBACK");
                                    }}
                                    disabled={isSubmitting}>
                                    <ReplyAllOutlinedIcon className="mr-1" />
                                    Send back
                                </Button>
                            </Stack>
                        </>
                    )}

                </DialogContent>
            </BootstrapDialog>

        </>

    )
}

export default TimesheetEdit;
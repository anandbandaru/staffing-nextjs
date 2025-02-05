import React, { useState, useContext, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Context } from "../../context/context";
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

function TimesheetAudit({ ID, operation, doLoading, timesheetNumber }) {
    const { APIPath, userName } = useContext(Context);
    const [open, setOpen] = useState(false);
    const [apiLoading, setApiLoading] = useState(true);
    const [dataAudit, setDataAudit] = useState({ data: [] });

    // For dialog MUI
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const handleClose = () => {
        setOpen(false);
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

    const getAuditDetails = () => {
        setApiLoading(true);
        let apiUrl = APIPath + "/gettimesheetauditdetails" + "/" + ID;
        // console.log(apiUrl)
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        setDataAudit({ data: [] });
                    } else {
                        setDataAudit(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setDataAudit({ data: [] });
                    setApiLoading(false);
                }
            );
    };
    useEffect(() => {
        // console.log("TSA:" + ID);
        // console.log("TSA:" + operation);
        // console.log("TSA:" + doLoading);
        // console.log("TSA:" + timesheetNumber);
        if (doLoading) {
            if (operation === "View" || operation === "Edit") {
                getAuditDetails();
            }
        }
    }, [ID]);

    return (
        <>
            <Stack direction="row" spacing={1} className='float-right'>
                <IconButton aria-label="History" title="History" color="secondary" onClick={handleClickOpen}>
                    <HistoryOutlinedIcon />
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
                    TIMESHEET ID: {timesheetNumber}
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
                    <div >
                        <VerticalTimeline layout='1-column-left'>
                            {dataAudit.data.map((entry, index) => (
                                <VerticalTimelineElement
                                    key={index}
                                    iconStyle={{ background: '#ccc', color: '#000' }}
                                >
                                    <h3 className="vertical-timeline-element-title ">Event {dataAudit.data.length - index} on: {entry.actionDate}</h3>
                                    <h4 className="vertical-timeline-element-subtitle">By: {entry.actionBy}</h4>
                                    <h4 className="vertical-timeline-element-subtitle2">Hours: {entry.hours}</h4>
                                    <div className='vertical-timeline-element-notes'>{entry.action}</div>
                                </VerticalTimelineElement>
                            ))}
                        </VerticalTimeline>
                    </div>
                </DialogContent>
            </BootstrapDialog>
        </>
    )
}

export default TimesheetAudit;
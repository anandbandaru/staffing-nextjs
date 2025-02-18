import React, { useContext, useState } from "react";
import 'reactjs-popup/dist/index.css';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const PendingListToolbar = ({ operation, jobsCount, itemCount, apiLoading, dataAPIError, manualLoadData, employeesCount }) => {
    const [open, setOpen] = React.useState(false);
    //For dialog MUI
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
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

    return (
        <>
            <div className="flex flex-grow">
                <div className="flex flex-grow items-center place-items-center">
                    <Stack direction="row" spacing={1} className="place-items-center">
                        {employeesCount && (
                            <div className="flex flex-grow-0 bg-gray-500 text-white text-sm py-2 px-3">
                                <span className="">Total {operation} Employees:</span>
                                <span className="font-bold text-sm ml-2">{employeesCount}</span>
                            </div>
                        )}
                        <div className="flex flex-grow-0 bg-gray-500 text-white text-sm py-2 px-3">
                            <span className="">Total Jobs:</span>
                            <span className="font-bold text-sm ml-2">{jobsCount}</span>
                        </div>
                        <div className="flex flex-grow-0 bg-gray-500 text-white text-sm py-2 px-3">
                            <span className="">Total {operation} Timesheets:</span>
                            <span className="font-bold text-sm ml-2">{itemCount}</span>
                        </div>

                        {/* REFRESH ICON */}
                        <div className="float-right ">
                            <Button size="small" variant="contained"
                                onClick={manualLoadData}
                                disabled={apiLoading}
                            >
                                {apiLoading ? <div className="spinner"></div> :
                                    <>
                                        <CachedIcon className="mr-1" />
                                        Refresh now
                                    </>}

                            </Button>
                        </div>
                        {/* REFRESH ICON */}
                        {/* API LOADER & MESSAGE */}
                        {apiLoading ?
                            <>
                                <span className="text-white">loading...</span>
                            </> : <div className="text-s hidden lg:inline-block dark:text-white">
                                API Call Status:
                                {dataAPIError ?
                                    <span className="bg-red-600 px-2 rounded-sm mx-2">{dataAPIError}</span>
                                    :
                                    <CheckCircleOutlinedIcon className="ml-2 text-green-500" />
                                }
                            </div>}
                        {/* API LOADER & MESSAGE */}
                    </Stack>
                </div>
            </div>
        </>
    )
}

export default PendingListToolbar;
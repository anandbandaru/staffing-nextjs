import React from "react";
import 'reactjs-popup/dist/index.css';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import VendorForm from "./vendorForm";
import Stack from '@mui/material/Stack';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const VendorsListToolbar = ({ operation, itemCount, apiLoading, dataAPIError, manualLoadData }) => {
    const [open, setOpen] = React.useState(false);
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

    return (
        <>
            <div className="flex flex-grow">
                <div className="flex flex-grow items-center place-items-center">
                    <Stack direction="row" spacing={1} className="place-items-center">
                        <div className="flex flex-grow-0 bg-gray-500 text-white text-sm py-2 px-3">
                            <span className="">Total:</span>
                            <span className="font-bold text-sm ml-2">{itemCount}</span>
                        </div>
                        <Button size="small" variant="contained" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={handleClickOpen}>
                            {operation}
                        </Button>

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
            <BootstrapDialog
                onClose={handleClose}
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle className="text-pink-600" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    {operation} Vendor
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
                    <VendorForm operation="New" />
                </DialogContent>
            </BootstrapDialog>
        </>
    )
}

export default VendorsListToolbar;
import React, { memo } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import OwnerForm from "./ownerForm";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AttachmentSharpIcon from '@mui/icons-material/AttachmentSharp';
import GenericFileForm from '../forms/GenericFileForm';

function OwnerEdit({ ID, operation, manualLoadData }) {
    const [open, setOpen] = React.useState(false);
    const [openDocuments, setOpenDocuments] = React.useState(false);
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
    const handleCloseDocuments = () => {
        setOpenDocuments(false);
    };
    const handleClickOpenDocuments = () => {
        setOpenDocuments(true);
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
            <Stack direction="row" spacing={1} className='float-right'>
                <IconButton aria-label="Documents" title="Documents" color="primary" onClick={() => {
                    handleClickOpenDocuments();
                }
                }>
                    <AttachmentSharpIcon />
                </IconButton>
                <IconButton aria-label="Edit" title="Edit" color="primary" onClick={() => {
                    // window.alert(ownerID);
                    handleClickOpen();
                }
                }>
                    <EditIcon />
                </IconButton>
                <IconButton aria-label="Delete" title="Delete" color="error" onClick={() => {
                    window.alert(ID);
                }
                }>
                    <DeleteIcon />
                </IconButton>
            </Stack>

            {/* EDIT SCREEN */}
            <BootstrapDialog
                className=""
                onClose={handleClose}
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle className="text-pink-600" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    {operation} Owner: ID: {ID}
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
                    <OwnerForm ID={ID} operation="Edit" />
                </DialogContent>
            </BootstrapDialog>

            {/* DOCUMENTS */}
            <BootstrapDialog
                className=""
                onClose={handleCloseDocuments}
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={openDocuments}
            >
                <DialogTitle className="text-pink-600 w-60" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    Documents: Owner: ID: {ID}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseDocuments}
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
                    <GenericFileForm moduleId={ID} componentName="OWNERS" />
                </DialogContent>
            </BootstrapDialog>
        </>

    )
}

export default OwnerEdit;
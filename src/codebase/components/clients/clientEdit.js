import React, { useState, useContext } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ClientForm from "./clientForm";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Context } from "../../context/context";
import axios from 'axios';

function ClientEdit({ ID, operation, manualLoadData, setApiLoading }) {
    const { APIPath } = useContext(Context);
    const [open, setOpen] = React.useState(false);
    const [isDeletionError, setDeletionError] = useState(false);
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
    const deleteClientByID = () => {
        setApiLoading(true);
        let apiUrl = APIPath + "/deleteclient"
        axios.post(apiUrl,
            {
                Id: ID
            },
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            },
        ).then((resp) => {
            setDeletionError(false);
            manualLoadData();
        }).catch(function (error) {
            console.log(error);
            setDeletionError(true);
        });
    }

    return (
        <>
            <Stack direction="row" spacing={1} className='float-right'>
                <IconButton aria-label="Edit" title="Edit" color="primary" onClick={() => {
                    // window.alert(ownerID);
                    handleClickOpen();
                }
                }>
                    <EditIcon />
                </IconButton>
                <IconButton aria-label="Delete" title="Delete" color="error" onClick={() => {
                    const userConfirmed = window.confirm("Are you sure you want to delete this item with ID? - " + ID);
                    if (userConfirmed) {
                        deleteClientByID();
                    } else {
                        console.log("Delete operation cancelled");
                    }
                }
                }>
                    <DeleteIcon />
                </IconButton>
            </Stack>
            <BootstrapDialog
                className=""
                onClose={handleClose}
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle className="text-pink-600 w-60" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    {operation} Client: ID: {ID}
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
                    <ClientForm ID={ID} operation="Edit" />
                </DialogContent>
            </BootstrapDialog>
        </>

    )
}

export default ClientEdit;
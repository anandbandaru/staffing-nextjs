import React, { useContext } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ExpenseTypeForm from "./expenseTypeForm";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Context } from "../../context/context";
import axios from 'axios';

function ExpenseTypeEdit({ ID, operation, manualLoadData, setApiLoading, showSnackbar }) {
    const { APIPath } = useContext(Context);
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
    const deleteItem = () => {
        setApiLoading(true);
        let apiUrl = APIPath + "/deleteexpensetype"
        axios.post(apiUrl,
            {
                Id: ID
            },
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                }
            },
        ).then((resp) => {
            setApiLoading(false);
            manualLoadData();
            if (resp.data.ERROR.MESSAGE.includes("The DELETE statement conflicted with the REFERENCE constraint"))
                showSnackbar('warning', "Cannot delete Item due to child rows");
            else
                showSnackbar('success', "Item deleted.");
        }).catch(function (error) {
            setApiLoading(false);
            showSnackbar('error', "Error occured while deletion");
            // console.log(error);
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
                    const userInput = window.prompt("Type DELETE to confirm deletion of the item with ID: " + ID);
                    if (userInput.toUpperCase() === "DELETE") {
                        deleteItem();
                    } else {
                        // console.log("Delete operation cancelled");
                        showSnackbar('warning', "Delete operation cancelled");
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
                    {operation} Expense Type: ID: {ID}
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
                    <ExpenseTypeForm ID={ID} operation="Edit" />
                </DialogContent>
            </BootstrapDialog>
        </>

    )
}

export default ExpenseTypeEdit;
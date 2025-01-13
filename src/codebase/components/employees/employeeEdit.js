import React, { useContext } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import EmployeeForm from "./employeeForm";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BackupIcon from '@mui/icons-material/Backup';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import AirplanemodeActiveOutlinedIcon from '@mui/icons-material/AirplanemodeActiveOutlined';
import { Context } from "../../context/context";
import axios from 'axios';
import GenericFileForm from '../forms/GenericFileForm';
import EmployeeGAddForm from './employeeGAddForm';

function EmployeeEdit({ ID, operation, manualLoadData, setApiLoading, showSnackbar }) {
    const { APIPath } = useContext(Context);
    const [open, setOpen] = React.useState(false);
    const [openDocuments, setOpenDocuments] = React.useState(false);
    const [openGenericForm, setOpenGenericForm] = React.useState(false);
    const [formType, setFormType] = React.useState('');

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

    const handleCloseDocuments = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenDocuments(false);
    };

    const handleClickOpenDocuments = () => {
        setOpenDocuments(true);
    };

    const handleCloseGenericForm = () => {
        setOpenGenericForm(false);
    };

    const handleClickOpenGenericForm = (type) => {
        setFormType(type);
        setOpenGenericForm(true);
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
        let apiUrl = APIPath + "/deleteemployee"
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
            setApiLoading(false);
            manualLoadData();            
            if (resp.data.ERROR.MESSAGE.includes("The DELETE statement conflicted with the REFERENCE constraint"))
                showSnackbar('warning', "Cannot delete Item due to child rows");
            if (resp.data.ERROR.MESSAGE.includes("Cannot delete employee. There are related records in temp_Expenses."))
                showSnackbar('warning', "Cannot delete employee. There are related records in Expenses.");
            else
                showSnackbar('success', "Item deleted.");
        }).catch(function (error) {
            setApiLoading(false);
            showSnackbar('error', "Error occured while deletion");
            console.log(error);
        });
    }

    return (
        <>
            <Stack direction="row" spacing={0.5} className='float-right'>
                <IconButton aria-label="Passports" title="Passports" color="primary" onClick={() => handleClickOpenGenericForm('Passport')}>
                    <BadgeOutlinedIcon />
                </IconButton>
                <IconButton aria-label="Visas" title="Visas" color="primary" onClick={() => handleClickOpenGenericForm('Visa')}>
                    <PublicOutlinedIcon />
                </IconButton>
                <IconButton aria-label="Dependents" title="Dependents" color="primary" onClick={() => handleClickOpenGenericForm('Dependent')}>
                    <SupervisorAccountOutlinedIcon />
                </IconButton>
                <IconButton aria-label="I94" title="I94" color="primary" onClick={() => handleClickOpenGenericForm('I94')}>
                    <AirplanemodeActiveOutlinedIcon />
                </IconButton>
                <IconButton aria-label="Upload Documents" title="Upload Documents" color="primary" onClick={handleClickOpenDocuments}>
                    <BackupIcon />
                </IconButton>
                <IconButton aria-label="Edit" title="Edit" color="primary" onClick={handleClickOpen}>
                    <EditIcon />
                </IconButton>
                <IconButton aria-label="Delete" title="Delete" color="error" onClick={() => {
                    const proceed = window.confirm("This will delete all child table rows, including:\n- Visas\n- Passports\n- I94\n- Dependants\nDo you want to proceed?");
                    if (proceed) {
                        const userInput = window.prompt("Type DELETE to confirm deletion of the item with ID: " + ID);
                        if (userInput && userInput.toUpperCase() === "DELETE") {
                            deleteItem();
                        } else {
                            console.log("Delete operation cancelled");
                            showSnackbar('warning', "Delete operation cancelled");
                        }
                    } else {
                        console.log("Delete operation cancelled");
                        showSnackbar('warning', "Delete operation cancelled");
                    }
                }}>
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
                    {operation} Employee: ID: {ID}
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
                    <EmployeeForm ID={ID} operation="Edit" />
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
                    Documents: Employee: ID: {ID}
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
                    <GenericFileForm moduleId={ID} componentName="EMPLOYEES" />
                </DialogContent>
            </BootstrapDialog>

            {/* GENERIC FORM */}
            <BootstrapDialog
                className=""
                onClose={handleCloseGenericForm}
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={openGenericForm}
            >
                <DialogTitle className="text-pink-600 w-60" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    {formType}: Employee: ID: {ID}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseGenericForm}
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
                    <EmployeeGAddForm formType={formType} employeeID={ID} />
                </DialogContent>
            </BootstrapDialog>
        </>
    );
}

export default EmployeeEdit;
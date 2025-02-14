import React, { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (type) => {
        setFormType(type);
        setOpenGenericForm(true);
        handleMenuClose();
    };

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

    const handleCloseDocuments = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenDocuments(false);
    };

    const handleClickOpenDocuments = () => {
        setOpenDocuments(true);
    };

    const handleCloseGenericForm = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenGenericForm(false);
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
                    'ngrok-skip-browser-warning': 'true',
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
        });
    }

    return (
        <>
            <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleMenuOpen}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem
                // onClick={() => handleMenuItemClick('Passport')}
                >
                    <BadgeOutlinedIcon className='mr-2' /> E-Verify
                </MenuItem>
                <MenuItem onClick={handleClickOpenDocuments}>
                    <BackupIcon className='mr-2' /> Upload Documents
                </MenuItem>
                <MenuItem onClick={handleClickOpen}>
                    <EditIcon className='mr-2' /> Edit
                </MenuItem>
                {/* <MenuItem onClick={() => handleMenuItemClick('Visa')}>
                    <PublicOutlinedIcon className='mr-2' /> Visas
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('Dependent')}>
                    <SupervisorAccountOutlinedIcon className='mr-2' /> Dependents
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('I94')}>
                    <AirplanemodeActiveOutlinedIcon className='mr-2' /> I94
                </MenuItem> */}
            </Menu>
            {/* <IconButton aria-label="Upload Documents" title="Upload Documents" color="primary" onClick={handleClickOpenDocuments}>
                <BackupIcon />
            </IconButton> */}
            {/* <IconButton aria-label="Edit" title="Edit" color="primary" onClick={handleClickOpen}>
                <EditIcon />
            </IconButton> */}
            <IconButton aria-label="Delete" title="Delete" color="error" onClick={() => {
                const proceed = window.confirm("This will delete all child table rows, including:\n- Visas\n- Passports\n- I94\n- Dependants\nDo you want to proceed?");
                if (proceed) {
                    const userInput = window.prompt("Type DELETE to confirm deletion of the item with ID: " + ID);
                    if (userInput && userInput.toUpperCase() === "DELETE") {
                        deleteItem();
                    } else {
                        // console.log("Delete operation cancelled");
                        showSnackbar('warning', "Delete operation cancelled");
                    }
                } else {
                    // console.log("Delete operation cancelled");
                    showSnackbar('warning', "Delete operation cancelled");
                }
            }}>
                <DeleteIcon />
            </IconButton>

            {/* EDIT SCREEN */}
            <BootstrapDialog
                fullScreen
                className="myFullScreenDialog"
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
                fullScreen
                className="myFullScreenDialog"
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
                fullScreen
                className="myFullScreenDialog"
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
import React, { useContext, useState } from "react";
import configData from "../../../CONFIG_RELEASE.json";
import 'reactjs-popup/dist/index.css';
import Button from '@mui/material/Button';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Context } from "../../context/context";
import CustomSnackbar from "../snackbar/snackbar";

const OwnerDocumentsNew = () => {
    const [componentName, setComponentName] = useState('OWNERS');
    const [folderNameToCreate, setFolderNameToCreate] = useState('OWNERS 1');

    const { APIPath, createGDriveFolder } = useContext(Context);
    const [parentId, setParentId] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const createFolder = async () => {
        const folder = configData.GOOGLEDRIVE_FOLDERS.find(f => f.foldername === componentName);
        if (folder) {
            setParentId(folder.folderid);
            const result = await createGDriveFolder(folder.folderid, folderNameToCreate);
            if (result.FOLDER_ID) {
                showSnackbar('success', `Folder created successfully`);
            } else {
                showSnackbar('error', 'Error creating folder');
            }
        } else {
            console.log("Folder not found")
            showSnackbar('error', "Folder not found")
        }
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const showSnackbar = (severity, message) => {
        setSnackbarSeverity(severity);
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    return (
        <>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <Button size="small" variant="contained" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={createFolder}>
                CREATE FOLDER
            </Button>
        </>
    )
}

export default OwnerDocumentsNew;
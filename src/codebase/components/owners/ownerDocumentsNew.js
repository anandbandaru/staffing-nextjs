import React, { useContext, useState } from "react";
import configData from "../../../CONFIG_RELEASE.json";
import 'reactjs-popup/dist/index.css';
import Button from '@mui/material/Button';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Context } from "../../context/context";
import CustomSnackbar from "../snackbar/snackbar";
import { TextField } from '@mui/material';
import axios from 'axios';

const OwnerDocumentsNew = () => {
    const [componentName, setComponentName] = useState('OWNERS');
    const [folderNameToCreate, setFolderNameToCreate] = useState('OWNERS 1');

    const { APIPath, createGDriveFolder } = useContext(Context);
    const [parentId, setParentId] = useState('');
    const [file, setFile] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    const showSnackbar = (severity, message) => {
        setSnackbarSeverity(severity);
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const createFolder = async () => {
        const parentFolderId = configData.GOOGLEDRIVE_FOLDERS.find(f => f.foldername === componentName).folderid;
        if (parentFolderId) {
            setParentId(parentFolderId);
            const result = await createGDriveFolder(parentFolderId, folderNameToCreate);
            if (result.FOLDER_ID) {
                showSnackbar('success', `Folder created successfully`);
            } else {
                showSnackbar('error', 'Error creating folder');
            }
        } else {
            // console.log("Folder not found")
            showSnackbar('error', "Folder not found")
        }
    };
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    const handleFileSubmit = async () => {
        if (!file) {
            showSnackbar('error', 'No file selected');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        const parentFolderId = configData.GOOGLEDRIVE_FOLDERS.find(f => f.foldername === componentName).folderid;

        formData.append('parentfolderid', parentFolderId);

        try {
            axios.post(APIPath + '/uploadfile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'ngrok-skip-browser-warning': 'true',
                },
            }).then((resp) => {
                showSnackbar('success', `File uploaded successfully: ${resp.data.FILE_PATH}`);
            }).catch(function (error) {
                // console.log(error);
                showSnackbar('error', 'Error while uploading: ' + error);
            });
        } catch (error) {
            showSnackbar('error', 'Error uploading file');
        }
    };

    return (
        <>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            {/* <Button size="small" variant="contained" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={createFolder}>
                CREATE FOLDER
            </Button> */}
            <TextField
                type="file"
                onChange={handleFileChange}
                variant="outlined"
                fullWidth
                margin="normal"
            />
            <Button variant="contained" startIcon={<AddCircleOutlineOutlinedIcon />} color="primary" onClick={handleFileSubmit}>
                Upload
            </Button>
        </>
    )
}

export default OwnerDocumentsNew;
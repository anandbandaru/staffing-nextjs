import React, { useState, useContext, useRef, useEffect } from 'react';
import { Context } from "../../context/context";
import configData from "../../../CONFIG_RELEASE.json";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Stack from '@mui/material/Stack';
import CustomSnackbar from "../snackbar/snackbar";
import Alert from '@mui/material/Alert';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

function GenericFileForm({ props, componentName, moduleId }) {

    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const [formSubmitionAPIError, setFormSubmitionAPIError] = useState(false);
    const [formSubmitionAPIErrorMessage, setFormSubmitionAPIErrorMessage] = useState("");
    const [gDriveFolderNotPresent, setGDriveFolderNotPresent] = useState(false);

    //FILE RELATED
    const [file, setFile] = useState(null);
    //FILE RELATED

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

    //FILE RELATED
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    //FILE RELATED

    //page title
    useEffect(() => {
        try {
            // setParentId(configData.GOOGLEDRIVE_FOLDERS.find(f => f.foldername === componentName).folderid);
        } catch (error) {
            setGDriveFolderNotPresent(true);
            showSnackbar('error', 'There is no Google Drive configured for this module');
        }
    });

    return (
        <>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            {gDriveFolderNotPresent ?
                <>
                    <Alert severity="error">There is no Google Drive configured for this module</Alert>
                </>
                :
                <>
                    <Stack direction="column" spacing={1} className='justify-center items-center'>
                        <Chip label={`In this screen, file would be uploaded into below folder of Google Drive by default`} />
                        <Chip label={`${componentName}`} color='warning' />
                    </Stack>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            title: '',
                            module: componentName,
                            moduleId: moduleId,
                            createdBy: userName,
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            setSubmitionCompleted(false);
                            setSubmitting(true);
                            const formData = new FormData();
                            formData.append('file', file);
                            const parentFolderId = configData.GOOGLEDRIVE_FOLDERS.find(f => f.foldername === componentName).folderid;
                            formData.append('parentfolderid', parentFolderId);
                            formData.append('title', values.title);
                            formData.append('createdBy', userName);
                            formData.append('notes', values.notes);
                            formData.append('module', componentName);
                            formData.append('moduleId', moduleId);

                            axios.post(APIPath + '/uploadfile', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            }).then((resp) => {
                                setSubmitionCompleted(true);

                                if (resp.data.STATUS !== "SUCCESS") {
                                    setFormSubmitionAPIError(true);
                                    setFormSubmitionAPIErrorMessage("ERROR: " + resp.data.ERROR.MESSAGE);
                                    showSnackbar('error', 'File upload failed');
                                }
                                else {
                                    setFormSubmitionAPIError(false);
                                    showSnackbar('success', 'File uploaded successfully');
                                }
                            }).catch(function (error) {
                                setSubmitionCompleted(true);
                                setFormSubmitionAPIErrorMessage(error);
                                setFormSubmitionAPIError(true);
                                console.log(error);
                                showSnackbar('error', 'Error while uploading: ' + error);
                            });

                        }}

                        validationSchema={Yup.object().shape({
                            title: Yup.string()
                                .required('title Required'),
                            notes: Yup.string()
                                .required('notes Required'),
                            file: Yup.string()
                                .required('file Required'),
                        })}
                    >
                        {(props) => {
                            const {
                                values,
                                touched,
                                errors,
                                isSubmitting,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                            } = props;
                            return (
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="module"
                                        name="module"
                                        label="Module"
                                        disabled
                                        value={values.module}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="moduleId"
                                        name="moduleId"
                                        label="Module Id"
                                        disabled
                                        value={values.moduleId}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="title"
                                        name="title"
                                        label="Title"
                                        value={values.title}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.title && touched.title) && errors.title}
                                    />
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="notes"
                                        name="notes"
                                        label="Notes"
                                        multiline
                                        rows={4}
                                        value={values.notes}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.notes && touched.notes) && errors.notes}
                                    />
                                    {/* <>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload files
                                    <VisuallyHiddenInput
                                        type="file"
                                        size="small"
                                        id="file"
                                        name="file"
                                        margin="normal"
                                        onChange={(event) => {
                                            handleChange(event);
                                            handleFileChange(event);
                                        }}
                                        onBlur={handleBlur}
                                        helperText={(errors.file && touched.file) && errors.file}
                                    />
                                </Button>
                            </> */}
                                    {/* <label for="file" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                                Select a File
                            </label> */}
                                    <TextField
                                        className='bg-yellow-100 text-white py-2 px-4 rounded-md hover:bg-blue-200 fileUploadControl'
                                        type="file"
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="file"
                                        name="file"
                                        onChange={(event) => {
                                            handleChange(event);
                                            handleFileChange(event);
                                        }}
                                        onBlur={handleBlur}
                                        helperText={(errors.file && touched.file) && errors.file}
                                    />
                                    {Object.keys(errors).length > 0 && (
                                        <div className="error-summary bg-red-500 my-4 p-2 text-white rounded-md">
                                            <span className='error-summary-heading' >Validation Errors:</span>
                                            <ul>
                                                {Object.keys(errors).map((key) => (
                                                    <li key={key}><KeyboardArrowRightOutlinedIcon />{errors[key]}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <Stack direction="row" spacing={2} className='float-right mt-10'>
                                        <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                            <SaveOutlinedIcon className="mr-1" />
                                            Save
                                        </Button>
                                        {isSubmitionCompleted && !formSubmitionAPIError ?
                                            <Chip label="Data saved" color="success" />
                                            :
                                            <>
                                                {formSubmitionAPIError ?
                                                    <Chip label={formSubmitionAPIErrorMessage} color="error" />
                                                    : <></>}
                                            </>
                                        }
                                    </Stack>
                                </form>
                            );
                        }}
                    </Formik>
                </>
            }
        </>
    );
}

export default GenericFileForm;
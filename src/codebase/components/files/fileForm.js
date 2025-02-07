import React, { useState, useContext, useRef } from 'react';
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
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import FormSlider from '../slider/formSlider';

function FileForm({ props, ID, operation }) {
    const [componentName] = useState('APPLICATION');

    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    // Default width
   const [formWidth, setFormWidth] = useState(700);
   const handleSliderChange = (event, newValue) => {
       setFormWidth(newValue);
   };

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


    return (
        <>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <Stack direction="column" spacing={1} className='justify-center items-center'>
                <Chip label={`In this screen, file would be uploaded into below folder of Google Drive by default`} />
                <Chip label={`${componentName}`} color='warning' />
            </Stack>
            <Formik
                enableReinitialize
                initialValues={{
                    Id: 'This will be auto-generated once you save',
                    title: '',
                    module: '',
                    moduleId: '',
                    createdBy: userName,
                }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
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
                    formData.append('moduleId', '');

                    axios.post(APIPath + '/uploadfile', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'ngrok-skip-browser-warning': 'true',
                        },
                    }).then((resp) => {
                        setSubmitionCompleted(true);
                        setSubmitting(false);
                        if (resp.data.STATUS !== "SUCCESS") {
                            showSnackbar('error', 'File upload failed');
                        }
                        else {
                            showSnackbar('success', 'File uploaded successfully');
                            resetForm();
                        }
                    }).catch(function (error) {
                        setSubmitionCompleted(true);
                        setSubmitting(false);
                        // console.log(error);
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
                        dirty,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        handleReset
                    } = props;
                    return (
                        <form onSubmit={handleSubmit} style={{ maxWidth: `${formWidth}px`, margin: '0 auto' }}>
                                <FormSlider value={formWidth} onChange={handleSliderChange} />
                            <TextField
                                size="small"
                                margin="normal"
                                fullWidth
                                id="Id"
                                name="Id"
                                label="Id"
                                disabled
                                value={values.Id}
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
                                {operation === "Edit" ?
                                    <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                        <SaveOutlinedIcon className="mr-1" />
                                        Update
                                    </Button>
                                    : <>
                                        <Button
                                            ref={resetButtonRef}
                                            variant="outlined"
                                            color="warning"
                                            onClick={handleReset}
                                            disabled={!dirty || (isSubmitting && !isSubmitionCompleted)}
                                        >
                                            Reset
                                        </Button>
                                        {isSubmitting ? (
                                            <div className="spinner"></div>
                                        ) : (
                                            <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                                <SaveOutlinedIcon className="mr-1" />
                                                Save
                                            </Button>
                                        )}
                                    </>
                                }
                            </Stack>
                        </form>
                    );
                }}
            </Formik>
        </>
    );
}

export default FileForm;
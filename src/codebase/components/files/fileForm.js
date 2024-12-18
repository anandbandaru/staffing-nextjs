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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function FileForm({ props, ID, operation }) {
    const [componentName, setComponentName] = useState('APPLICATION');

    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const [formSubmitionAPIError, setFormSubmitionAPIError] = useState(false);
    const [formSubmitionAPIErrorMessage, setFormSubmitionAPIErrorMessage] = useState("");
    const resetButtonRef = useRef(null);
    const [apiLoading, setApiLoading] = useState(true);
    const [apiLoadingError, setApiLoadingError] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");

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

    //page title
    useEffect(() => {
        setParentId(configData.GOOGLEDRIVE_FOLDERS.find(f => f.foldername === componentName).folderid);
    });

    return (
        <>
            <Stack direction="row" spacing={2} className='justify-center items-center'>
                <InfoOutlinedIcon />
                <Chip label={`In this screen, file would be uploaded into ${componentName} folder of Google Drive by default`} />
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
                onSubmit={(values, { setSubmitting }) => {
                    setApiLoading(true)
                    setSubmitionCompleted(false);
                    setSubmitting(true);
                    const formData = new FormData();
                    formData.append('file', file);
                    const parentFolderId = configData.GOOGLEDRIVE_FOLDERS.find(f => f.foldername === componentName).folderid;
                    formData.append('parentfolderid', parentFolderId);

                    axios.post(APIPath + '/uploadfile', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }).then((resp) => {
                        setSubmitionCompleted(true);
                        setFormSubmitionAPIError(false);
                        showSnackbar('success', `File uploaded successfully: ${resp.data.FILE_PATH}`);
                        setApiLoading(false)
                    }).catch(function (error) {
                        setSubmitionCompleted(true);
                        setFormSubmitionAPIErrorMessage(error);
                        setFormSubmitionAPIError(true);
                        console.log(error);
                        showSnackbar('error', 'Error while uploading: ' + error);
                        setApiLoading(false)
                    });

                }}

                validationSchema={Yup.object().shape({
                    title: Yup.string()
                        .required('Required'),
                    module: Yup.string()
                        .required('Required'),
                    notes: Yup.string()
                        .required('Required'),
                    file: Yup.string()
                        .required('Required'),
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
                        <form onSubmit={handleSubmit}>
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
                            <TextField
                                type="file"
                                size="small"
                                margin="normal"
                                fullWidth
                                id="file"
                                name="file"
                                value={values.file}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.file && touched.file) && errors.file}
                            />
                            <Stack direction="row" spacing={2} className='float-right'>
                                <div>
                                    {ID}:{operation}
                                </div>
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
                                            disabled={!dirty || isSubmitting && !isSubmitionCompleted}
                                        >
                                            Reset
                                        </Button>
                                        <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                            <SaveOutlinedIcon className="mr-1" />
                                            Save
                                        </Button>
                                    </>
                                }
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
    );
}

export default FileForm;
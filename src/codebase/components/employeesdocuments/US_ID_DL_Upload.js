import React, { useState, useContext, useRef, useEffect } from 'react';
import { Context } from "../../context/context";
import configData from "../../../CONFIG_RELEASE.json";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Stack from '@mui/material/Stack';
import CustomSnackbar from "../snackbar/snackbar";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

function US_ID_DL_Upload({ userEmployeeId, operation, code }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);

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
    const [insertedEDocId, setInsertedEDocId] = useState(false);

    const [file, setFile] = useState(null);
    const handleFileChangefile = (event) => {
        setFile(event.target.files[0]);
    };
    const UploadJobFiles = async (file, fileName, componentName, moduleId) => {
        const formData = new FormData();
        formData.append('file', file);
        const parentFolderId = configData.GOOGLEDRIVE_FOLDERS.find(f => f.foldername === componentName).folderid;
        formData.append('parentfolderid', parentFolderId);
        formData.append('title', fileName);
        formData.append('createdBy', userName);
        formData.append('notes', code);
        formData.append('module', componentName);
        formData.append('moduleId', moduleId);

        try {
            const resp = await axios.post(APIPath + '/uploadfile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            if (resp.data.STATUS !== "SUCCESS") {
                throw new Error("ERROR: " + resp.data.ERROR.MESSAGE);
            } else {
                showSnackbar('success', code + ' - File uploaded successfully');
            }
        } catch (error) {
            showSnackbar('error', code + ' - Error while uploading: ' + error.message);
        }
    };

    function getCurrentDateTime() {
        const now = new Date();

        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        return `${month}-${day}-${year}-${hours}-${minutes}`;
    }

    return (
        <>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <Formik
                enableReinitialize
                initialValues={{
                    employeeId: userEmployeeId,
                    createdBy: userName,
                    code: code,
                    US_ID_DL_IDNumber: '',
                    US_ID_DL_ExpiryDate: '',
                    US_ID_DL_Done: 1,
                    //NULLS HERE       
                    SSN_IDNumber: null,
                    SSN_Done: null,
                    PASSPORT_IDNumber: null,
                    PASSPORT_IssueDate: null,
                    PASSPORT_ExpiryDate: null,
                    PASSPORT_Done: null,
                    I94_IDNumber: null,
                    I94_ExpiryDate: null,
                    I94_Done: null,
                    ALL_I20S_SevisNumber: null,
                    ALL_I20S_Done: null,
                    OPT_H4_CARDS_IDNumber: null,
                    OPT_H4_CARDS_StartDate: null,
                    OPT_H4_CARDS_EndDate: null,
                    OPT_H4_CARDS_Done: null,
                    UNDER_GRAD_CERT_Done: null,
                    GRAD_CERT_Done: null,
                    TENTH_INTERMEDIATE_Done: null,
                    I9_FORM_Done: null,
                    CONSENT_AGREEMENT_Done: null,
                    W4_FORM_Done: null,
                    ADP_FORM_Done: null,
                    WORK_PERMIT_Type: null,
                    WORK_PERMIT_ExpiryDate: null,
                    WORK_PERMIT_Done: null,
                    ADDITIONAL_DOCS_Done: null,
                }}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    var finalAPI = APIPath + "/addemployeedocument";
                    setSubmitionCompleted(false);
                    setSubmitting(true);
                    try {
                        const resp = await axios.post(finalAPI, values, {
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type': 'application/json',
                                'ngrok-skip-browser-warning': 'true',
                            }
                        });
                        if (resp.data.STATUS === "FAIL") {
                            showSnackbar('error', "Error saving data");
                            setSubmitting(false);
                            setSubmitionCompleted(true);
                        } else {
                            setInsertedEDocId(resp.data.RELATED_ID);
                            let fileName = "EMPLOYEE_DOCS:" + code + ":" + userEmployeeId + ":" + resp.data.RELATED_ID + "_" + getCurrentDateTime();
                            if (file)
                                await UploadJobFiles(file, fileName, 'EMPLOYEES', resp.data.RELATED_ID);
                            showSnackbar('success', "Data saved");
                            resetForm();
                        }
                    } catch (error) {
                        setSubmitting(false);
                        setSubmitionCompleted(true);
                        showSnackbar('error', "Error saving data");
                    }
                }}

                validationSchema={Yup.object().shape({
                    US_ID_DL_IDNumber: Yup.string()
                        .required(code + ' Number Required'),
                    US_ID_DL_ExpiryDate: Yup.string()
                        .required(code + ' Expiry Date Required'),
                    file: Yup.string().required(code + ' Document is required'),
                })
                }
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
                                id="US_ID_DL_IDNumber"
                                name="US_ID_DL_IDNumber"
                                label="US ID \ DL ID Number"
                                value={values.US_ID_DL_IDNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.US_ID_DL_IDNumber && touched.US_ID_DL_IDNumber) && errors.US_ID_DL_IDNumber}
                            />
                            <Stack direction="row" spacing={2} className="flex items-center pl-2 mt-4">
                                <div className='flex-1'>Expiry Date:</div>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    className='flex-1'
                                    id="US_ID_DL_ExpiryDate"
                                    name="US_ID_DL_ExpiryDate"
                                    type="date"
                                    value={values.US_ID_DL_ExpiryDate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.US_ID_DL_ExpiryDate && touched.US_ID_DL_ExpiryDate) && errors.US_ID_DL_ExpiryDate}
                                />
                            </Stack>
                            <Stack direction="row" spacing={1} className='mt-6'>
                                <TextField
                                    className='bg-orange-100 text-white py-2 px-4 rounded-md hover:bg-blue-200 fileUploadControl'
                                    type="file"
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="file"
                                    name="file"
                                    disabled={isSubmitting}
                                    onChange={(event) => {
                                        handleChange(event);
                                        handleFileChangefile(event);
                                    }}
                                    onBlur={handleBlur}
                                    helperText={(errors.file && touched.file) && errors.file}
                                />
                            </Stack>
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
                            <Stack direction="row" spacing={2} className='float-right mt-2'>
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
                            </Stack>
                        </form>
                    );
                }}
            </Formik>
        </>
    );
}

export default US_ID_DL_Upload;
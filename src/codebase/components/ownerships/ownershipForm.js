import React, { useState, useContext, useRef, useEffect } from 'react';
import { Context } from "../../context/context";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CustomSnackbar from "../snackbar/snackbar";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import FormSlider from '../slider/formSlider';

function OwnershipForm({ props, ID, operation }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [ownersData, setOwnersData] = useState({ data: [] });
    const [companiesData, setCompaniesData] = useState({ data: [] });
    const [companyId, setCompanyId] = useState('');
    const [name, setName] = useState('');
    const [apiLoading, setApiLoading] = useState(true);
    const [maxOwingPercentage, setMaxOwingPercentage] = useState(100);
    // Default width
   const [formWidth, setFormWidth] = useState(700);
   const handleSliderChange = (event, newValue) => {
       setFormWidth(newValue);
   };

    const getDetails = () => {
        setApiLoading(true);
        let apiUrl = APIPath + "/getownershipdetails/" + ID;
        console.log(apiUrl)
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                async (result) => {
                    //console.log(result);
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setData({});
                    }
                    else {
                        await getCompaniesList();
                        await getOwnersList();
                        setData(result);
                        setName(result.data[0].companyId);
                        //alert(firstName);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const getCompaniesList = async () => {
        setApiLoading(true);
        setCompaniesData({ data: [] });
        let apiUrl = APIPath + "/getcompanies"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    //console.log(result);
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setCompaniesData({ data: [] });
                    }
                    else {
                        setCompaniesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setCompaniesData({ data: [] });
                    console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const getOwnersList = async () => {
        setApiLoading(true);
        setOwnersData({ data: [] });
        let apiUrl = APIPath + "/getowners"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    //console.log(result);
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setOwnersData({});
                    }
                    else {
                        setOwnersData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const getRemainingPercentage = (companyId) => {
        setApiLoading(true);
        let apiUrl = APIPath + "/getremainingpercentage/" + companyId;
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    if (!result.error) {
                        setMaxOwingPercentage(result.data[0].remainingPercentage);
                        setApiLoading(false);
                    }
                },
                (error) => {
                    console.error("Error fetching remaining percentage:", error);
                    setApiLoading(false);
                }
            )
    }
    const handleCompanyIdChange = (event) => {
        setCompanyId(event.target.value);
    };

    useEffect(() => {
        console.log("OWNERSHIP: " + operation);
        if (operation === "View" || operation === "Edit") {
            getDetails();
        }
        if (operation === "New") {
            getCompaniesList();
            getOwnersList();
        }
    }, []);
    useEffect(() => {
        if (companyId) {
            getRemainingPercentage(companyId);
        }
    }, [companyId]);

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

    return (
        <>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            {apiLoading ?
                <>
                    <div className="spinner"></div>Loading...
                </>
                :
                <Formik
                    enableReinitialize
                    initialValues={{
                        Id: name ? ID : 'This will be auto-generated once you save',
                        companyId: name ? data.data[0].companyId : '',
                        ownerId: name ? data.data[0].ownerId : '',
                        owingPercentage: name ? data.data[0].owingPercentage : '',
                        createdBy: userName,
                        modifiedBy: userName,
                        notes: name ? data.data[0].notes : ''
                    }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        var finalAPI = APIPath + "/addownership";
                        if (operation === "Edit") {
                            finalAPI = APIPath + "/updateownership";
                        }
                        setSubmitionCompleted(false);
                        setSubmitting(true);
                        axios.post(finalAPI,
                            values,
                            {
                                headers: {
                                    'Access-Control-Allow-Origin': '*',
                                    'Content-Type': 'application/json',
                                }
                            },
                        ).then((resp) => {
                            setSubmitting(false);
                            setSubmitionCompleted(true);
                            if (resp.data.STATUS === "FAIL")
                                showSnackbar('error', "Error saving Ownership data");
                            else
                                showSnackbar('success', "Ownership data saved");
                                resetForm();
                        })
                            .catch(function (error) {
                                console.log(error);
                                setSubmitionCompleted(true);
                                showSnackbar('error', "Error saving Ownership data");
                            });
                    }}

                    validationSchema={Yup.object().shape({
                        companyId: Yup.string()
                            .required('companyId Required'),
                        ownerId: Yup.string()
                            .required('ownerId Required'),
                        owingPercentage: Yup.number()
                            .typeError('Must be a number')
                            .max(maxOwingPercentage, `Value must be less than or equal to ${maxOwingPercentage}`)
                            .min(1, 'Value must be greater than or equal to 1')
                            .required('owingPercentage Required').test('is-decimal', 'Must be a decimal number', (value) =>
                                (value + "").match(/^\d+(\.\d+)?$/)
                            ),
                        notes: Yup.string()
                            .required('notes Required'),
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
                                {companiesData.data && (
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="companyId"
                                        name="companyId"
                                        select
                                        label="Company Id"
                                        defaultValue="12"
                                        value={values.companyId || ''}
                                        // onChange={handleChange}
                                        onChange={(event) => {
                                            handleChange(event);
                                            handleCompanyIdChange(event);
                                        }}
                                        onBlur={handleBlur}
                                        helperText={(errors.companyId && touched.companyId) && errors.companyId}
                                    >
                                        {companiesData.data.map((item, index) => (
                                            <MenuItem key={index} value={item.Id}>
                                                {item.Name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                                <Stack direction="row" spacing={2} className='items-center'>
                                    {companyId ? <>
                                        <InfoOutlinedIcon />
                                        <Chip color='warning' label={`Remaining % allocation is ${maxOwingPercentage}`} />
                                    </> : <></>}
                                </Stack>
                                {ownersData.data && (
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="ownerId"
                                        name="ownerId"
                                        select
                                        label="Owner Id"
                                        defaultValue="12"
                                        value={values.ownerId || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.ownerId && touched.ownerId) && errors.ownerId}
                                    >
                                        {ownersData.data.map((item, index) => (
                                            <MenuItem key={index} value={item.Id}>
                                                {item.firstName} {item.lastName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="owingPercentage"
                                    name="owingPercentage"
                                    label="% Ownership"
                                    value={values.owingPercentage}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.owingPercentage && touched.owingPercentage) && errors.owingPercentage}
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
                                            {apiLoading ?
                                                <>
                                                    <div className="spinner"></div>
                                                </> :
                                                <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                                    <SaveOutlinedIcon className="mr-1" />
                                                    Save
                                                </Button>
                                            }
                                        </>
                                    }
                                </Stack>
                            </form>
                        );
                    }}
                </Formik>
            }

        </>
    );
}

export default OwnershipForm;
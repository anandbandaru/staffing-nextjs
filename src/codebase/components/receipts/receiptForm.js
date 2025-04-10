import React, { useState, useContext, useRef, useEffect } from 'react';
import configData from "../../../CONFIG_RELEASE.json";
import { Context } from "../../context/context";
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Stack from '@mui/material/Stack';
import CustomSnackbar from "../snackbar/snackbar";
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import FormSlider from '../slider/formSlider';

function Receipt({ props, ID, operation }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [name, setName] = useState('');
    const [apiLoading, setApiLoading] = useState(false);
    // Default width
    const [formWidth, setFormWidth] = useState(700);
    const handleSliderChange = (event, newValue) => {
        setFormWidth(newValue);
    };

    const [companiesData, setCompaniesData] = useState({ data: [] });
    const [companyId, setCompanyId] = useState('');

    const [employeesData, setEmployeesData] = useState({ data: [] });
    const [employeeId, setEmployeeId] = useState('');

    const [invoicesData, setInvoicesData] = useState({ data: [] });
    const [invoiceId, setInvoiceId] = useState('');
    const [selectedInvoiceAmount, setSelectedInvoiceAmount] = useState(0.00);
    const [localAdjustedAmount, setLocalAdjustedAmount] = React.useState(0.00);
    const [localTotal, setLocalTotal] = React.useState(0.00);
    const [localVIN, setLocalVIN] = React.useState("");

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
    const getDetails = () => {
        setApiLoading(true);
        setData({});
        let apiUrl = APIPath + "/getreceiptdetails/" + ID;
        // console.log(apiUrl)
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        // console.log("RequestData:On error return: setting empty")
                        setData({});
                    }
                    else {
                        await getCompaniesList();
                        setName(result.data[0].Id);
                        setData(result);
                        setCompanyId(result.data[0].companyId);
                        setEmployeeId(result.data[0].employeeId);
                        setSelectedInvoiceAmount(result.data[0].receivedAmount);
                        setLocalAdjustedAmount(result.data[0].adjustedAmount);
                        setLocalTotal(result.data[0].totalReceivedAmount);
                        setInvoiceId(result.data[0].invoiceId);
                        setLocalVIN(result.data[0].vendorInvoiceNumber);
                        await getEmployeesListByCompanyId(result.data[0].companyId);
                        //await getSavedInvoicesByCompanyId(result.data[0].companyId);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    setName('');
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }

    const getCompaniesList = async () => {
        setApiLoading(true);
        setCompaniesData({ data: [] });
        let apiUrl = APIPath + "/getcompanies"
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        // console.log("RequestData:On error return: setting empty")
                        setCompaniesData({ data: [] });
                    }
                    else {
                        setCompaniesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setCompaniesData({ data: [] });
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleCompanyIdChange = async (event) => {
        setCompanyId(event.target.value);
        setEmployeesData({ data: [] });
        setInvoicesData({ data: [] });
        if (event.target.value !== "") {
            await getEmployeesListByCompanyId(event.target.value);
            await getSavedInvoicesByCompanyId(event.target.value);
        }
        else {
            await getEmployeesList();
        }
    };

    const getEmployeesList = async () => {
        setApiLoading(true);
        setEmployeesData({ data: [] });
        let apiUrl = APIPath + "/getemployees"
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        // console.log("RequestData:On error return: setting empty")
                        setEmployeesData({ data: [] });
                    }
                    else {
                        setEmployeesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setEmployeesData({ data: [] });
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const getEmployeesListByCompanyId = async (companyIdparam) => {
        setApiLoading(true);
        let apiUrl = APIPath + "/getemployeesbycompanyid/" + companyIdparam
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        // console.log("RequestData:On error return: setting empty")
                        setEmployeesData({ data: [] });
                    }
                    else {
                        setEmployeesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setEmployeesData({ data: [] });
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleEmployeeIdChange = async (event) => {
        setEmployeeId(event.target.value);
        setInvoicesData({ data: [] });
        if (event.target.value !== "") {
            await getSavedInvoicesByEmployeeId(event.target.value);
        }
        else {
            await getSavedInvoicesByCompanyId(companyId);
        }
    };

    const getSavedInvoicesByCompanyId = async (companyIdparam) => {
        setApiLoading(true);
        let apiUrl = APIPath + "/getsavedinvoicesbycompanyid/" + companyIdparam
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        // console.log("RequestData:On error return: setting empty")
                        setInvoicesData({ data: [] });
                    }
                    else {
                        setInvoicesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setInvoicesData({ data: [] });
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const getSavedInvoicesByEmployeeId = async (employeeIdparam) => {
        setApiLoading(true);
        let apiUrl = APIPath + "/getsavedinvoicesbyemployeeid/" + employeeIdparam
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        // console.log("RequestData:On error return: setting empty")
                        setInvoicesData({ data: [] });
                    }
                    else {
                        setInvoicesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setInvoicesData({ data: [] });
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleInvoiceIdChange = (event) => {
        setInvoiceId(event.target.value);

        const invoice = invoicesData.data.find((item) => item.Id === event.target.value);
        setSelectedInvoiceAmount(invoice ? invoice.totalAmount : 0.00);
        setLocalVIN(invoice ? invoice.vendorInvoiceNumber : "");
        setLocalTotal(invoice ? (parseFloat(invoice.totalAmount) || 0 + parseFloat(localAdjustedAmount) || 0).toFixed(2) : 0.00);
    };
    
    const handleReceivedAmountChange = (event) => {
        const ra = parseFloat(event.target.value);
        setSelectedInvoiceAmount(ra);
        setLocalTotal((ra + parseFloat(localAdjustedAmount) || 0).toFixed(2));
    };

    const handleAdjustedAmountChange = (event) => {
        const aa = parseFloat(event.target.value);
        setLocalAdjustedAmount(aa);
        setLocalTotal((aa + parseFloat(selectedInvoiceAmount) || 0).toFixed(2));
    };

    const [ranOnceC, setRanOnceC] = useState(1);
    const [ranOnce, setRanOnce] = useState(false);
    useEffect(() => {
        console.log("useEffect called with operation:", operation);
        console.log("useEffect called with COUNTER:", ranOnceC);
        if(!ranOnce)
        {
            setRanOnce(true);
            setRanOnceC(ranOnceC + 1);
            if (operation === "View" || operation === "Edit") {
                getDetails();
            }
            if (operation === "New") {
                console.log("New Receipt");
                getCompaniesList();
                getEmployeesList();
            }
        }
    }, [ID]);

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
                    <div className="spinner"></div>Loading data from database....
                </>
                :
                <Formik
                    enableReinitialize
                    initialValues={{
                        Id: name ? ID : 'This will be auto-generated once you save',
                        companyId: name ? data.data[0].companyId : companyId,
                        companyName: name ? data.data[0].companyName : "",
                        employeeId: name ? data.data[0].employeeId : employeeId,
                        employeeName: name ? data.data[0].employeeName: "",
                        invoiceId: name ? data.data[0].invoiceId : invoiceId,
                        vendorInvoiceNumber: name ? data.data[0].vendorInvoiceNumber : '',
                        startDate: name ? data.data[0].startDate : '',
                        endDate: name ? data.data[0].endDate : '',
                        invoiceDate: name ? data.data[0].invoiceDate : '',
                        rate: name ? data.data[0].rate : '',
                        hours: name ? data.data[0].hours : '',
                        receivedAmount: name ? data.data[0].receivedAmount : '',
                        adjustedAmount: name ? data.data[0].adjustedAmount : '',
                        adjustedAmountNotes: name ? data.data[0].adjustedAmountNotes : '',
                        totalReceivedAmount: name ? data.data[0].totalReceivedAmount : '',
                        createdBy: userName,
                    }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        var finalAPI = APIPath + "/addreceipt";
                        if (operation === "Edit") {
                            finalAPI = APIPath + "/updatereceipt";
                        }
                        setSubmitionCompleted(false);
                        setSubmitting(true);
                        axios.post(finalAPI,
                            // values,
                            {
                                Id: ID,
                                companyId: companyId,
                                employeeId: employeeId ? employeeId : invoicesData.data.find((item) => item.Id === invoiceId).employeeId,
                                invoiceId: invoiceId,
                                vendorInvoiceNumber: localVIN,
                                receivedAmount: selectedInvoiceAmount,
                                adjustedAmount: values.adjustedAmount,
                                adjustedAmountNotes: values.adjustedAmountNotes,
                                totalReceivedAmount: localTotal ? localTotal : 0.00,
                                startDate: data.data[0] ? data.data[0].startDate : invoicesData.data.find((item) => item.Id === invoiceId).startDate,
                                endDate: data.data[0] ? data.data[0].endDate : invoicesData.data.find((item) => item.Id === invoiceId).endDate,
                                invoiceDate: data.data[0] ? data.data[0].invoiceDate : invoicesData.data.find((item) => item.Id === invoiceId).invoiceDate,
                                rate: data.data[0] ? data.data[0].rate : invoicesData.data.find((item) => item.Id === invoiceId).rate,
                                hours: data.data[0] ? data.data[0].hours : invoicesData.data.find((item) => item.Id === invoiceId).totalHours,
                                createdBy: userName,
                            },
                            {
                                headers: {
                                    'Access-Control-Allow-Origin': '*',
                                    'Content-Type': 'application/json',
                                    'ngrok-skip-browser-warning': 'true'
                                }
                            },
                        ).then((resp) => {
                            setSubmitting(false);
                            setSubmitionCompleted(true);
                            if (resp.data.STATUS === "FAIL")
                                showSnackbar('error', "Error saving Receipt data");
                            else
                                showSnackbar('success', "Receipt data saved");
                            resetForm();
                        }).catch(function (error) {
                            setSubmitting(false);
                            // console.log(error);
                            setSubmitionCompleted(true);
                            showSnackbar('error', "Error saving Receipt data");
                        });
                    }}

                    validationSchema={Yup.object().shape({
                        // companyId: Yup.string().nullable().when('employeeId', {
                        //     is: (employeeId) => !employeeId,
                        //     then: () => Yup.string().required('company Id Required'),
                        //     otherwise: () => Yup.string().nullable()
                        // }),
                        // employeeId: Yup.string().nullable().when('companyId', {
                        //     is: (companyId) => !companyId,
                        //     then: () => Yup.string().required('employee Id Required'),
                        //     otherwise: () => Yup.string().nullable()
                        // }),
                        // invoiceId: Yup.string()
                        //     .required('invoice Id Required'),
                        receivedAmount: Yup.string()
                            .required('received Amount Required'),
                        adjustedAmount: Yup.number()
                            .typeError('Must be a number')
                            .required('adjusted Amount Required').test('is-decimal', 'Must be a decimal number', (value) =>
                                (value + "").match(/^\d+(\.\d+)?$/)
                            ),
                        adjustedAmountNotes: Yup.string().nullable().when('adjustedAmount', {
                            is: (adjustedAmount) => adjustedAmount !== undefined && adjustedAmount !== null,
                            then: () => Yup.string().required('adjusted Amount Notes Required'),
                            otherwise: () => Yup.string().nullable()
                        }),
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
                                {operation === "Edit" ? <>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="ex_companyId"
                                        name="ex_companyId"
                                        label="Company ID"
                                        disabled
                                        value={values.companyName}
                                    />
                                </>
                                    :
                                    <>
                                    <Autocomplete
                                    options={companiesData.data}
                                    getOptionLabel={(option) => `Company ID: ${option.Id} - ${option.Name}`}
                                    //getOptionLabel={(option) => option.Id}
                                    //  - (Personal Email: ${option.personalEmail}) - (US Phone: ${option.personalUSPhone}) - (Personal Phone: ${option.personalPhone})`}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            margin="normal"
                                            fullWidth
                                            label="Company"
                                        // value={companyId ? companyId : companiesData.data.find((item) => item.Id === companyId) || null}
                                        />
                                    )}
                                    value={companiesData.data.find((item) => item.Id === companyId) || null}
                                    //value={companyId}
                                    onChange={(event, newValue) => {
                                        setCompanyId(newValue);
                                        handleCompanyIdChange({ target: { value: newValue ? newValue.Id : '' } });
                                    }}
                                />
                                    </>
                                }
                                {operation === "Edit" ? <>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="ex_employeeId"
                                        name="ex_employeeId"
                                        label="Employee ID"
                                        disabled
                                        value={values.employeeName}
                                    />
                                </>
                                    :
                                    <>
                                    <Autocomplete
                                    options={employeesData.data}
                                    getOptionLabel={(option) => `Employee ID: ${option.Id} - ${option.firstName} ${option.lastName} - (${option.employeeType})`}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            margin="normal"
                                            fullWidth
                                            label="Employee"
                                        />
                                    )}
                                    value={employeesData.data.find((item) => item.Id === employeeId) || null}
                                    onChange={(event, newValue) => {
                                        handleEmployeeIdChange({ target: { value: newValue ? newValue.Id : '' } });
                                    }}
                                />
                                    </>
                                }
                                
                                {operation === "Edit" ? <>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="ex_invoiceId"
                                        name="ex_invoiceId"
                                        label="Invoice ID"
                                        disabled
                                        value={values.vendorInvoiceNumber}
                                    />
                                </>
                                    :
                                    <>

                                        <Autocomplete
                                            options={invoicesData.data}
                                            getOptionLabel={(option) => `${option.vendorInvoiceNumber} 
                                - ${option.employeeName} - (SD: ${option.startDate} - ED: ${option.endDate} - ID: ${option.invoiceDate}) - Hours: ${option.totalHours} - Rate: ${option.rate}`}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    margin="normal"
                                                    fullWidth
                                                    label="Invoice"
                                                    id="invoiceId"
                                                    name="invoiceId"
                                                    helperText={(errors.invoiceId && touched.invoiceId) && errors.invoiceId}
                                                />
                                            )}
                                            value={invoicesData.data.find((item) => item.Id === invoiceId) || null}
                                            onChange={(event, newValue) => {
                                                handleInvoiceIdChange({ target: { value: newValue ? newValue.Id : '' } });
                                            }}
                                        />
                                    </>
                                }
                                <TextField
                                    type='number'
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="receivedAmount"
                                    name="receivedAmount"
                                    label="Received Amount"
                                    value={values.receivedAmount ? values.receivedAmount : selectedInvoiceAmount}
                                    // onChange={handleChange}
                                    onChange={(event) => {
                                        handleChange(event);
                                        handleReceivedAmountChange(event);
                                    }}
                                    onBlur={handleBlur}
                                    helperText={(errors.receivedAmount && touched.receivedAmount) && errors.receivedAmount}
                                />
                                <Stack direction="row" spacing={1} className='mt-6'>
                                    <TextField
                                        type='number'
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="adjustedAmount"
                                        name="adjustedAmount"
                                        label="Adjusted Amount"
                                        value={values.adjustedAmount}
                                        // onChange={handleChange}
                                        onChange={(event) => {
                                            handleChange(event);
                                            handleAdjustedAmountChange(event);
                                        }}
                                        onBlur={handleBlur}
                                        helperText={(errors.adjustedAmount && touched.adjustedAmount) && errors.adjustedAmount}
                                    />
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="adjustedAmountNotes"
                                        name="adjustedAmountNotes"
                                        label="Adjusted Amount Notes"
                                        multiline
                                        rows={4}
                                        value={values.adjustedAmountNotes}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.adjustedAmountNotes && touched.adjustedAmountNotes) && errors.adjustedAmountNotes}
                                    />
                                </Stack>
                                <TextField
                                    size="small"
                                    className='font-bold text-xl mytextbox'
                                    margin="normal"
                                    fullWidth
                                    id="totalReceivedAmount"
                                    name="totalReceivedAmount"
                                    label="Total Received Amount"
                                    disabled
                                    value={localTotal ? localTotal : values.totalReceivedAmount}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                    {operation === "Edit" ? (
                                        isSubmitting ? (
                                            <div className="spinner"></div>
                                        ) : (
                                            <>
                                                {invoiceId && (
                                                    <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                                        <SaveOutlinedIcon className="mr-1" />
                                                        Update
                                                    </Button>
                                                )
                                                }
                                            </>
                                        )
                                    ) : (
                                        <>
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
                                                <>
                                                    {invoiceId && (
                                                        <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                                            <SaveOutlinedIcon className="mr-1" />
                                                            Save
                                                        </Button>
                                                    )
                                                    }
                                                </>
                                            )}
                                        </>
                                    )}
                                </Stack>
                            </form>
                        );
                    }}
                </Formik>
            }

        </>
    );
}

export default Receipt;
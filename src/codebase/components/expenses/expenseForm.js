import React, { useState, useContext, useRef, useEffect } from 'react';
import configData from "../../../CONFIG_RELEASE.json";
import { Context } from "../../context/context";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Stack from '@mui/material/Stack';
import CustomSnackbar from "../snackbar/snackbar";
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

function Expense({ props, ID, operation }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [name, setName] = useState('');
    const [apiLoading, setApiLoading] = useState(false);

    const [expenseTypesData, setExpenseTypesData] = useState({ data: [] });
    const [expenseTypeId, setExpenseTypeId] = useState('');

    const [companiesData, setCompaniesData] = useState({ data: [] });
    const [companyId, setCompanyId] = useState('');

    const [employeesData, setEmployeesData] = useState({ data: [] });
    const [employeeId, setEmployeeId] = useState('');

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
        let apiUrl = APIPath + "/getexpensedetails/" + ID;
        console.log(apiUrl)
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setData({});
                    }
                    else {
                        await getExpenseTypesList();
                        await getCompaniesList();
                        await getEmployeesList();
                        setName(result.data[0].Id);
                        setData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    setName('');
                    console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }

    const getExpenseTypesList = async () => {
        setApiLoading(true);
        setExpenseTypesData({ data: [] });
        let apiUrl = APIPath + "/getexpensetypes"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setExpenseTypesData({ data: [] });
                    }
                    else {
                        setExpenseTypesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setExpenseTypesData({ data: [] });
                    console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleExpenseTypeIdChange = (event) => {
        setExpenseTypeId(event.target.value);
    };

    const getCompaniesList = async () => {
        setApiLoading(true);
        setCompaniesData({ data: [] });
        let apiUrl = APIPath + "/getcompanies"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                async (result) => {
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
    const handleCompanyIdChange = (event) => {
        setCompanyId(event.target.value);
    };

    const getEmployeesList = async () => {
        setApiLoading(true);
        setEmployeesData({ data: [] });
        let apiUrl = APIPath + "/getemployees"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setEmployeesData({ data: [] });
                    }
                    else {
                        setEmployeesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setEmployeesData({ data: [] });
                    console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleEmployeeIdChange = (event) => {
        setEmployeeId(event.target.value);
    };

    useEffect(() => {
        if (operation === "View" || operation === "Edit") {
            getDetails();
        }
        if (operation === "New") {
            getExpenseTypesList();
            getCompaniesList();
            getEmployeesList();
        }
    }, []);

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
                        expenseTypeId: name ? data.data[0].expenseTypeId : '',
                        amount: name ? data.data[0].amount : '',
                        currencyType: name ? data.data[0].currencyType : '',
                        category: name ? data.data[0].category : '',
                        companyId: name ? data.data[0].companyId : '',
                        employeeId: name ? data.data[0].employeeId : '',
                        notes: name ? data.data[0].notes : '',
                        createdBy: userName,
                    }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        var finalAPI = APIPath + "/addexpense";
                        if (operation === "Edit") {
                            finalAPI = APIPath + "/updateexpense";
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
                                showSnackbar('error', "Error saving Expense data");
                            else
                                showSnackbar('success', "Expense data saved");
                                resetForm();
                        }).catch(function (error) {
                            setSubmitting(false);
                            console.log(error);
                            setSubmitionCompleted(true);
                            showSnackbar('error', "Error saving Expense data");
                        });
                    }}

                    validationSchema={Yup.object().shape({
                        expenseTypeId: Yup.string()
                            .required('expenseTypeId Required'),
                        currencyType: Yup.string()
                            .required('currencyType Required'),
                        category: Yup.string()
                            .required('category Required'),
                        amount: Yup.number()
                            .typeError('Must be a number')
                            .required('amount Required').test('is-decimal', 'Must be a decimal number', (value) =>
                                (value + "").match(/^\d+(\.\d+)?$/)
                            ),
                        notes: Yup.string()
                            .required('notes Required'),
                        companyId: Yup.string().nullable().when('category', {
                            is: 'Company',
                            then: () => Yup.string().required('companyId Required'),
                            otherwise: () => Yup.string().nullable()
                        }),
                        employeeId: Yup.string().nullable().when('category', {
                            is: 'Employee',
                            then: () => Yup.string().required('employeeId Required'),
                            otherwise: () => Yup.string().nullable()
                        })
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
                                    id="expenseTypeId"
                                    name="expenseTypeId"
                                    select
                                    label="Expense Type Id"
                                    value={values.expenseTypeId}
                                    onChange={(event) => {
                                        handleChange(event);
                                        handleExpenseTypeIdChange(event);
                                    }}
                                    onBlur={handleBlur}
                                    helperText={(errors.expenseTypeId && touched.expenseTypeId) && errors.expenseTypeId}
                                >
                                    {expenseTypesData.data.map((item, index) => (
                                        <MenuItem key={index} value={item.Id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="currencyType"
                                    name="currencyType"
                                    select
                                    label="Currency Type"
                                    value={values.currencyType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.currencyType && touched.currencyType) && errors.currencyType}
                                >
                                    {configData.currencyTypes.map((item, index) => (
                                        <MenuItem key={index} value={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="category"
                                    name="category"
                                    select
                                    label="Category"
                                    value={values.category}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.category && touched.category) && errors.category}
                                >
                                    {configData.expenseCategories.map((item, index) => (
                                        <MenuItem key={index} value={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                {values.category === 'Company' && (
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="companyId"
                                        name="companyId"
                                        select
                                        label="Company Id"
                                        value={values.companyId}
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
                                {values.category === 'Employee' && (
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="employeeId"
                                        name="employeeId"
                                        select
                                        label="Employee Id"
                                        value={values.employeeId}
                                        onChange={(event) => {
                                            handleChange(event);
                                            handleEmployeeIdChange(event);
                                        }}
                                        onBlur={handleBlur}
                                        helperText={(errors.employeeId && touched.employeeId) && errors.employeeId}
                                    >
                                        {employeesData.data.map((item, index) => (
                                            <MenuItem key={index} value={item.Id}>
                                                {item.Id} - {item.firstName} {item.lastName} - {item.employeeType}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="amount"
                                    name="amount"
                                    label="Amount"
                                    value={values.amount}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.amount && touched.amount) && errors.amount}
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
                                    {operation === "Edit" ? (
                                        isSubmitting ? (
                                            <div className="spinner"></div>
                                        ) : (
                                            <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                                <SaveOutlinedIcon className="mr-1" />
                                                Update
                                            </Button>
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
                                                <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                                    <SaveOutlinedIcon className="mr-1" />
                                                    Save
                                                </Button>
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

export default Expense;
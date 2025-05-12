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
import { Autocomplete } from '@mui/material';

function PayrollItem({ props, MM_YYYY, operation, ID, empID, empName, empDisabled, index }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [name, setName] = useState('');
    const [apiLoading, setApiLoading] = useState(false);
    // Default width
    const [formWidth, setFormWidth] = useState(1400);

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

    useEffect(() => {
        if (operation === "View" || operation === "Edit") {
            //getDataForMMYYYY();
        } else if (operation === "New") {
            setApiLoading(false);
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
                        payroll_MM_YYYY: name ? data.data[0].payroll_MM_YYYY : MM_YYYY,
                        standardPay: name ? data.data[0].standardPay : 0.00,
                    }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        var finalAPI = APIPath + "/addexpense";
                        if (operation === "Edit") {
                            finalAPI = APIPath + "/updateexpense";
                        }
                        setSubmitionCompleted(false);
                        setSubmitting(true);

                        const updatedValues = {
                            ...values,
                            // jobRate: values.jobRate || jobRate,
                            // jobHoursDeducted: jobRate == 0 ? 0 : jobHoursDeducted
                        };

                        axios.post(finalAPI,
                            updatedValues,
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
                                showSnackbar('error', "Error saving Expense data");
                            else
                                showSnackbar('success', "Expense data saved");
                            resetForm();
                        }).catch(function (error) {
                            setSubmitting(false);
                            // console.log(error);
                            setSubmitionCompleted(true);
                            showSnackbar('error', "Error saving Expense data");
                        });
                    }}

                    validationSchema={Yup.object().shape({
                        payroll_MM_YYYY: Yup.string()
                            .required('payroll MM YYYY Required'),
                        standardPay: Yup.string()
                            .required('standard Pay Required'),
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
                            <form onSubmit={handleSubmit} className='justify-start place-items-start items-start' style={{ maxWidth: `${formWidth}px`, margin: '0 0' }}>

                                <table className='payrollTable my-2'>
                                    {index === 0 && (
                                        <thead>
                                            <tr>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Employee</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Standard Pay</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Job</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Rate</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Hours</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Before Tax</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Tax</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>NetPay</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Employer Expense</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Check #</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Pay Date</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Actions</h2>
                                                </th>
                                            </tr>
                                        </thead>
                                    )}
                                    <tbody>
                                        <tr>
                                            <td className='td_Employee'>
                                                {empID + " - " + empName}
                                            </td>
                                            <td className='td_StandardPay'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="standardPay"
                                                    name="standardPay"
                                                    value={values.standardPay}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.standardPay && touched.standardPay) && errors.standardPay}
                                                />
                                            </td>
                                            <td className='td_Job'>
                                                <TextField
                                                    size="small"
                                                    margin="normal"
                                                    fullWidth
                                                    id="MM"
                                                    name="MM"
                                                    select
                                                    label="MM"
                                                    // onChange={(event) => {
                                                    //     handleMonthsIdChange(event);
                                                    // }}
                                                >
                                                    {/* {months.map((item, index) => (
                                                        <MenuItem key={index} value={item.Id}>
                                                            {item.Id} - {item.name}
                                                        </MenuItem>
                                                    ))} */}
                                                </TextField>
                                            </td>
                                            <td className='td_Rate'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="standardPay"
                                                    name="standardPay"
                                                    value={values.standardPay}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.standardPay && touched.standardPay) && errors.standardPay}
                                                />
                                            </td>
                                            <td className='td_Hours'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="standardPay"
                                                    name="standardPay"
                                                    value={values.standardPay}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.standardPay && touched.standardPay) && errors.standardPay}
                                                />
                                            </td>
                                            <td className='td_BeforeTax'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="standardPay"
                                                    name="standardPay"
                                                    value={values.standardPay}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.standardPay && touched.standardPay) && errors.standardPay}
                                                />
                                            </td>
                                            <td className='td_Tax'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="standardPay"
                                                    name="standardPay"
                                                    value={values.standardPay}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.standardPay && touched.standardPay) && errors.standardPay}
                                                />
                                            </td>
                                            <td className='td_NetPay'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="standardPay"
                                                    name="standardPay"
                                                    value={values.standardPay}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.standardPay && touched.standardPay) && errors.standardPay}
                                                />
                                            </td>
                                            <td className='td_EmployerExpense'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="standardPay"
                                                    name="standardPay"
                                                    value={values.standardPay}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.standardPay && touched.standardPay) && errors.standardPay}
                                                />
                                            </td>
                                            <td className='td_Check'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="standardPay"
                                                    name="standardPay"
                                                    value={values.standardPay}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.standardPay && touched.standardPay) && errors.standardPay}
                                                />
                                            </td>
                                            <td className='td_PayDate'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="standardPay"
                                                    name="standardPay"
                                                    value={values.standardPay}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.standardPay && touched.standardPay) && errors.standardPay}
                                                />
                                            </td>
                                            <td className='td_Actions'>
                                                <Stack direction="row" spacing={0} className=''>
                                                    {operation === "Edit" ? (
                                                        isSubmitting ? (
                                                            <div className="spinner"></div>
                                                        ) : (
                                                            <>
                                                                <Button size='small' color="primary" variant="contained" type="submit"
                                                                    disabled={isSubmitting && !isSubmitionCompleted}>
                                                                    <SaveOutlinedIcon className="mr-1" />
                                                                    Update
                                                                </Button>
                                                            </>
                                                        )
                                                    ) : (
                                                        <>
                                                            {isSubmitting ? (
                                                                <div className="spinner"></div>
                                                            ) : (
                                                                <>
                                                                    <Button size='small' color="primary" variant="contained" type="submit"
                                                                        disabled={isSubmitting && !isSubmitionCompleted || empDisabled}>
                                                                        <SaveOutlinedIcon className="mr-1" />
                                                                        Save
                                                                    </Button>
                                                                    <div className='mr-2'></div>
                                                                    <Button size='small' color="secondary" variant="contained"
                                                                        disabled={isSubmitting && !isSubmitionCompleted || empDisabled}
                                                                        onClick={() => {
                                                                            handleReset();
                                                                        }}>
                                                                        <SaveOutlinedIcon className="mr-1" />
                                                                        Paid
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </Stack>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

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

                            </form>
                        );
                    }}
                </Formik>
            }

        </>
    );
}

export default PayrollItem;
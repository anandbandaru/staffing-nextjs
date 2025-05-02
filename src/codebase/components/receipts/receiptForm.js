import React, { useState, useContext, useRef, useEffect } from 'react';
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
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import FormSlider from '../slider/formSlider';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { IconButton } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import ReceiptInvoices from './receiptInvoices';

function Receipt({ props, ID, operation, handleClose }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [name, setName] = useState('');
    const [apiLoading, setApiLoading] = useState(false);
    // Default width
    const [formWidth, setFormWidth] = useState(1000);
    const handleSliderChange = (event, newValue) => {
        setFormWidth(newValue);
    };

    const [vendorsData, setVendorsData] = useState({ data: [] });
    const [vendorId, setVendorId] = useState('');

    const [employeesData, setEmployeesData] = useState({ data: [] });
    const [employeeId, setEmployeeId] = useState('');

    const [invoicesData, setInvoicesData] = useState({ data: [] });
    const [invoiceId, setInvoiceId] = useState('');
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [receivedDate, setReceivedDate] = useState('');
    const [selectedInvoiceAmountOriginal, setSelectedInvoiceAmountOriginal] = useState(0.00);
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
                        setData({});
                    }
                    else {
                        await getInvoicesForReceipt();
                        setName(result.data[0].Id);
                        setData(result);
                        setVendorId(result.data[0].vendorId);
                        setEmployeeId(result.data[0].employeeId);
                        setSelectedInvoiceAmount(result.data[0].receivedAmount);
                        setSelectedInvoiceAmountOriginal(result.data[0].receivedAmount);
                        console.log("IA:", result.data[0].receivedAmount);
                        console.log("IA ORIG:", result.data[0].receivedAmount);
                        setLocalAdjustedAmount(result.data[0].adjustedAmount);
                        setLocalTotal(result.data[0].totalReceivedAmount);
                        setInvoiceId(result.data[0].invoiceId);
                        setLocalVIN(result.data[0].vendorInvoiceNumber);
                        setReceivedDate(result.data[0].receivedDate);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    setName('');
                    setApiLoading(false);
                }
            )
    }

    const getVendorsList = async () => {
        setApiLoading(true);
        setVendorsData({ data: [] });
        let apiUrl = APIPath + "/getactivevendors"
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
                        setVendorsData({ data: [] });
                    }
                    else {
                        setVendorsData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setVendorsData({ data: [] });
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleVendorIdChange = async (event) => {
        setVendorId(event.target.value);
        setEmployeesData({ data: [] });
        setInvoicesData({ data: [] });
        if (event.target.value !== "") {
            await getEmployeesListByVendorId(event.target.value);
            await getSavedInvoicesByVendorId(event.target.value);
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
    const getEmployeesListByVendorId = async (vendorIdparam) => {
        setApiLoading(true);
        let apiUrl = APIPath + "/getemployeesbyvendorid/" + vendorIdparam
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
            await getSavedInvoicesByVendorId(vendorId);
        }
    };

    const getSavedInvoicesByVendorId = async (vendorIdparam) => {
        setApiLoading(true);
        if (vendorIdparam !== "" || vendorIdparam !== undefined) {
            let apiUrl = APIPath + "/getsavedinvoicesbyvendorid/" + vendorIdparam
            fetch(apiUrl, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                }
            })
                .then(response => response.json())
                .then(
                    async (result) => {
                        if (result.error) {
                            setInvoicesData({ data: [] });
                        }
                        else {
                            setInvoicesData(result);
                        }
                        setApiLoading(false);
                    },
                    (error) => {
                        setInvoicesData({ data: [] });
                        setApiLoading(false);
                    }
                )
        }
        else {
            setInvoicesData({ data: [] });
        }
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

    const getInvoicesForReceipt = async () => {
        setApiLoading(true);
        let apiUrl = APIPath + "/getreceiptinvoices/" + ID
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        setInvoicesData({ data: [] });
                    }
                    else {
                        setInvoicesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setInvoicesData({ data: [] });
                    setApiLoading(false);
                }
            )
    }
    const handleCheckboxChange = (invoiceId) => {
        setSelectedInvoices((prevSelected) => {
            if (prevSelected.includes(invoiceId)) {
                // Remove the invoice if already selected
                handleInvoiceButtonClick(invoiceId);
                return prevSelected.filter((id) => id !== invoiceId);
            } else {
                // Add the invoice if not already selected
                handleInvoiceButtonClick(invoiceId);
                return [...prevSelected, invoiceId];
            }
        });
    };
    const handleReceivedAmountChange = (event) => {
        const ra = parseFloat(event.target.value);
        setSelectedInvoiceAmount(ra);
        setLocalTotal((ra + parseFloat(localAdjustedAmount) || 0).toFixed(2));
        console.log("IA:", selectedInvoiceAmount);
        console.log("IA ORIG:", selectedInvoiceAmountOriginal);
    };

    const handleAdjustedAmountChange = (event) => {
        const aa = parseFloat(event.target.value);
        setLocalAdjustedAmount(aa);
        setLocalTotal((aa + parseFloat(selectedInvoiceAmount) || 0).toFixed(2));
        console.log("IA:", selectedInvoiceAmount);
        console.log("IA ORIG:", selectedInvoiceAmountOriginal);
    };

    const [ranOnceC, setRanOnceC] = useState(1);
    const [ranOnce, setRanOnce] = useState(false);
    useEffect(() => {
        console.log("useEffect called with operation:", operation);
        console.log("useEffect called with COUNTER:", ranOnceC);
        if (!ranOnce) {
            setRanOnce(true);
            setRanOnceC(ranOnceC + 1);
            if (operation === "View" || operation === "Edit") {
                getDetails();
            }
            if (operation === "New") {
                console.log("New Receipt");
                getVendorsList();
                getEmployeesList();
            }
        }
    }, [ID]);

    const handleInvoiceButtonClick_old = (invoiceId) => {
        setInvoiceId(invoiceId);
        const invoice = invoicesData.data.find((item) => item.Id === invoiceId);
        setVendorId(invoice.vendorId);
        setSelectedInvoiceAmount(invoice ? invoice.totalAmount : 0.00);
        setSelectedInvoiceAmountOriginal(invoice ? invoice.totalAmount : 0.00);
        console.log("IA:", invoice ? invoice.totalAmount : 0.00);
        console.log("IA ORIG:", invoice ? invoice.totalAmount : 0.00);
        setLocalVIN(invoice ? invoice.vendorInvoiceNumber : "");
        setLocalTotal(invoice ? (parseFloat(invoice.totalAmount) || 0 + parseFloat(localAdjustedAmount) || 0).toFixed(2) : 0.00);
        // Add any additional actions you want to perform here
    };

    const handleInvoiceButtonClick = (invoiceId) => {
        setSelectedInvoices((prevSelected) => {
            let updatedSelectedInvoices;
            if (prevSelected.includes(invoiceId)) {
                // Remove the invoice if already selected
                updatedSelectedInvoices = prevSelected.filter((id) => id !== invoiceId);
            } else {
                // Add the invoice if not already selected
                updatedSelectedInvoices = [...prevSelected, invoiceId];
            }

            // Calculate the total amount of the selected invoices
            const totalAmount = updatedSelectedInvoices.reduce((sum, id) => {
                const invoice = invoicesData.data.find((item) => item.Id === id);
                return sum + (invoice ? parseFloat(invoice.totalAmount) : 0);
            }, 0);

            // Update the Received Amount textbox
            setSelectedInvoiceAmount(totalAmount);
            setLocalTotal((totalAmount + parseFloat(localAdjustedAmount) || 0).toFixed(2));

            return updatedSelectedInvoices;
        });
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
                    <div className="spinner"></div>Loading data from database....
                </>
                :
                <Formik
                    //enableReinitialize
                    initialValues={{
                        Id: name ? ID : 'This will be auto-generated once you save',
                        vendorId: name ? data.data[0].vendorId : vendorId,
                        vendorName: name ? data.data[0].vendorName : "",
                        employeeId: name ? data.data[0].employeeId : employeeId,
                        employeeName: name ? data.data[0].employeeName : "",
                        invoiceId: name ? data.data[0].invoiceId : invoiceId,
                        vendorInvoiceNumber: name ? data.data[0].vendorInvoiceNumber : '',
                        startDate: name ? data.data[0].startDate : '',
                        endDate: name ? data.data[0].endDate : '',
                        invoiceDate: name ? data.data[0].invoiceDate : '',
                        rate: name ? data.data[0].rate : '',
                        hours: name ? data.data[0].hours : '',
                        receivedAmount: name ? data.data[0].receivedAmount : selectedInvoiceAmount,
                        adjustedAmount: name ? data.data[0].adjustedAmount : '',
                        adjustedAmountNotes: name ? data.data[0].adjustedAmountNotes : '',
                        totalReceivedAmount: name ? data.data[0].totalReceivedAmount : '',
                        createdBy: userName,
                        receivedDate: name ? data.data[0].receivedDate : new Date().toISOString().split('T')[0],
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
                                invoiceIds: selectedInvoices,
                                receivedAmount: selectedInvoiceAmount,
                                adjustedAmount: values.adjustedAmount,
                                adjustedAmountNotes: values.adjustedAmountNotes,
                                totalReceivedAmount: localTotal ? localTotal : 0.00,
                                createdBy: userName,
                                receivedDate: receivedDate ? receivedDate : values.receivedDate,
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
                            handleClose();
                        }).catch(function (error) {
                            setSubmitting(false);
                            // console.log(error);
                            setSubmitionCompleted(true);
                            showSnackbar('error', "Error saving Receipt data");
                        });
                    }}

                    validationSchema={Yup.object().shape({
                        // vendorId: Yup.string().nullable().when('employeeId', {
                        //     is: (employeeId) => !employeeId,
                        //     then: () => Yup.string().required('company Id Required'),
                        //     otherwise: () => Yup.string().nullable()
                        // }),
                        // employeeId: Yup.string().nullable().when('vendorId', {
                        //     is: (vendorId) => !vendorId,
                        //     then: () => Yup.string().required('employee Id Required'),
                        //     otherwise: () => Yup.string().nullable()
                        // }),
                        // invoiceId: Yup.string()
                        //     .required('invoice Id Required'),
                        receivedAmount: Yup.string()
                            .required('received Amount Required'),
                        adjustedAmount: Yup.number()
                            .typeError('Must be a number'),
                        receivedDate: Yup.string()
                            .required('received Date Required'),
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
                                {/* <FormSlider value={formWidth} onChange={handleSliderChange} /> */}
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
                                {operation === "Edit" ? <></>
                                    :
                                    <>
                                        <Autocomplete
                                            options={vendorsData.data}
                                            getOptionLabel={(option) => `Vendor ID: ${option.Id} - ${option.name}`}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    margin="normal"
                                                    fullWidth
                                                    label="Vendor"
                                                />
                                            )}
                                            value={vendorsData.data.find((item) => item.Id === vendorId) || null}
                                            //value={vendorId}
                                            onChange={(event, newValue) => {
                                                setVendorId(newValue);
                                                handleVendorIdChange({ target: { value: newValue ? newValue.Id : '' } });
                                            }}
                                        />

                                    </>
                                }
                                {operation === "Edit" ? <></>
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
                                    <ReceiptInvoices receiptId={ID}  />
                                </>
                                    :
                                    <>
                                        <div className='pt-4 div_InvoiceTableHolder'>
                                            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                                                <thead>
                                                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                        <th >Vendor Invoice Number</th>
                                                        <th >Employee Name</th>
                                                        <th >Start Date</th>
                                                        <th >End Date</th>
                                                        <th >Total Amount</th>
                                                        <th >Total Hours</th>
                                                        <th >Rate</th>
                                                        <th >Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {invoicesData.data.map((item) => (
                                                        <tr key={item.Id} style={{ backgroundColor: item.Id === invoiceId ? "#e6f7ff" : "#fff" }}>
                                                            <td >{item.vendorInvoiceNumber}</td>
                                                            <td >{item.employeeName}</td>
                                                            <td >{item.startDate}</td>
                                                            <td >{item.endDate}</td>
                                                            <td >{item.totalAmount}</td>
                                                            <td >{item.totalHours}</td>
                                                            <td >{item.rate}</td>
                                                            <td >
                                                                {/* <IconButton aria-label="Metadata" title="Metadata" color="primary"
                                                                    onClick={() => handleInvoiceButtonClick(item.Id)}>
                                                                    <ReadMoreIcon />
                                                                </IconButton> */}
                                                                <Checkbox
                                                                    checked={selectedInvoices.includes(item.Id)}
                                                                    onChange={() => handleInvoiceButtonClick(item.Id)}
                                                                    color="primary"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                }
                                <table className='w-full'>
                                    <tbody>
                                        <tr>
                                            <td className='text-right pr-4'>
                                                <div>Received Date</div>
                                            </td>
                                            <td>
                                                <TextField
                                                    size="small"
                                                    margin="normal"
                                                    fullWidth
                                                    className='flex-1'
                                                    id="receivedDate"
                                                    name="receivedDate"
                                                    type="date"
                                                    value={values.receivedDate}
                                                    // onChange={handleChange}
                                                    onChange={(event) => {
                                                        handleChange(event);
                                                        setReceivedDate(event.target.value);
                                                    }}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.receivedDate && touched.receivedDate) && errors.receivedDate}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='text-right pr-4'>
                                                <div>Received Amount</div>
                                            </td>
                                            <td>
                                                <TextField
                                                    className='mySmallTextbox '
                                                    fullWidth
                                                    type='number'
                                                    size="small"
                                                    margin="normal"
                                                    id="receivedAmount"
                                                    name="receivedAmount"
                                                    label="Received Amount"
                                                    // disabled={operation === "Edit"}
                                                    value={values.receivedAmount ? values.receivedAmount : selectedInvoiceAmount}
                                                    // onChange={handleChange}
                                                    onChange={(event) => {
                                                        handleChange(event);
                                                        handleReceivedAmountChange(event);
                                                    }}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.receivedAmount && touched.receivedAmount) && errors.receivedAmount}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='text-right pr-4'>
                                                <div>Adjusted Amount</div>
                                            </td>
                                            <td>
                                                <TextField
                                                    type='number'
                                                    size="small"
                                                    margin="normal"
                                                    fullWidth
                                                    id="adjustedAmount"
                                                    name="adjustedAmount"
                                                    label="Adjusted Amount"
                                                    // disabled={operation === "Edit"}
                                                    value={values.adjustedAmount}
                                                    // onChange={handleChange}
                                                    onChange={(event) => {
                                                        handleChange(event);
                                                        handleAdjustedAmountChange(event);
                                                    }}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.adjustedAmount && touched.adjustedAmount) && errors.adjustedAmount}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='text-right pr-4'>
                                                <div>Adjusted Amount Notes</div>
                                            </td>
                                            <td>
                                                <TextField
                                                    size="small"
                                                    margin="normal"
                                                    fullWidth
                                                    id="adjustedAmountNotes"
                                                    name="adjustedAmountNotes"
                                                    label="Adjusted Amount Notes"
                                                    multiline
                                                    rows={2}
                                                    value={values.adjustedAmountNotes}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.adjustedAmountNotes && touched.adjustedAmountNotes) && errors.adjustedAmountNotes}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='text-right pr-4'>
                                                <div>Total Received Amount</div>
                                            </td>
                                            <td>
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
                                <Stack direction="row" spacing={2} className='float-right mt-2'>
                                    {operation === "Edit" ? (
                                        isSubmitting ? (
                                            <div className="spinner"></div>
                                        ) : (
                                            <>
                                                {(invoicesData.data.length > 0) && (
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
                                                    {(selectedInvoices.length > 0 && selectedInvoiceAmountOriginal <= localTotal) && (
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
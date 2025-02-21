import React, { useContext, useState, useEffect, useRef } from "react";
import { Context } from "../../context/context";
import { assets } from '../../assets/assets'
import 'reactjs-popup/dist/index.css';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { Alert, Link, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import TimesheetCapturedDayHours from "./capturedDayHours";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Box from '@mui/material/Box';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import InvoiceTimesheetDetails from "./invoiceTimesheetDetails";
import MoreTimeIcon from '@mui/icons-material/MoreTime';

const InvoiceView = ({ operation, manualLoadData, invoiceNumber, employeeID, jobID, startDate, endDate, totalHours, status, jobType,
    jobStartDate, jobEndDate, jobName, jobTitle, clientName, implementationPartnerName, vendorName,
    daysPending, employeeName, personalEmail, invoiceDate, rate, timesheetNumber, paymentTerms, showSnackbar }) => {

    const { APIPath, userName } = useContext(Context);
    const [doLoading, setDoLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [clientDocumentData, setClientDocumentData] = useState({ data: [] });
    const [iPVendorDocumentData, setIPVendorDocumentData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(false);
    const contentRef = useRef(null); // Reference to the form element
    //For dialog MUI
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpen(false);
        setDoLoading(false)
        manualLoadData();
    };
    const handleClickOpen = () => {
        setOpen(true);
        setDoLoading(true)
    };
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 16,
        },
    }));

    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);

    const getClientDocumentDetails = () => {
        setApiLoading(true);
        let apiUrl = APIPath + "/getlatesttimesheetcdocument/" + timesheetNumber;
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        setClientDocumentData({});
                    }
                    else {
                        setClientDocumentData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setClientDocumentData({});
                    setApiLoading(false);
                }
            )
    }
    const getIPVendorDocumentDetails = () => {
        let apiUrl = APIPath + "/getlatesttimesheetivdocument/" + timesheetNumber;
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        setIPVendorDocumentData({});
                    }
                    else {
                        setIPVendorDocumentData(result);
                    }
                },
                (error) => {
                    setIPVendorDocumentData({});
                }
            )
    }
    useEffect(() => {
        if (operation === "View" && doLoading) {
            console.log("LOAD...")
            getClientDocumentDetails();
            getIPVendorDocumentDetails();
        }
    }, [invoiceNumber, doLoading]);

    const downloadInvoiceAsPDF = () => {
        const input = contentRef.current;
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'PNG', 10, 10);
                pdf.save("Invoice_" + invoiceNumber + ".pdf");
            });
    };

    const createGDriveDownloadLink = (viewLink) => {
        const fileId = viewLink.match(/\/d\/(.*?)\//)[1];
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
    };
    const downloadInvoiceAsPDFAndTSDocuments = () => {
        downloadInvoiceAsPDF();

        //CLIENT
        let link = createGDriveDownloadLink(clientDocumentData.data[0].gDriveLink);
        let a = document.createElement('a');
        a.href = link;
        a.target = '_blank';
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        //IP OR VENDOR
        if (iPVendorDocumentData.data[0]) {
            let link = createGDriveDownloadLink(iPVendorDocumentData.data[0].gDriveLink);
            let a = document.createElement('a');
            a.href = link;
            a.download = '';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <>
            <Stack direction="row" spacing={1}>
                <IconButton aria-label="Metadata" title="Metadata" color="primary" onClick={handleClickOpen}>
                    <ReadMoreIcon />
                </IconButton>
            </Stack>
            <BootstrapDialog
                fullScreen
                className="myFullScreenDialog"
                onClose={handleClose}
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle className="text-pink-600" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    {operation} Invoice: {invoiceNumber}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>

                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <Tabs>
                            <TabList className="subTabsListHolder">
                                <Tab><PaidOutlinedIcon className="mr-1" />Invoice</Tab>
                                <Tab><MoreTimeIcon className="mr-1" />Related Timesheet</Tab>
                            </TabList>

                            <TabPanel className="px-2">
                                <div className="div_InvoiceHolderMain" >

                                    <Formik
                                        enableReinitialize
                                        initialValues={{
                                            invoiceNumber: invoiceNumber,
                                            invoiceDate: new Date(invoiceDate).toISOString().slice(0, 10),
                                            totalHours: totalHours,
                                            employeeID: employeeID,
                                            jobID: jobID,
                                            startDate: startDate,
                                            endDate: endDate,
                                            status: status,
                                            jobType: jobType,
                                            jobStartDate: jobStartDate,
                                            jobEndDate: jobEndDate,
                                            jobName: jobName,
                                            jobTitle: jobTitle,
                                            clientName: clientName,
                                            implementationPartnerName: implementationPartnerName,
                                            vendorName: vendorName,
                                            daysPending: daysPending,
                                            employeeName: employeeName,
                                            personalEmail: personalEmail,
                                            rate: rate,
                                            timesheetNumber: timesheetNumber,
                                            paymentTerms: paymentTerms,
                                            createdBy: userName
                                        }}
                                        onSubmit={(values, { setSubmitting }) => {
                                            var finalAPI = APIPath + "/addinvoice";

                                            setSubmitionCompleted(false);
                                            setSubmitting(true);
                                            axios.post(finalAPI,
                                                values,
                                                {
                                                    headers: {
                                                        'Access-Control-Allow-Origin': '*',
                                                        'Content-Type': 'application/json',
                                                        'ngrok-skip-browser-warning': 'true',
                                                    }
                                                },
                                            ).then((resp) => {
                                                setSubmitting(false);
                                                setSubmitionCompleted(true);
                                                if (resp.data.STATUS === "FAIL")
                                                    showSnackbar('error', "Error saving Invoice data");
                                                else {
                                                    showSnackbar('success', "Invoice data saved");
                                                }
                                            }).catch(function (error) {
                                                setSubmitting(false);
                                                setSubmitionCompleted(false);
                                                showSnackbar('error', "Error saving Invoice data");
                                            });
                                        }}

                                        validationSchema={Yup.object().shape({
                                            invoiceDate: Yup.string()
                                                .required('invoice Date Required'),
                                            totalHours: Yup.string()
                                                .required('Total Hours Required'),
                                            rate: Yup.string()
                                                .required('Rate Required'),
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
                                                handleSubmit
                                            } = props;
                                            return (
                                                <form onSubmit={handleSubmit} >
                                                    <div className="div_contentHolder" ref={contentRef}>
                                                        <img className="icon" src={assets.vizionLogo} alt="" />
                                                        <TextField
                                                            className="tboxBig"
                                                            variant="standard"
                                                            size="small"
                                                            margin="normal"
                                                            fullWidth
                                                            id="invoiceNumber"
                                                            name="invoiceNumber"
                                                            disabled={true}
                                                            value={invoiceNumber}
                                                        />
                                                        <div className="div_dateHolder mb-6">
                                                            <Stack direction="row" spacing={1} className="flex items-center pl-2 mt-4">
                                                                <div className='divTitleBig'>Invoice Date:</div>
                                                                <TextField
                                                                    className="tboxWidthSmall"
                                                                    size="small"
                                                                    margin="normal"
                                                                    fullWidth
                                                                    id="invoiceDate"
                                                                    name="invoiceDate"
                                                                    type="date"
                                                                    value={values.invoiceDate}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    helperText={(errors.invoiceDate && touched.invoiceDate) && errors.invoiceDate}
                                                                />
                                                            </Stack>
                                                        </div>

                                                        <TableContainer component={Paper} className="tableContainer mb-6">
                                                            <Table size="small" aria-label="a dense table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <StyledTableCell align="left">Title</StyledTableCell>
                                                                        <StyledTableCell align="right">Value</StyledTableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                        <TableCell component="th" scope="row" className="divTitle bg-white">Vendor Name</TableCell>
                                                                        <TableCell align="right" className="divValue3 bg-white">{vendorName}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                        <TableCell component="th" scope="row" className="divTitle bg-white">Employee Name</TableCell>
                                                                        <TableCell align="right" className="divValue3 bg-white">{employeeName}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                        <TableCell component="th" scope="row" className="divTitle bg-white">Job Name</TableCell>
                                                                        <TableCell align="right" className="divValue3 bg-white">{jobName}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                        <TableCell component="th" scope="row" className="divTitle bg-white">Job Title</TableCell>
                                                                        <TableCell align="right" className="divValue3 bg-white">{jobTitle}</TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>

                                                        <div className="mb-6">
                                                            <Stack direction="row" spacing={1} className="flex items-center pl-2 mt-4">
                                                                <div className='w-[130px] divTitleBig'>Rate:</div>
                                                                <TextField
                                                                    className="w-[100px] tboxBig"
                                                                    size="small"
                                                                    margin="normal"
                                                                    fullWidth
                                                                    id="rate"
                                                                    name="rate"
                                                                    type="number"
                                                                    value={values.rate}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    helperText={(errors.rate && touched.rate) && errors.rate}
                                                                />
                                                            </Stack>
                                                        </div>

                                                        <div className="mb-6">
                                                            <Stack direction="row" spacing={1} className="flex items-center pl-2 mt-4">
                                                                <div className='w-[130px] divTitleBig'>Total Hours:</div>
                                                                <TextField
                                                                    className="w-[100px] tboxBig"
                                                                    size="small"
                                                                    margin="normal"
                                                                    fullWidth
                                                                    type="number"
                                                                    id="totalHours"
                                                                    name="totalHours"
                                                                    value={values.totalHours}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    helperText={(errors.totalHours && touched.totalHours) && errors.totalHours}
                                                                />
                                                            </Stack>
                                                        </div>

                                                        <TableContainer component={Paper} className="tableContainer">
                                                            <Table size="small" aria-label="a dense table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <StyledTableCell align="left">Timesheet Details</StyledTableCell>
                                                                        <StyledTableCell align="right"></StyledTableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                        <TableCell component="th" scope="row" className="divTitle bg-white">Timesheet Number</TableCell>
                                                                        <TableCell align="right" className="divValue3 bg-white">{timesheetNumber}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                        <TableCell component="th" scope="row" className="divTitle bg-white">Status</TableCell>
                                                                        <TableCell align="right" className="divValue3 bg-white">
                                                                            {clientDocumentData.data[0] && clientDocumentData.data[0].status === "Approved"
                                                                                ?
                                                                                <span className="text-green-500">Approved</span>
                                                                                :
                                                                                <span className="text-red-500">Pending Approval\Submission</span>
                                                                            }
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </div> {/* End of content div */}

                                                    <div className="divHoursHolder my-4">
                                                        <TimesheetCapturedDayHours timesheetNumber={timesheetNumber} />
                                                    </div>

                                                    <TableContainer component={Paper} className="tableContainer">
                                                        <Table size="small" aria-label="a dense table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <StyledTableCell align="left">Timesheet Documents</StyledTableCell>
                                                                    <StyledTableCell align="right"></StyledTableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                    <TableCell component="th" scope="row" className="divTitle bg-white">Client Approved Document</TableCell>
                                                                    <TableCell align="right" className="divValue2">
                                                                        {apiLoading ?
                                                                            <>
                                                                                <div className="spinner"></div>
                                                                            </> :
                                                                            <>
                                                                                {clientDocumentData.data[0] ? (
                                                                                    <Link className='float-right'
                                                                                        href={clientDocumentData.data[0].gDriveLink}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        underline="none"
                                                                                    >
                                                                                        <Button
                                                                                            size='small'
                                                                                            variant="contained"
                                                                                            color="info"
                                                                                            startIcon={<InsertLinkOutlinedIcon />}
                                                                                        >
                                                                                            Open
                                                                                        </Button>
                                                                                    </Link>
                                                                                ) :
                                                                                    <>
                                                                                        <span className="text-red-500">Missing document</span>
                                                                                    </>
                                                                                }
                                                                            </>
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                    <TableCell component="th" scope="row" className="divTitle">Implementation Partner / Vendor Approved Document</TableCell>
                                                                    <TableCell align="right" className="divValue2">
                                                                        {apiLoading ?
                                                                            <>
                                                                                <div className="spinner"></div>
                                                                            </> :
                                                                            <>
                                                                                {iPVendorDocumentData.data[0] ? (
                                                                                    <Link className='float-right'
                                                                                        href={iPVendorDocumentData.data[0].gDriveLink}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        underline="none"
                                                                                    >
                                                                                        <Button
                                                                                            size='small'
                                                                                            variant="contained"
                                                                                            color="info"
                                                                                            startIcon={<InsertLinkOutlinedIcon />}
                                                                                        >
                                                                                            Open
                                                                                        </Button>
                                                                                    </Link>
                                                                                ) :
                                                                                    <>
                                                                                        <span className="">No document</span>
                                                                                    </>
                                                                                }
                                                                            </>
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>

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
                                                    <div className={`${clientDocumentData.data[0] && clientDocumentData.data[0].status === "Approved" ? 'DivButtonsHolder' : ''}`}>
                                                        {isSubmitting ? (
                                                            <div className="spinner mt-8"></div>
                                                        ) : (
                                                            (clientDocumentData.data[0] && clientDocumentData.data[0].status === "Approved" ? (
                                                                <Stack direction="row" spacing={2} className='mt-6'>
                                                                    <Button color="secondary" variant="contained" disabled={isSubmitting && !isSubmitionCompleted}
                                                                        onClick={downloadInvoiceAsPDF}
                                                                    >
                                                                        <DownloadForOfflineOutlinedIcon className="mr-1" />
                                                                        Download Invoice
                                                                    </Button>
                                                                    {/* <Button color="info" variant="contained" disabled={isSubmitting && !isSubmitionCompleted}
                                                                        onClick={downloadInvoiceAsPDFAndTSDocuments}
                                                                    >
                                                                        <DownloadForOfflineOutlinedIcon className="mr-1" />
                                                                        Download All
                                                                    </Button> */}
                                                                    {!isSubmitionCompleted && (
                                                                        <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                                                            <SaveOutlinedIcon className="mr-1" />
                                                                            Save
                                                                        </Button>
                                                                    )}
                                                                </Stack>
                                                            ) :
                                                                <>
                                                                    <Alert severity="error" className="my-4">The related timesheet is not submitted\approved.</Alert>
                                                                </>
                                                            )
                                                        )}
                                                    </div>
                                                </form>
                                            );
                                        }}
                                    </Formik>
                                </div>
                            </TabPanel>
                            <TabPanel className="px-2">
                                <div className="divTimesheetMetadataHolder my-4">
                                    <InvoiceTimesheetDetails operation="View" doLoading={true} moduleName="MY_TIMESHEETS" timesheetNumber={timesheetNumber} />
                                </div>
                            </TabPanel>
                        </Tabs>
                    </Box>


                </DialogContent>
            </BootstrapDialog>
        </>
    )
}

export default InvoiceView;
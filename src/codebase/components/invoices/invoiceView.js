import React, { useContext, useState, useEffect, useRef } from "react";
import configData from "../../../CONFIG_RELEASE.json";
import { Context } from "../../context/context";
import 'reactjs-popup/dist/index.css';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { Alert, Chip, Link, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
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
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import Modal from 'react-modal';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

const InvoiceView = ({ operation, manualLoadData, invoiceNumber, employeeID, jobID, startDate, endDate, totalHours, status, jobType,
    jobStartDate, jobEndDate, jobName, jobTitle, clientName, implementationPartnerName, vendorName,
    daysPending, employeeName, personalEmail, invoiceDate, rate, timesheetNumber, paymentTerms, Id,
    showSnackbar, userNotes, vendorId, manualLoadDataWithMessage, performLoading, setPerformLoading,
    otherAmountFromDB, totalAmountFromDB, vendorInvoiceNumber, invoicePeriod, timesheetsPeriod, address, state, city, zip, email }) => {

    const { APIPath, userName } = useContext(Context);
    const [isCustomInvoice, setIsCustomInvoice] = React.useState(false);
    const [doLoading, setDoLoading] = React.useState(true);
    const [dataSaved, setDataSaved] = React.useState(false);
    const [clientDocumentData, setClientDocumentData] = useState({ data: [] });
    const [iPVendorDocumentData, setIPVendorDocumentData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(false);
    const [dataAudit, setDataAudit] = useState({ data: [] });
    const contentRef = useRef(null); // Reference to the form element
    const [localRate, setLocalRate] = React.useState(rate);
    const [localHours, setLocalHours] = React.useState(totalHours);
    const [localTotal, setLocalTotal] = React.useState((rate * totalHours).toFixed(2));

    const handleRateChange = (event) => {
        const rate = parseFloat(event.target.value);
        setLocalRate(rate);
        setLocalTotal((rate * localHours).toFixed(2));
    };

    const handleHoursChange = (event) => {
        const hours = parseFloat(event.target.value);
        setLocalHours(hours);
        setLocalTotal((hours * localRate).toFixed(2));
    };

    const [otherCosts, setOtherCosts] = useState([{ title: "", otherAmount: "" }]);
    const [otherCostsFromDB, setOtherCostsFromDB] = useState([]);
    const handleOtherCostChange = (index, event) => {
        const { name, value } = event.target;
        const updatedOtherCosts = [...otherCosts];
        updatedOtherCosts[index][name] = value;
        setOtherCosts(updatedOtherCosts);
    };

    const addOtherCostRow = () => {
        setOtherCosts([...otherCosts, { title: "", otherAmount: "" }]);
    };

    const deleteOtherCostRow = async (index) => {
        const cost = otherCosts[index];
        if (cost.title && cost.otherAmount) {
            try {
                const response = await axios.post(`${APIPath}/deleteinvoiceothercosts`, {
                    invoiceId: Id,
                    title: cost.title,
                    otherAmount: cost.otherAmount
                }, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    }
                });

                if (response.data.STATUS === "SUCCESS") {
                    showSnackbar('success', "Other cost deleted successfully");
                    const updatedOtherCosts = otherCosts.filter((_, i) => i !== index);
                    getInvoiceOtherCosts(Id);
                } else {
                    showSnackbar('error', "Error deleting other cost");
                }
            } catch (error) {
                showSnackbar('error', "Error deleting other cost");
            }
        }
        else {
            const updatedOtherCosts = otherCosts.filter((_, i) => i !== index);
            setOtherCosts(updatedOtherCosts);
        }

    };

    const saveOtherCosts = () => {
        otherCosts.forEach(cost => {
            if (cost.title && cost.otherAmount) {
                axios.post(APIPath + "/addinvoiceothercosts", {
                    invoiceId: Id,
                    title: cost.title,
                    otherAmount: cost.otherAmount,
                    createdBy: userName
                }, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    }
                }).then(response => {
                    if (response.data.STATUS === "SUCCESS") {
                        showSnackbar('success', "Other costs saved successfully");
                        getInvoiceOtherCosts(Id);
                    } else {
                        showSnackbar('error', "Error saving other costs");
                    }
                }).catch(error => {
                    showSnackbar('error', "Error saving other costs");
                });
            }
        });
    };
    const getInvoiceOtherCosts = async (invoiceId) => {
        try {
            const response = await axios.get(`${APIPath}/getinvoiceothercosts/${invoiceId}`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                }
            });

            if (response.data.STATUS === "SUCCESS") {
                setOtherCostsFromDB(response.data.data);
                setOtherCosts(response.data.data);
                let templocalTotal = rate * totalHours;
                const total = response.data.data.reduce((sum, cost) => sum + parseFloat(cost.otherAmount), 0);
                let grandTotal = (templocalTotal + total).toFixed(2);
                setLocalTotal(grandTotal);
            } else {
                showSnackbar('error', "Error fetching other costs");
                setOtherCostsFromDB([]);
            }
        } catch (error) {
            showSnackbar('error', "Error fetching other costs");
            setOtherCostsFromDB([]);
        }
    };


    const [modalIsOpen, setIsOpen] = React.useState(false);
    function openModal() {
        if (!modalIsOpen) {
            setIsOpen(true);
            setDoLoading(true);
            setPerformLoading(true);
            if (!invoiceNumber.startsWith("CUST-INV")) {
                setIsCustomInvoice(false)
                getClientDocumentDetails();
                getIPVendorDocumentDetails();
            }
            else {
                console.log("OPEN: CUSTOM INVOICE")
                console.log("OPEN: TS:" + timesheetNumber)
                setIsCustomInvoice(true)
            }
            getAuditDetails();
            if ((operation !== "View"))
                getInvoiceOtherCosts(Id);


            // if (address === "" || address === undefined) {
            //     getVendorDetails();
            // }
            getVendorDetails();
        }
        //setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
        setDoLoading(false);
        manualLoadData();
    }
    const handleCloseOnSaved = (event, reason) => {
        setIsOpen(false);
        setDoLoading(false);
        manualLoadDataWithMessage();
    };

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
        if (invoicePeriod === "Monthly (1)" && timesheetsPeriod === "Weekly (Monday)") {
            console.log("Monthly (1) - Weekly (Monday)")
            apiUrl = APIPath + "/getlatesttimesheetcdocumentbydates";

            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    employeeID: employeeID,
                    jobID: jobID,
                    startDate: startDate,
                    endDate: endDate
                })
            })
                .then(response => response.json())
                .then(
                    (result) => {
                        if (result.error) {
                            setClientDocumentData({});
                        } else {
                            setClientDocumentData(result);
                        }
                        setApiLoading(false);
                    },
                    (error) => {
                        setClientDocumentData({});
                        setApiLoading(false);
                    }
                );

        }
        else {
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
    }
    const getIPVendorDocumentDetails = () => {
        let apiUrl = APIPath + "/getlatesttimesheetivdocument/" + timesheetNumber;
        if (invoicePeriod === "Monthly (1)" && timesheetsPeriod === "Weekly (Monday)") {
            console.log("Monthly (1) - Weekly (Monday)")
            apiUrl = APIPath + "/getlatesttimesheetivdocumentbydates";
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    employeeID: employeeID,
                    jobID: jobID,
                    startDate: startDate,
                    endDate: endDate
                })
            })
                .then(response => response.json())
                .then(
                    (result) => {
                        if (result.error) {
                            setIPVendorDocumentData({});
                        } else {
                            setIPVendorDocumentData(result);
                        }
                        setApiLoading(false);
                    },
                    (error) => {
                        setIPVendorDocumentData({});
                        setApiLoading(false);
                    }
                );

        }
        else {
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
    }

    const getAuditDetails = () => {
        setApiLoading(true);
        //let apiUrl = APIPath + "/getinvoiceauditbynumber" + "/" + invoiceNumber;
        let apiUrl = APIPath + "/getinvoiceauditbyid" + "/" + Id;
        
        // console.log(apiUrl)
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        setDataAudit({ data: [] });
                    } else {
                        setDataAudit(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setDataAudit({ data: [] });
                    setApiLoading(false);
                }
            );
    };

    const [vendorData, setVendorData] = useState({ data: [] });
    const getVendorDetails = () => {
        let apiUrl = APIPath + "/getvendordetails/" + vendorId;
        // console.log(apiUrl)
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        // console.log("RequestData:On error return: setting empty")
                        setVendorData({});
                    }
                    else {
                        setVendorData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setVendorData({});
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }

    useEffect(() => {
        if ((operation === "View" || operation === "Edit") && doLoading && performLoading) {
            console.log("LOAD...");
            if (!invoiceNumber.startsWith("CUST-INV")) {
                setIsCustomInvoice(false)
                getClientDocumentDetails();
                getIPVendorDocumentDetails();
            }
            else {
                console.log("useEffect: CUSTOM INVOICE")
                setIsCustomInvoice(true)
            }
            if (operation === "Edit") {
                getAuditDetails();
            }
            getVendorDetails();
        }
    }, [invoiceNumber]);

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
                <IconButton aria-label="Metadata" title="Metadata" color="primary"
                    // onClick={handleClickOpen} 
                    onClick={openModal}>
                    <ReadMoreIcon />
                </IconButton>
            </Stack>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                // style={customStyles}
                ariaHideApp={false}
                contentLabel="Invoice Details"
                style={{
                    content: {
                        maxHeight: '90vh', // Adjust as needed
                        overflowY: 'auto',
                        zIndex: 9999, // Add your desired z-index value here,
                        padding: '5px',
                    }
                }}
            >
                <div className="div_invoiceMainDetailsHolder">
                    <div className="div_invoicedialogTitle">{operation} Invoice: {invoiceNumber}</div>
                    <IconButton
                        aria-label="close"
                        onClick={closeModal}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <Tabs>
                            <TabList className="subTabsListHolder">
                                <Tab><PaidOutlinedIcon className="mr-1" />Invoice</Tab>
                                {operation === "Edit" || operation === "Closed" && (
                                    <Tab><HistoryOutlinedIcon className="mr-1" />Invoice Audit</Tab>
                                )}
                                <Tab><MoreTimeIcon className="mr-1" />Related Timesheet</Tab>
                            </TabList>

                            <TabPanel className="px-2">
                                <div className="div_InvoiceHolderMain" >
                                    {isCustomInvoice && (
                                        <div className="div_customInvoice">CUSTOM INVOICE</div>
                                    )}
                                    <Formik
                                        // enableReinitialize
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
                                            createdBy: userName,
                                            Id: Id,
                                            modifiedBy: userName,
                                            userNotes: (userNotes === "" || userNotes === undefined) ? "-" : userNotes,
                                            vendorId: vendorId,
                                            totalAmount: localTotal,
                                            otherAmount: otherCostsFromDB.reduce((acc, cost) => acc + cost.otherAmount, 0),
                                            vendorInvoiceNumber: vendorInvoiceNumber,
                                            address: address,
                                            state: state,
                                            city: city,
                                            zip: zip,
                                            email: email
                                        }}
                                        onSubmit={(values, { setSubmitting }) => {
                                            var finalAPI = APIPath + "/addinvoice";
                                            if (operation === "Edit")
                                                finalAPI = APIPath + "/updateinvoice";
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
                                            ).then(async (resp) => {
                                                setSubmitting(false);
                                                setSubmitionCompleted(true);
                                                if (resp.data.STATUS === "FAIL")
                                                    if (operation === "Edit")
                                                        showSnackbar('error', "Error updating Invoice data");
                                                    else
                                                        showSnackbar('error', "Error saving Invoice data");
                                                else {
                                                    if (operation === "Edit") {
                                                        setDataSaved(true);
                                                        showSnackbar('success', "Invoice data Updated");
                                                        handleCloseOnSaved();
                                                    }
                                                    else {
                                                        showSnackbar('success', "Invoice data saved");
                                                    }
                                                }
                                            }).catch(function (error) {
                                                setSubmitting(false);
                                                setSubmitionCompleted(false);
                                                if (operation === "Edit")
                                                    showSnackbar('error', "Error updating Invoice data");
                                                else
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
                                            userNotes: Yup.string()
                                                .required('Notes Required'),
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
                                                        {/* <img className="icon" src={assets.vizionLogo} alt="" /> */}
                                                        <div className="div_CompanyTopDetailsHolder">
                                                            <div className="title">
                                                                {configData.companyDetails[0].title}
                                                            </div>
                                                            <div className="address">
                                                                {configData.companyDetails[0].address}
                                                            </div>
                                                        </div>
                                                        <Stack direction="row" spacing={1} className="flex items-center pl-2 mt-4">
                                                            <div className='divTitleBig text-red-600'>Vendor Invoice Number:</div>
                                                            <div className="tboxBig">{vendorInvoiceNumber}</div>
                                                            {/* <TextField
                                                                className="tboxBig text-red-600"
                                                                variant="standard"
                                                                size="small"
                                                                margin="normal"
                                                                fullWidth
                                                                id="vendorInvoiceNumber"
                                                                name="vendorInvoiceNumber"
                                                                disabled={true}
                                                                value={vendorInvoiceNumber}
                                                            /> */}
                                                            <div className='divTitleBig'>Invoice Date:</div>
                                                            <TextField
                                                                className="tboxWidthSmall2"
                                                                size="small"
                                                                variant="standard"
                                                                // margin="normal"
                                                                // fullWidth
                                                                id="invoiceDate"
                                                                name="invoiceDate"
                                                                type="date"
                                                                disabled={operation === "Closed"}
                                                                value={values.invoiceDate}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                helperText={(errors.invoiceDate && touched.invoiceDate) && errors.invoiceDate}
                                                            />
                                                        </Stack>
                                                        <div className="div_dateHolder mb-6">
                                                            <Stack direction="row" spacing={1} className="flex items-center pl-2 mt-4">
                                                            </Stack>
                                                        </div>

                                                        <TableContainer component={Paper} className="tableContainer mb-6">
                                                            <Table size="small" aria-label="a dense table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <StyledTableCell align="left"></StyledTableCell>
                                                                        <StyledTableCell align="right"></StyledTableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableRow >
                                                                        <TableCell component="th" scope="row" className="divTitle bg-white">Bill to:</TableCell>
                                                                        <TableCell align="right" className="divValue3 bg-white">{vendorName}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow >
                                                                        <TableCell component="th" scope="row" className="divTitle bg-white">Address</TableCell>
                                                                        <TableCell align="right" className="divValue3 bg-white">
                                                                            {(vendorData.data[0]) && (
                                                                                <table className="w-full">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td className="tValue">{vendorData.data[0].address}</td>
                                                                                            <td className="tTitle">State</td>
                                                                                            <td className="tValue">{vendorData.data[0].state}</td>
                                                                                            <td className="tTitle">City</td>
                                                                                            <td className="tValue">{vendorData.data[0].city}</td>
                                                                                            <td className="tTitle">Zip</td>
                                                                                            <td className="tValue">{vendorData.data[0].zip}</td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow >
                                                                        <TableCell component="th" scope="row" className="divTitle bg-white">Email</TableCell>
                                                                        <TableCell align="right" className="divValue3 bg-white">{vendorData.data[0] ? vendorData.data[0].email : ''}</TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>

                                                        <TableContainer component={Paper} className="tableContainer mb-6">
                                                            <Table size="small" aria-label="a dense table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <StyledTableCell align="left"></StyledTableCell>
                                                                        <StyledTableCell align="right"></StyledTableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableRow >
                                                                        <TableCell component="th" scope="row" className="divTitle bg-white">Description</TableCell>
                                                                        <TableCell align="right" className="divValue3 bg-white">{jobTitle} from {employeeName}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow >
                                                                        <TableCell component="th" scope="row" className="divTitle bg-white">Start Date</TableCell>
                                                                        <TableCell align="right" className="divValue3 bg-white">{startDate}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow >
                                                                        <TableCell component="th" scope="row" className="divTitle bg-white">End Date</TableCell>
                                                                        <TableCell align="right" className="divValue3 bg-white">{endDate}</TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>

                                                        <TableContainer component={Paper} className="tableContainer mb-6">
                                                            <Table size="small" aria-label="a dense table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <StyledTableCell align="left"></StyledTableCell>
                                                                        <StyledTableCell align="right"></StyledTableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableRow >
                                                                        <TableCell component="th" scope="row" className="divTitle bg-white">Rate</TableCell>
                                                                        <TableCell align="right" className="divValue3 bg-white">$ {localRate}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow >
                                                                        <TableCell component="th" scope="row" className="divTitle bg-white">Hours</TableCell>
                                                                        <TableCell align="right" className="divValue3 bg-white">{localHours}</TableCell>
                                                                    </TableRow>

                                                                    {otherCostsFromDB.map((cost, index) => (
                                                                        <TableRow key={index} >
                                                                            <TableCell component="th" scope="row" className="divTitle bg-slate-100">{cost.title}</TableCell>
                                                                            <TableCell align="right" className="divValue3 bg-slate-100">$ {cost.otherAmount}</TableCell>
                                                                        </TableRow>
                                                                    ))}

                                                                    <TableRow >
                                                                        <TableCell component="th" scope="row" className="divTitle bg-white">Total Amount</TableCell>
                                                                        <TableCell align="right" className="divValue3 bg-white">$ {localTotal}</TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>

                                                        <div className="div_CompanyBottomDetailsHolder w-full">
                                                            <table className="w-full">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="text-left align-top">
                                                                            Make cheque payable to: {configData.companyDetails[0].chequeTitle}
                                                                        </td>
                                                                        <td>
                                                                            <table>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td>
                                                                                            {configData.companyDetails[0].chequeTitle}
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            {configData.companyDetails[0].chequeAddress}
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            {configData.companyDetails[0].chequePhone}
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            {configData.companyDetails[0].chequeEmail}
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div> {/* End of content div */}

                                                    <div className="mb-6">
                                                        <Stack direction="row" spacing={1} className="flex items-center pl-2 mt-4">
                                                            <div className='w-[130px] divTitleBig'>Rate ($):</div>
                                                            <TextField
                                                                className="w-[100px] tboxBig"
                                                                size="small"
                                                                margin="normal"
                                                                fullWidth
                                                                id="rate"
                                                                name="rate"
                                                                type="number"
                                                                value={values.rate}
                                                                disabled={operation === "Closed"}
                                                                // onChange={handleChange}
                                                                onChange={(event) => {
                                                                    handleChange(event);
                                                                    handleRateChange(event);
                                                                }}
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
                                                                disabled={operation === "Closed"}
                                                                value={values.totalHours}
                                                                // onChange={handleChange}
                                                                onChange={(event) => {
                                                                    handleChange(event);
                                                                    handleHoursChange(event);
                                                                }}
                                                                onBlur={handleBlur}
                                                                helperText={(errors.totalHours && touched.totalHours) && errors.totalHours}
                                                            />
                                                        </Stack>
                                                    </div>
                                                    <TextField
                                                        className=""
                                                        size="small"
                                                        margin="normal"
                                                        fullWidth
                                                        id="userNotes"
                                                        name="userNotes"
                                                        label="Notes"
                                                        disabled={operation === "Closed"}
                                                        multiline
                                                        rows={2}
                                                        value={(values.userNotes === "" || values.userNotes === undefined) ? "-" : values.userNotes}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        helperText={(errors.userNotes && touched.userNotes) && errors.userNotes}
                                                    />

                                                    {/* DYNAMIC OTHER COSTS */}
                                                    {Id && (
                                                        <table className="w-full myInvTable bg-slate-100">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <Stack direction="column" spacing={1} className="flex items-center ">

                                                                            <div className='w-[130px] divTitleBig'>Other Costs</div>

                                                                            {otherCosts.map((cost, index) => (

                                                                                <Stack key={index} direction="row" spacing={1} className="flex items-center ">
                                                                                    <div className="flex items-center gap-4">
                                                                                        <TextField
                                                                                            className="w-[200px]"
                                                                                            size="small"
                                                                                            margin="normal"
                                                                                            fullWidth
                                                                                            id={`title-${index}`}
                                                                                            name="title"
                                                                                            label="Title"
                                                                                            value={cost.title}
                                                                                            disabled={operation === "Closed"}
                                                                                            onChange={(event) => handleOtherCostChange(index, event)}
                                                                                        />
                                                                                        <TextField
                                                                                            className=""
                                                                                            size="small"
                                                                                            margin="normal"
                                                                                            fullWidth
                                                                                            id={`otherAmount-${index}`}
                                                                                            name="otherAmount"
                                                                                            label="Amount ($)"
                                                                                            type="number"
                                                                                            value={cost.otherAmount}
                                                                                            disabled={operation === "Closed"}
                                                                                            onChange={(event) => handleOtherCostChange(index, event)}
                                                                                        />
                                                                                        <IconButton
                                                                                            disabled={operation === "Closed"} onClick={() => deleteOtherCostRow(index)} color="error">
                                                                                            <CloseIcon />
                                                                                        </IconButton>
                                                                                    </div>
                                                                                </Stack>
                                                                            ))}
                                                                            <Stack direction="row" spacing={1} className="flex items-center ">
                                                                                <IconButton onClick={addOtherCostRow} color="secondary"
                                                                                    disabled={operation === "Closed"}>
                                                                                    <AddCircleOutlineRoundedIcon />
                                                                                </IconButton>
                                                                                <IconButton onClick={saveOtherCosts} color="primary"
                                                                                    disabled={operation === "Closed"}>
                                                                                    <SaveRoundedIcon />
                                                                                </IconButton>
                                                                            </Stack>
                                                                        </Stack>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    )}

                                                    {/* DYNAMIC OTHER COSTS */}


                                                    {!isCustomInvoice && (
                                                        <>
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
                                                                            <TableCell component="th" scope="row" className="divTitle bg-white">
                                                                                <Stack direction={"row"} spacing={1} className="flex items-center place-items-start  ">
                                                                                    <Button size="small" onClick={getClientDocumentDetails} variant="contained">load</Button>
                                                                                    <span>
                                                                                        Client Approved Documents
                                                                                    </span>
                                                                                </Stack>
                                                                            </TableCell>

                                                                            <TableCell align="right" className="divValue2">
                                                                                {apiLoading ? (
                                                                                    <>
                                                                                        <div className="spinner"></div>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        {clientDocumentData.data.length > 0 ? (
                                                                                            clientDocumentData.data.map((item, index) => (
                                                                                                <div key={index} className="mb-2">
                                                                                                    <Link
                                                                                                        href={item.gDriveLink}
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
                                                                                                </div>
                                                                                            ))
                                                                                        ) : (
                                                                                            <span className="text-red-500">
                                                                                                Missing Documents
                                                                                            </span>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                            <TableCell component="th" scope="row" className="divTitle">
                                                                                <Stack direction={"row"} spacing={1} className="flex items-center place-items-start ">
                                                                                    <Button size="small" onClick={getIPVendorDocumentDetails} variant="contained">load</Button>
                                                                                    <span>
                                                                                        Implementation Partner / Vendor Approved Document
                                                                                    </span>
                                                                                </Stack>
                                                                            </TableCell>
                                                                            <TableCell align="right" className="divValue2">
                                                                                {apiLoading ?
                                                                                    <>
                                                                                        <div className="spinner"></div>
                                                                                    </> :
                                                                                    <>
                                                                                        {iPVendorDocumentData.data.length > 0 ? (
                                                                                            iPVendorDocumentData.data.map((item, index) => (
                                                                                                <div key={index} className="mb-2">
                                                                                                    <Link
                                                                                                        href={item.gDriveLink}
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
                                                                                                </div>
                                                                                            ))
                                                                                        ) : (
                                                                                            <span className="text-red-500">
                                                                                                Missing Documents
                                                                                            </span>
                                                                                        )}
                                                                                    </>
                                                                                }
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </>
                                                    )}


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
                                                    <div className={`${(clientDocumentData.data[0] && clientDocumentData.data[0].status === "Approved") || isCustomInvoice ? 'DivButtonsHolder' : ''}`}>
                                                        {isSubmitting ? (
                                                            <div className="spinner mt-8"></div>
                                                        ) : (
                                                            ((clientDocumentData.data[0] && clientDocumentData.data[0].status === "Approved") || isCustomInvoice ? (
                                                                <Stack direction="row" spacing={2} className='mt-6'>
                                                                    {operation !== "View" && (
                                                                        <Button color="secondary" variant="contained" disabled={isSubmitting && !isSubmitionCompleted}
                                                                            onClick={downloadInvoiceAsPDF}
                                                                        >
                                                                            <DownloadForOfflineOutlinedIcon className="mr-1" />
                                                                            Download Invoice
                                                                        </Button>
                                                                    )}
                                                                    {/* <Button color="info" variant="contained" disabled={isSubmitting && !isSubmitionCompleted}
                                                                        onClick={downloadInvoiceAsPDFAndTSDocuments}
                                                                    >
                                                                        <DownloadForOfflineOutlinedIcon className="mr-1" />
                                                                        Download All
                                                                    </Button> */}
                                                                    {operation === "Edit" ?
                                                                        <>
                                                                            {!isSubmitionCompleted ? (
                                                                                <Button color="primary" variant="contained" type="submit" disabled={(isSubmitting && !isSubmitionCompleted) || operation === "Closed"}>
                                                                                    <SaveOutlinedIcon className="mr-1" />
                                                                                    Update
                                                                                </Button>
                                                                            ) :
                                                                                <>
                                                                                    <Chip label='Updated' color='success' />
                                                                                </>
                                                                            }
                                                                        </>
                                                                        :
                                                                        <>
                                                                            {!isSubmitionCompleted && (
                                                                                <Button color="primary" variant="contained" type="submit" disabled={(isSubmitting && !isSubmitionCompleted) || operation === "Closed"}>
                                                                                    <SaveOutlinedIcon className="mr-1" />
                                                                                    Save
                                                                                </Button>
                                                                            )}
                                                                        </>
                                                                    }
                                                                </Stack>
                                                            ) :
                                                                <>
                                                                    <Alert severity="error" className="my-4">The related timesheet is not submitted\approved. {isCustomInvoice}</Alert>
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
                            {(operation === "Edit" || operation === "Closed") && (
                                <TabPanel className="px-2">
                                    <VerticalTimeline layout='1-column-left'>
                                        {dataAudit.data.map((entry, index) => (
                                            <VerticalTimelineElement
                                                key={index}
                                                iconStyle={{ background: '#ccc', color: '#000' }}
                                            >
                                                <h3 className="vertical-timeline-element-title ">Event {dataAudit.data.length - index} on: {entry.actionDate}</h3>
                                                <h4 className="vertical-timeline-element-subtitle">By: {entry.actionBy}</h4>
                                                <h4 className="vertical-timeline-element-subtitle2">Hours: {entry.totalHours}</h4>
                                                <h4 className="vertical-timeline-element-subtitle2 ml-4">Rate: {entry.rate}</h4>
                                                <div className='vertical-timeline-element-notes'>{entry.action}</div>
                                            </VerticalTimelineElement>
                                        ))}
                                    </VerticalTimeline>
                                </TabPanel>
                            )}
                            <TabPanel className="px-2">
                                <div className="divTimesheetMetadataHolder my-4">
                                    <InvoiceTimesheetDetails operation="View" doLoading={true} moduleName="MY_TIMESHEETS" timesheetNumber={timesheetNumber} />
                                </div>
                            </TabPanel>
                        </Tabs>
                    </Box>
                </div>


            </Modal>

        </>
    )
}

export default InvoiceView;
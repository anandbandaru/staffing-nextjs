import React, { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../../context/context";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import InvoicesListToolbar from './invoicesListToolbar'
import CustomSnackbar from "../snackbar/snackbar";
import InvoiceView from "./invoiceView";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Button from '@mui/material/Button';

const InvoiceSavedList = () => {
    const { APIPath, setRefreshBalance, refreshBalance } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(false);
    const [performLoading, setPerformLoading] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");
    const [itemCount, setItemCount] = useState(0);

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
        delaydMockLoading();
    }, []);

    function manualLoadData() {
        showSnackbar('success', "Invoice updated");
        setApiLoading(true);
        // setRefreshBalance(!refreshBalance);
        delaydMockLoading();
    }
    function manualLoadDataWithMessage() {
        console.log("manualLoadDataWithMessage");
        handleClickOpen();
        showSnackbar('success', "Invoice updated");
        setApiLoading(true);
        // setRefreshBalance(!refreshBalance);
        delaydMockLoading();
    }

    function delaydMockLoading() {
        setApiLoading(true);
        setItemCount(0);
        setTimeout(() => {
            getList();
        }, 1);
    }

    const getList = () => {
        setData({ data: [] });
        let apiUrl = APIPath + "/getallsavedinvoices";
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        setData({});
                        setItemCount(0);
                    }
                    else {
                        setData(result);
                        setItemCount(result.total);
                        setDataAPIError(result.STATUS === "FAIL" ? "API Error" : "");
                        if (result.STATUS === "FAIL") {
                            showSnackbar('error', result.ERROR.MESSAGE);
                        }
                        else
                            showSnackbar('success', "Saved Invoices Data fetched");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setDataAPIError(error.toString());
                    setData({});
                    setItemCount(0);
                    setApiLoading(false);
                }
            )
    }

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const gridRef = useRef(null);
    const onExportClick = () => {
        gridRef.current.api.exportDataAsCsv();
    };
    const CustomDetailsComponent = (props) => {
        return (
            <>
                <InvoiceView
                    operation="Edit"
                    manualLoadData={manualLoadData}
                    invoiceNumber={props.data.invoiceNumber}
                    // timesheetNumber={props.data.invoiceNumber.replace(/^INV-/, 'T-')}
                    timesheetNumber={props.data.timesheetNumber}
                    employeeID={props.data.employeeID}
                    jobID={props.data.jobID}
                    startDate={props.data.startDate}
                    endDate={props.data.endDate}
                    totalHours={props.data.totalHours}
                    status={props.data.status}
                    jobType={props.data.jobType}
                    jobStartDate={props.data.jobStartDate}
                    jobEndDate={props.data.jobEndDate}
                    jobName={props.data.jobName}
                    jobTitle={props.data.jobTitle}
                    clientName={props.data.clientName}
                    implementationPartnerName={props.data.implementationPartnerName}
                    vendorName={props.data.vendorName}
                    daysPending={props.data.daysPending}
                    employeeName={props.data.employeeName}
                    personalEmail={props.data.personalEmail}
                    invoiceDate={props.data.invoiceDate}
                    showSnackbar={showSnackbar}
                    rate={props.data.rate}
                    paymentTerms={props.data.paymentTerms}
                    Id={props.data.Id}
                    userNotes={props.data.userNotes}
                    manualLoadDataWithMessage={manualLoadDataWithMessage}
                    vendorId={props.data.vendorId}
                    performLoading={false}
                    setPerformLoading={setPerformLoading}
                    vendorInvoiceNumber={props.data.vendorInvoiceNumber}
                    address={props.data.address}
                    state={props.data.state}
                    city={props.data.city}
                    zip={props.data.zip}
                    email={props.data.email}
                    invoicePeriod={props.data.invoicePeriod}
                    timesheetsPeriod={props.data.timesheetsPeriod}
                />
            </>
        );
    };

    const CustomJobTypeRenderer = ({ value }) => {
        let className = 'badgeSpan';
        switch (value) {
            case 'WEEKLY':
                className += ' rag-green-bg';
                break;
            case 'MONTHLY':
                className += ' rag-red-bg';
                break;
            case 'BIWEEKLY':
                className += ' rag-gray-bg';
                break;
            default:
                className += ' rag-orange-bg';
                break;
        }
        return (
            <span className={className}>
                {value}
            </span>
        );
    };
    const CustomHoursRenderer = ({ value }) => {
        let className = 'badgeSpan';
        if (value > 0)
            className += ' rag-blue-bg';
        else
            className += ' rag-gray-bg';
        return (
            <span className={className}>
                {value}
            </span>
        );
    };
    const CustomDaysDueRenderer = ({ value }) => {
        let className = 'badgeSpan';
        if (value > 0)
            className += ' rag-green-bg';
        else if (value == 0)
            className += ' rag-orange-bg';
        else if (value < 0)
            className += ' rag-red-bg';
        return (
            <span className={className}>
                {value}
            </span>
        );
    };
    const CustomStatusRenderer = ({ value }) => {
        let className = 'badgeSpan';
        switch (value) {
            case 'Saved':
                className += ' rag-orange-bg';
                break;
            case 'Pending':
                className += ' rag-red-bg';
                break;
            case 'Closed':
                className += ' rag-green-bg';
                break;
            default:
                className += ' rag-orange-bg';
                break;
        }
        return (
            <span className={className}>
                {value}
            </span>
        );
    };
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs] = useState([
        { field: "invoiceDate", filter: true, maxWidth: 130 },
        { field: "vendorInvoiceNumber", headerName: 'V-Invoice Number', filter: true },
        { field: "rate", filter: true, maxWidth: 100 },
        { field: "totalHours", headerName: 'Hours', filter: true, cellRenderer: CustomHoursRenderer, maxWidth: 80 },
        { field: "paymentTerms", filter: true, maxWidth: 110 },
        { field: "daysDue", filter: true, cellRenderer: CustomDaysDueRenderer, maxWidth: 100 },
        { field: "employeeName", filter: true },
        { field: "vendorName", filter: true },
        { field: "startDate", filter: true, maxWidth: 130 },
        { field: "endDate", filter: true, maxWidth: 130 },
        { field: "totalAmount", cellRenderer: CustomHoursRenderer, filter: true },
        // { field: "jobID", headerName: 'JOB ID', filter: true, maxWidth: 90 },
        // { field: "jobTitle", filter: true },
        // { field: "jobType", headerName: 'Invoice Frequency', filter: true, cellRenderer: CustomJobTypeRenderer, maxWidth: 120 },
        // { field: "clientName", filter: true },
        // {
        //     field: "invoiceStatus", filter: true, maxWidth: 100, headerName: 'Invoice Status',
        //     cellRenderer: CustomStatusRenderer
        // },
        {
            field: "VIEW", cellRenderer: CustomDetailsComponent, maxWidth: 90, resizable: true, pinned: 'right', cellStyle: { backgroundColor: '#b7bfcf' }
        },
    ]);
    const rowClassRules = {
        // apply red to Ford cars
        //'rag-red': params => params.data.firstName === "anand",
    };
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [5, 10, 20, 50];
    const autoSizeStrategy = {
        // type: 'fitGridWidth',
        defaultMinWidth: 50
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Update Operation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Invoice Data updated successfully
                    </DialogContentText>
                </DialogContent>
            </Dialog>

            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <div className="w-full flex bg-kmcBG dark:bg-gray-700 text-sm justify-between place-items-center space-x-2 py-2 px-2 ">

                {/* TOOLS */}
                <InvoicesListToolbar
                    operation="Add"
                    itemCount={itemCount}
                    apiLoading={apiLoading}
                    dataAPIError={dataAPIError}
                    manualLoadData={manualLoadData} />
                {/* TOOLS */}

            </div>

            <div
                className="ag-theme-quartz relative" // applying the Data Grid theme
                style={{ height: 500 }} // the Data Grid will fill the size of the parent container
            >
                <AgGridReact
                    ref={gridRef}
                    rowData={data.data}
                    columnDefs={colDefs}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    rowClassRules={rowClassRules}
                    autoSizeStrategy={autoSizeStrategy}
                />
                <div className="absolute right-2 bottom-20">
                    <Button size="small" variant="contained" onClick={onExportClick}>Export to CSV</Button>
                </div>
            </div>
        </>
    )
}

export default InvoiceSavedList;
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import CustomSnackbar from "../snackbar/snackbar";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import GenericDetails from "../forms/GenericDetails";
import TimesheetAction from "./timesheetAction";
import TimesheetAudit from "./timesheetAudit";
import { Button } from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';
import PendingListToolbar from "../timesheetentry/pendingListToolbar";

const TimesheetAdminList = ({ employeeId, status }) => {
    const { APIPath } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(false);
    const [itemCount, setItemCount] = useState(0);
    const [jobsCount, setJobsCount] = useState(0);

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
        // console.log("SubmittedList: useEffect: employeeId: " + employeeId);
        delaydMockLoading();
    }, [employeeId]);

    function manualLoadData() {
        setApiLoading(true);
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
        setItemCount(0);
        setJobsCount(0);
        let apiUrl = APIPath + "/getsubmittedtimesheets/" + employeeId;
        if (status === "Submitted") {
            apiUrl = APIPath + "/getsubmittedtimesheets/" + employeeId;
        }
        else if (status === "Approved") {
            apiUrl = APIPath + "/getapprovedtimesheets/" + employeeId;
        }
        else if (status === "SentBack") {
            apiUrl = APIPath + "/getsentbacktimesheets/" + employeeId;
        }
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                (result) => {
                    //// console.log(result);
                    if (result.error) {
                        // console.log("RequestData:On error return: setting empty")
                        setData({});
                        setItemCount(0);
                    }
                    else {
                        if (result.STATUS === "FAIL") {
                            showSnackbar('error', result.ERROR.MESSAGE);
                            setItemCount(0);
                            setJobsCount(0);
                        }
                        else {
                            setData(result);
                            setItemCount(result.total);
                            const uniqueJobIds = new Set(result.data.map(item => item.jobID));
                            setJobsCount(uniqueJobIds.size);
                            showSnackbar('success', status + " Timesheets Data fetched");
                        }
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    setItemCount(0);
                    setJobsCount(0);
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }

    const CustomDetailsComponent = (props) => {
        return (
            <>
                <GenericDetails ID={props.data.Id}
                    operation="View"
                    doLoading={false}
                    moduleName="MY_TIMESHEETS"
                    timesheetNumber={props.data.timesheetNumber}
                    mode={props.data.status}
                    manualLoadData={manualLoadData}
                    setApiLoading={setApiLoading}
                    showSnackbar={showSnackbar}
                    employeeID={props.data.employeeID}
                    startDate={props.data.startDate}
                    endDate={props.data.endDate}
                    jobName={props.data.jobName}
                    personalEmail={props.data.personalEmail}
                    applicationEmail={props.data.applicationEmail}
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
                className += ' rag-red-bg';
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
    const CustomHoursRenderer = ({ value }) => (
        <span className='rag-gray-bg badgeSpan'>
            {value}
        </span>
    );
    const CustomStatusRenderer = ({ value }) => {
        let className = 'badgeSpan';
        switch (value) {
            case 'Approved':
                className += ' rag-green-bg';
                break;
            case 'Rejected':
                className += ' rag-red-bg';
                break;
            case 'SentBack':
                className += ' rag-red-bg';
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
    const CustomEditComponent = (props) => {
        return (
            <>
                <TimesheetAction ID={props.data.Id}
                    timesheetNumber={props.data.timesheetNumber}
                    mode={props.data.status} 
                    operation="Edit"
                    manualLoadData={manualLoadData}
                    setApiLoading={setApiLoading}
                    showSnackbar={showSnackbar}
                    employeeID={props.data.employeeID}
                    startDate={props.data.startDate}
                    endDate={props.data.endDate}
                    jobName={props.data.jobName}
                    personalEmail={props.data.personalEmail}
                    applicationEmail={props.data.applicationEmail}
                />
            </>
        );
    };
    const CustomAuditComponent = (props) => {
        return (
            <>
                <TimesheetAudit ID={props.data.Id} timesheetNumber={props.data.timesheetNumber} operation="View" doLoading={true} />
            </>
        );
    };
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs] = useState([
        { field: "Id", maxWidth: 50 },
        { field: "employeeID", maxWidth: 50 },
        { field: "timesheetNumber", filter: true },
        { field: "jobTitle", filter: true },
        { field: "jobType", headerName: 'Timesheet Frequency', filter: true, cellRenderer: CustomJobTypeRenderer },
        { field: "clientName", filter: true },
        { field: "createdDate", headerName: 'Submitted Date', filter: true },
        { field: "startDate", filter: true },
        { field: "endDate", filter: true },
        { field: "hours", filter: true, cellRenderer: CustomHoursRenderer },
        {
            field: "status", filter: true,
            cellRenderer: CustomStatusRenderer
        },
        {
            field: "VIEW", cellRenderer: CustomDetailsComponent, maxWidth: 90, resizable: true
        },
        { field: "HISORY", cellRenderer: CustomAuditComponent, maxWidth: 100, resizable: false },
        { field: "ACTIONS", cellRenderer: CustomEditComponent, maxWidth: 110, resizable: false }
    ]);
    const rowClassRules = {
        // apply red to Ford cars
        //'rag-red': params => params.data.firstName === "anand",
    };
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [5, 10, 20, 50];
    const autoSizeStrategy = {
        type: 'fitGridWidth',
        defaultMinWidth: 50
    };

    return (
        <>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <div className="w-full flex bg-kmcBG bg-gray-200 rounded-md text-sm justify-between place-items-center space-x-2 py-2 px-2 ">
                <PendingListToolbar
                    operation={status}
                    jobsCount={null}
                    itemCount={itemCount}
                    apiLoading={apiLoading}
                    dataAPIError={''}
                    manualLoadData={manualLoadData}
                />

                {/* <div className="flex flex-grow-0 bg-gray-500 text-white text-sm py-2 px-3">
                    <span className="">Total {status} Timesheets:</span>
                    <span className="font-bold text-sm ml-2">{itemCount}</span>
                </div>
                <div className="">
                    <Button size="small" variant="contained"
                        onClick={manualLoadData}
                        disabled={apiLoading}
                    >
                        {apiLoading ? <div className="spinner"></div> :
                            <>
                                <CachedIcon className="mr-1" />
                                Refresh now
                            </>}

                    </Button>
                </div> */}
            </div>
            <div className="flex flex-grow flex-1 rounded-md text-sm justify-between place-items-center space-x-2 ">
                {data.data && data.data.length > 0 ? (
                    <div
                        className="ag-theme-quartz" // applying the Data Grid theme
                        style={{ height: 500, width: '100%' }} // the Data Grid will fill the size of the parent container
                    >
                        <AgGridReact
                            rowData={data.data}
                            columnDefs={colDefs}
                            pagination={pagination}
                            paginationPageSize={paginationPageSize}
                            paginationPageSizeSelector={paginationPageSizeSelector}
                            rowClassRules={rowClassRules}
                            autoSizeStrategy={autoSizeStrategy}
                        />
                    </div>
                ) : (
                    <p>No {status} timesheets</p>
                )}
            </div>
        </>
    );
};

export default TimesheetAdminList;
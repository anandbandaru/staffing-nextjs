import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import CustomSnackbar from "../snackbar/snackbar";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import PendingListToolbar from "../timesheetentry/pendingListToolbar";
import TimesheetEditReminders from "./timesheetEditReminders";

const TimesheetRemindersList = () => {
    const { APIPath } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(false);
    const [itemCount, setItemCount] = useState(0);
    const [jobsCount, setJobsCount] = useState(0);
    const [employeesCount, setEmployeesCount] = useState(0);

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
        setEmployeesCount(0);
        let apiUrl = APIPath + "/getallpendingtimesheets";
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
                        setJobsCount(0);
                        setEmployeesCount(0);
                    }
                    else {
                        if (result.STATUS === "FAIL") {
                            showSnackbar('error', result.ERROR.MESSAGE);
                            setItemCount(0);
                            setJobsCount(0);
                            setEmployeesCount(0);
                        }
                        else {
                            setData(result);
                            setItemCount(result.total);
                            const uniqueJobIds = new Set(result.data.map(item => item.jobID));
                            setJobsCount(uniqueJobIds.size);
                            const uniqueEmployeeIds = new Set(result.data.map(item => item.employeeID));
                            setEmployeesCount(uniqueEmployeeIds.size);
                            showSnackbar('success', " Timesheets Data fetched");
                        }
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    setItemCount(0);
                    setJobsCount(0);
                    setEmployeesCount(0);
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }

    const CustomJobTypeRenderer = ({ value }) => (
        <span className='rag-blue-bg badgeSpan'>
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
                className += ' rag-yellow-bg';
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
                {/* <TimesheetEdit ID={props.data.Id} timesheetNumber={props.data.timesheetNumber} mode={props.data.status} operation="Edit" manualLoadData={manualLoadData} setApiLoading={setApiLoading} showSnackbar={showSnackbar} /> */}
                <TimesheetEditReminders 
                employeeID={props.data.employeeID} 
                startDate={props.data.startDate} 
                endDate={props.data.endDate} 
                jobName={props.data.jobName} 
                personalEmail={props.data.personalEmail} 
                applicationEmail={props.data.applicationEmail} 
                timesheetNumber={props.data.timesheetNumber} 
                manualLoadData={manualLoadData} showSnackbar={showSnackbar} />
            </>
        );
    };
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs] = useState([
        { field: "employee", filter: true  },
        { field: "timesheetNumber", filter: true },
        { field: "jobTitle", filter: true },
        { field: "jobType", headerName: 'Timesheet Frequency', filter: true, cellRenderer: CustomJobTypeRenderer },
        { field: "clientName", filter: true },
        { field: "daysPending", filter: true },
        { field: "startDate", filter: true },
        { field: "endDate", filter: true },
        { field: "jobStartDate", filter: true },
        { field: "jobEndDate", filter: true },
        {
            field: "status", filter: true,
            cellRenderer: CustomStatusRenderer
        },
        { field: "ACTIONS", cellRenderer: CustomEditComponent, maxWidth: 110, resizable: false, pinned: 'right', cellStyle: { backgroundColor: '#b7bfcf' }  }
    ]);
    const rowClassRules = {
        // apply red to Ford cars
        //'rag-red': params => params.data.firstName === "anand",
    };
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [5, 10, 20, 50];
    const autoSizeStrategy = {
        //type: 'fitGridWidth',
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
                    jobsCount={jobsCount}
                    itemCount={itemCount}
                    apiLoading={apiLoading}
                    dataAPIError={""}
                    manualLoadData={manualLoadData}
                    employeesCount={employeesCount}
                />
                {/* <div className="flex flex-grow-0 bg-gray-500 text-white text-sm py-2 px-3">
                    <span className="">Total Timesheets:</span>
                    <span className="font-bold text-sm ml-2">{itemCount}</span>
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
                    <p>No timesheets</p>
                )}
            </div>
        </>
    );
};

export default TimesheetRemindersList;

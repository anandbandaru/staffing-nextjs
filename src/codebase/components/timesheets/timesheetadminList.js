import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import CustomSnackbar from "../snackbar/snackbar";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import GenericDetails from "../forms/GenericDetails";
import TimesheetAction from "./timesheetAction";
import TimesheetAudit from "./timesheetAudit";
import PendingListToolbar from "../timesheetentry/pendingListToolbar";
import TextField from '@mui/material/TextField';
import {Autocomplete} from '@mui/material';

const TimesheetAdminList = ({ employeeId, status, employeesData }) => {
    const { APIPath } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(false);
    const [itemCount, setItemCount] = useState(0);
    const [jobsCount, setJobsCount] = useState(0);

    const [employeeIdL, setEmployeeIdL] = useState('');
    const handleEmployeeIdChange = (event) => {
        setEmployeeIdL(event.target.value);
    };

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
    }, [employeeId, employeeIdL, status]);

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
        console.log("getList: employeeId: " + employeeId);
        console.log("getList: employeeIdL: " + employeeIdL);

        let apiUrl = APIPath + "/getsubmittedtimesheets/" + employeeId;
        if (status === "Submitted") {
            apiUrl = APIPath + "/getsubmittedtimesheets/" + employeeIdL;
            if (employeeIdL === "" || employeeIdL === null || employeeIdL === undefined) {
                apiUrl = APIPath + "/getallsubmittedtimesheets";
            }
            console.log("Submitted: Final path: " + apiUrl);
        }
        else if (status === "Approved") {
            apiUrl = APIPath + "/getapprovedtimesheets/" + employeeId;
            if (employeeId === "" || employeeId === null || employeeId === undefined) {
                apiUrl = APIPath + "/getallapprovedtimesheets";
            }
            console.log("Approved: Final path: " + apiUrl);
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
                    viewType={"POP"}
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
        { field: "employeeID", filter: true },
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
            field: "VIEW", cellRenderer: CustomDetailsComponent, maxWidth: 70, resizable: false, pinned: 'right', cellStyle: { backgroundColor: '#b7bfcf' }
        },
        { field: "HISORY", cellRenderer: CustomAuditComponent, maxWidth: 70, resizable: false, pinned: 'right', cellStyle: { backgroundColor: '#b7bfcf' } },
        { field: "ACTIONS", cellRenderer: CustomEditComponent, maxWidth: 80, resizable: false, pinned: 'right', cellStyle: { backgroundColor: '#b7bfcf' } }
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
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            {status === "Submitted" && (
                <>
                    
                    <Autocomplete
                        options={employeesData.data}
                        getOptionLabel={(option) => `Employee ID: ${option.Id} - ${option.firstName} ${option.lastName} - (${option.employeeType})`}
                        //  - (Personal Email: ${option.personalEmail}) - (US Phone: ${option.personalUSPhone}) - (Personal Phone: ${option.personalPhone})`}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                margin="normal"
                                fullWidth
                                label="Employee Id"
                                className="bg-yellow-400"
                            />
                        )}
                        value={employeesData.data.find((item) => item.Id === employeeIdL) || null}
                        onChange={(event, newValue) => {
                            handleEmployeeIdChange({ target: { value: newValue ? newValue.Id : '' } });
                        }}
                    />

                    {/* <TextField
                        size="small"
                        margin="normal"
                        fullWidth
                        id="employeeId"
                        name="employeeId"
                        select
                        label="Employee Id"
                        value={employeeIdL}
                        className="bg-yellow-400"
                        onChange={(event) => {
                            handleEmployeeIdChange(event);
                        }}
                    >
                        {employeesData.data.map((item, index) => (
                            <MenuItem key={index} value={item.Id}>
                                <div>
                                    Employee ID: {item.Id} - {item.firstName} {item.lastName} - ({item.employeeType}) - (Personal Email: {item.personalEmail}) - (US Phone: {item.personalUSPhone}) - (Personal Phone: {item.personalPhone})
                                </div>
                            </MenuItem>
                        ))}
                    </TextField> */}
                </>

            )}

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
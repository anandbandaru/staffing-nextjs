import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import PendingListToolbar from './pendingListToolbar';
import CustomSnackbar from "../snackbar/snackbar";
import { Alert } from "@mui/material";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const TimesheetCapturedHours = ({ timesheetId }) => {
    const { APIPath } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(false);
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
        console.log("TimesheetCapturedHours: useEffect: timesheetId: " + timesheetId);
        delaydMockLoading();
    }, [timesheetId]);

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
        let apiUrl = APIPath + "/gettimesheethours/" + timesheetId;
        fetch(apiUrl)
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
                        setDataAPIError(result.STATUS === "FAIL" ? "API Error" : "");
                        if (result.STATUS === "FAIL") {
                            showSnackbar('error', result.ERROR.MESSAGE);
                            setItemCount(0);
                        }
                        else {
                            setData(result);
                            setItemCount(result.total);
                            showSnackbar('success', "Captured Hours Data fetched");
                        }
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setDataAPIError(error.toString());
                    setData({});
                    setItemCount(0);
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    
    const getDayOfWeek = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date(date).getDay()];
    };

    const CustomJobTypeRenderer = ({ value }) => (
        <span className='rag-blue-bg badgeSpan'>
            {value}
        </span>
    );
    const CustomDayRenderer = ({ value }) => {
        const dayOfWeek = getDayOfWeek(value);
        const isWeekend = dayOfWeek === 'Sunday' || dayOfWeek === 'Saturday';
        const className = isWeekend ? 'weekendDay' : 'weekDay';
    
        return (
            <span className={`${className} badgeSpan`}>
                {dayOfWeek} - {value}
            </span>
        );
    };
    
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs] = useState([
        { field: "Id", maxWidth: 50 },
        { field: "timesheetId", headerName: 'Entry ID', maxWidth: 80 },
        { field: "timesheetNumber", headerName: 'Timesheet ID' },
        { field: "jobType", headerName: 'Timesheet Frequency', cellRenderer: CustomJobTypeRenderer },
        { field: "day", filter: true, cellRenderer: CustomDayRenderer },
        {
            field: "hours", maxWidth: 80,
            cellClassRules: {
                'correctHoursText': params => params.value === 8,
                'lessHoursText': params => params.value !== 8,
                'moreHoursText': params => params.value > 8,
            }
        },
        { field: "createdDate", maxWidth: 100 },
        { field: "createdBy" },
        { field: "modifiedDate" },
        { field: "modifiedBy" },
    ]);
    const rowClassRules = {
        // apply red to Ford cars
        //'rag-red': params => params.data.firstName === "anand",
    };
    const pagination = true;
    const paginationPageSize = 20;
    const paginationPageSizeSelector = [20, 30, 50];
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
                    <p>No captured hours</p>
                )}
            </div>
        </>
    );
};

export default TimesheetCapturedHours;
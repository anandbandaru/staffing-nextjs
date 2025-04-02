import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import CustomSnackbar from "../snackbar/snackbar";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button } from "@mui/material";

const TimesheetCapturedDayHours = ({ timesheetNumber }) => {
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

    // useEffect(() => {
    //     delaydMockLoading();
    // }, [timesheetNumber]);

    const getList = () => {
        setData({ data: [] });
        setItemCount(0);
        let apiUrl = APIPath + "/gethoursbytimesheetnumber/" + timesheetNumber;
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
                        setDataAPIError(result.STATUS === "FAIL" ? "API Error" : "");
                        if (result.STATUS === "FAIL") {
                            showSnackbar('error', result.ERROR.MESSAGE);
                            setItemCount(0);
                        }
                        else {
                            setData(result);
                            setItemCount(result.total);
                            if(result.total === 0)
                            {
                                setDataAPIError("No hours captured")
                            }
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
        { field: "timesheetNumber", headerName: 'Timesheet ID' },
        { field: "day", filter: true, cellRenderer: CustomDayRenderer },
        {
            field: "hours", maxWidth: 80,
            cellClassRules: {
                'correctHoursText': params => params.value === 8,
                'lessHoursText': params => params.value !== 8,
                'moreHoursText': params => params.value > 8,
            }
        },
    ]);
    const rowClassRules = {
        // apply red to Ford cars
        //'rag-red': params => params.data.firstName === "anand",
    };
    const pagination = true;
    const paginationPageSize = 7;
    const paginationPageSizeSelector = [7, 20, 50];
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
            <Button onClick={getList}>
                Load Date wise Hours
            </Button>
            <div className="flex flex-grow flex-1 rounded-md text-sm justify-between place-items-center space-x-2 ">
                {data.data && data.data.length > 0 ? (
                    <div
                        className="ag-theme-quartz" // applying the Data Grid theme
                        style={{ height: 340, width: '100%' }} // the Data Grid will fill the size of the parent container
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
                    <p>{dataAPIError}</p>
                )}
            </div>
        </>
    );
};

export default TimesheetCapturedDayHours;
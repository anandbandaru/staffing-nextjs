import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import PendingListToolbar from './pendingListToolbar';
import CustomSnackbar from "../snackbar/snackbar";
import TimesheetEntryForm from './timesheetentryForm';
import { Stack } from "@mui/material";

const PendingList = ({ employeeId }) => {
    const { APIPath } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");
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
        console.log("PendingList: useEffect: employeeId: " + employeeId);
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
            getTimesheets();
        }, 1);
    }

    const getTimesheets = () => {
        setData({ data: [] });
        setItemCount(0);
        setJobsCount(0);
        let apiUrl = APIPath + "/getmypendingtimesheets/" + employeeId;
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        setData({});
                        setItemCount(0);
                        setJobsCount(0);
                    } else {
                        setData(result);
                        setItemCount(result.total);
                        setDataAPIError(result.STATUS === "FAIL" ? "API Error" : "");
                        if (result.STATUS === "FAIL") {
                            showSnackbar('error', result.ERROR.MESSAGE);
                        } else {
                            showSnackbar('success', "Pending Timesheets Data fetched");
                            const uniqueJobIds = new Set(result.data.map(item => item.jobID));
                            setJobsCount(uniqueJobIds.size);
                        }
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setDataAPIError(error.toString());
                    setData({});
                    setItemCount(0);
                    setJobsCount(0);
                    setApiLoading(false);
                }
            );
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
                    operation="Add"
                    jobsCount={jobsCount}
                    itemCount={itemCount}
                    apiLoading={apiLoading}
                    dataAPIError={dataAPIError}
                    manualLoadData={manualLoadData}
                />
            </div>

            <div className="flex flex-1 rounded-md text-sm justify-between place-items-center space-x-2 py-2 px-2 ">
                {data.data.length > 0 ? (
                    <>
                        <Stack direction="column" spacing={1} className="m-auto">
                            <TimesheetEntryForm data={data.data} onFormSubmitSuccess={getTimesheets} />
                        </Stack>
                    </>
                ) : (
                    <p>No pending timesheets</p>
                )}
            </div>
        </>
    );
};

export default PendingList;
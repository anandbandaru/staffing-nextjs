import React, { useState, useEffect, useContext } from "react";
import './timesheetentryMain.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Box from '@mui/material/Box';
import PendingList from './pendingList';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { Context } from "../../context/context";
import CustomSnackbar from "../snackbar/snackbar";
import { Alert } from "@mui/material";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import SubmittedList from "./submittedList";

const TimeSheetsMain = () => {
    const { APIPath, userEmployeeId, setUserEmployeeId, userName, userType } = useContext(Context);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [apiLoading, setApiLoading] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");

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

    const getemployeeidbyapplicationemail = () => {
        setUserEmployeeId(0);
        let apiUrl = APIPath + "/getemployeeidbyapplicationemail/" + userName;
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        setUserEmployeeId(0);
                    }
                    else {
                        setDataAPIError(result.STATUS === "FAIL" ? "API Error" : "");
                        if (result.STATUS === "FAIL") {
                            showSnackbar('error', result.ERROR.MESSAGE);
                            setUserEmployeeId(0);
                        }
                        else if (result.data !== "") {
                            setUserEmployeeId(result.data.employeeId);
                            showSnackbar('success', "Employee ID fetched");
                            // console.log("Employee ID fetched: " + result.data.employeeId);
                        }
                        else {
                            // console.log("Non employee");
                            setUserEmployeeId(0);
                        }
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setDataAPIError(error.toString());
                    setUserEmployeeId(0);
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }

    useEffect(() => {
        getemployeeidbyapplicationemail();
    }, []);

    return (
        <>

            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />

            <div className="timeSheetMainHolder">
                <div className="subTabsHolder">
                    <Tabs selectedIndex={tabIndex}
                        onSelect={(index) => setTabIndex(index)}>
                        <TabList className="subTabsListHolder">
                            <Tab><TimerOutlinedIcon className="mr-1" />My Pending Timesheets</Tab>
                            <Tab><CheckOutlinedIcon className="mr-1" />My Submitted Timesheets</Tab>
                            <Tab><CheckCircleOutlinedIcon className="mr-1" />My Approved Timesheets</Tab>
                        </TabList>

                        <TabPanel className="px-0">
                            {userEmployeeId !== 0 ?
                                <>
                                    <PendingList employeeId={userEmployeeId} />
                                </>
                                :
                                <>
                                    <Alert severity="warning">You are not tagged as EMPLOYEE & do not have Employee ID in the system</Alert>
                                </>
                            }
                        </TabPanel>
                        <TabPanel className="px-2">
                            {userEmployeeId !== 0 ?
                                <>
                                    <SubmittedList employeeId={userEmployeeId} />
                                </>
                                :
                                <>
                                    <Alert severity="warning">You are not tagged as EMPLOYEE & do not have Employee ID in the system</Alert>
                                </>
                            }
                        </TabPanel>
                        <TabPanel className="px-2">
                            My Approved Timesheets
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        </>
    )
}

export default TimeSheetsMain;
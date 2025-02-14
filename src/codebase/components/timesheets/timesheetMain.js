import React, { useState, useEffect, useContext } from "react";
import './timesheetMain.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { Context } from "../../context/context";
import { Alert } from "@mui/material";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import TimesheetAdminList from "./timesheetadminList";
import PendingList from "../timesheetentry/pendingList";

const TimeSheetsMain = () => {
    const { APIPath } = useContext(Context);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [apiLoading, setApiLoading] = useState(false);
    const [employeesData, setEmployeesData] = useState({ data: [] });
    const [employeeId, setEmployeeId] = useState('');

    const getEmployeesList = async () => {
        setApiLoading(true);
        setEmployeesData({ data: [] });
        let apiUrl = APIPath + "/getemployees"
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        // console.log("RequestData:On error return: setting empty")
                        setEmployeesData({ data: [] });
                    }
                    else {
                        setEmployeesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setEmployeesData({ data: [] });
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleEmployeeIdChange = (event) => {
        setEmployeeId(event.target.value);
    };

    useEffect(() => {
        getEmployeesList();
    }, []);

    return (
        <>
            <div className="timeSheetMainHolder">
                <TextField
                    size="small"
                    margin="normal"
                    fullWidth
                    id="employeeId"
                    name="employeeId"
                    select
                    label="Employee Id"
                    value={employeeId}
                    className="bg-yellow-400"
                    onChange={(event) => {
                        handleEmployeeIdChange(event);
                    }}
                >
                    {employeesData.data.map((item, index) => (
                        <MenuItem key={index} value={item.Id}>
                            {/* <div className="divTSEmplyeeHolder1"> */}
                                <div>
                                    Employee ID: {item.Id}
                                </div>
                                <div>
                                    {item.firstName} {item.lastName}
                                </div>
                                <div>
                                    ({item.employeeType})
                                </div>
                                <div>
                                    (Personal Email: {item.personalEmail}) - (US Phone: {item.personalUSPhone}) - (Personal Phone: {item.personalPhone})
                                </div>
                            {/* </div> */}
                        </MenuItem>
                    ))}
                </TextField>

                <Tabs selectedIndex={tabIndex}
                    onSelect={(index) => setTabIndex(index)}>
                    <TabList className="subTabsListHolder">
                        <Tab><TimerOutlinedIcon className="mr-1" />Yet to Submit Timesheets</Tab>
                        <Tab><CheckOutlinedIcon className="mr-1" />Sent Back Timesheets</Tab>
                        <Tab><CheckOutlinedIcon className="mr-1" />Pending Approval Timesheets</Tab>
                        <Tab><CheckCircleOutlinedIcon className="mr-1" />Approved Timesheets</Tab>
                    </TabList>

                    <TabPanel className="px-2">
                        <Alert severity="info" className="my-1">This tab displays all the <strong>Pending</strong> timesheets.</Alert>
                        {employeeId && (
                            <PendingList employeeId={employeeId} mode="View" />
                        )}
                    </TabPanel>
                    <TabPanel className="px-2">
                        <Alert severity="info" className="my-1">This tab displays all the <strong>Sent Back</strong> timesheets.</Alert>
                        {employeeId && (
                            <TimesheetAdminList employeeId={employeeId} status="SentBack" />
                        )}
                    </TabPanel>
                    <TabPanel className="px-2">
                        <Alert severity="info" className="my-1">This tab displays all the <strong>Pending Approval</strong> timesheets.</Alert>
                        {employeeId && (
                            <TimesheetAdminList employeeId={employeeId} status="Submitted" />
                        )}
                    </TabPanel>
                    <TabPanel className="px-0">
                        <Alert severity="info" className="my-1">This tab displays all the <strong>Approved</strong> timesheets.</Alert>
                        {employeeId && (
                            <TimesheetAdminList employeeId={employeeId} status="Approved" />
                        )}
                    </TabPanel>
                </Tabs>
            </div>
        </>
    )
}

export default TimeSheetsMain;
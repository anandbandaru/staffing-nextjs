import React, { useState, useEffect, useContext } from "react";
import './timesheetMain.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { Context } from "../../context/context";
import { Alert, Stack } from "@mui/material";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import TimesheetAdminList from "./timesheetadminList";
import PendingList from "../timesheetentry/pendingList";
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import ReplyAllOutlinedIcon from '@mui/icons-material/ReplyAllOutlined';
import TimesheetRemindersList from "./timesheetRemindersList";
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { Autocomplete } from '@mui/material';

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

    // BURGER MENU
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTabDD, setSelectedTabDD] = useState(0);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (tabIndex) => {
        setAnchorEl(null);
        if (tabIndex !== undefined) {
            setSelectedTabDD(tabIndex);
        }
    };

    const allTabs = [
        { name: 'Yet to Submit', icon: <TimerOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Reminders', icon: <NotificationAddIcon className="mr-1" fontSize="small" /> },
        { name: 'Sent Back', icon: <ReplyAllOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Pending Approval', icon: <CheckOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Approved', icon: <CheckCircleOutlinedIcon className="mr-1" fontSize="small" /> }
    ];

    return (
        <>
            <div className="timeSheetMainHolder pt-5">

                <Tabs selectedIndex={selectedTabDD}
                    onSelect={(index) => setSelectedTabDD(index)}>
                    <TabList className="top2TabsListHolder">
                        <span className="top2TabsMenu bg-top2Tab pb-2 pt-1 text-white">
                            <IconButton
                                size="small"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleMenuClick}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => handleMenuClose()}
                            >
                                {allTabs.map((tab, index) => (
                                    <MenuItem key={tab.name} onClick={() => handleMenuClose(index)}>
                                        {tab.icon}{tab.name}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </span>
                        {allTabs.map(tab => (
                            <Tab key={tab.name}>{tab.icon}{tab.name}</Tab>
                        ))}
                    </TabList>

                    <TabPanel className="px-0">
                        <Alert severity="info" className="my-0">This tab displays all the <strong>Pending</strong> timesheets.</Alert>
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
                            value={employeesData.data.find((item) => item.Id === employeeId) || null}
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
                            value={employeeId}
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
                        {employeeId && (
                            <PendingList employeeId={employeeId} mode="View" />
                        )}
                    </TabPanel>
                    <TabPanel className="px-0">
                        <Alert severity="info" className="my-0">This tab displays all the <strong>Pending</strong> timesheets for which you can send reminders.</Alert>
                        <TimesheetRemindersList />
                    </TabPanel>
                    <TabPanel className="px-0">
                        <Alert severity="info" className="my-0">This tab displays all the <strong>Sent Back</strong> timesheets.</Alert>
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
                            value={employeesData.data.find((item) => item.Id === employeeId) || null}
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
                            value={employeeId}
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
                        {employeeId && (
                            <TimesheetAdminList employeeId={employeeId} status="SentBack" />
                        )}
                    </TabPanel>
                    <TabPanel className="px-0">
                        <Alert severity="info" className="my-0">This tab displays all the <strong>Pending Approval</strong> timesheets.</Alert>

                        <TimesheetAdminList status="Submitted" employeesData={employeesData} />
                        {/* {employeeId && (
                            <TimesheetAdminList employeeId={employeeId} status="Submitted" />
                        )} */}
                    </TabPanel>
                    <TabPanel className="px-0">
                        <Alert severity="info" className="my-0">This tab displays all the <strong>Approved</strong> timesheets.</Alert>
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
                            value={employeesData.data.find((item) => item.Id === employeeId) || null}
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
                            value={employeeId}
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
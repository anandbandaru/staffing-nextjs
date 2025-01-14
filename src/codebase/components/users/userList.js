import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import UsersListToolbar from "./usersListToolbar";
import axios from "axios";
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AttributionOutlinedIcon from '@mui/icons-material/AttributionOutlined';
import { Stack, Card, CardContent, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, Chip } from "@mui/material";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import InfoIcon from '@mui/icons-material/Info';
import UserTopPermissions from "./userTopPermissions";
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import UserNewPermissions from "./userNewPermissions";
import UserTransactionsPermissions from "./userTransactionsPermissions";

const UserList = () => {
    const { accessToken, APIPath } = useContext(Context);
    const [data, setData] = useState(null);
    const [apiLoading, setApiLoading] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");
    const [itemCount, setItemCount] = useState(0);
    const [loginDetails, setLoginDetails] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    function manualLoadData() {
        setApiLoading(true);
        delaydMockLoading();
    }

    function delaydMockLoading() {
        setApiLoading(true);
        setItemCount(0);
        setDataAPIError("");
        setTimeout(() => {
            fetchUsers();
        }, 1);
    }

    const fetchUsers = async () => {
        setApiLoading(true);
        try {
            const response = await axios.get("https://graph.microsoft.com/v1.0/users", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const users = response.data.value;
            setUsers(users);
            setItemCount(users.length);
            setDataAPIError("");
            setApiLoading(false);
            fetchLoginDetailsForUsers(users);
        } catch (error) {
            setDataAPIError(error.toString());
            console.log("fetchUsers:ERROR:" + error);
            setItemCount(0);
            setApiLoading(false);
            setData([]);
        }
    };

    const fetchLoginDetails = async (userName) => {
        try {
            console.log(userName)
            const response = await axios.get(APIPath + "/getlogindetails/" + userName);
            setLoginDetails(response.data.data[0]);
            setDialogOpen(true);
        } catch (error) {
            console.log("ERROR: fetching login details:", error);
        }
    };
    const fetchLoginDetailsForUsers = async (users) => {
        const updatedUsers = await Promise.all(users.map(async (user) => {
            try {
                const response = await axios.get(APIPath + `/getlogindetails/${user.userPrincipalName.replace('_outlook.com', '@outlook.com')}`);
                if (response.data.data[0] && response.data.data[0].loginCount !== undefined && response.data.data[0].lastLoginDate !== undefined) {
                    return { ...user, loginCount: response.data.data[0].loginCount, lastLoginDate: response.data.data[0].lastLoginDate };
                } else {
                    return { ...user, loginCount: 'N/A', lastLoginDate: 'N/A' };
                }
            } catch (error) {
                console.error("Error fetching login details:", error);
                return { ...user, loginCount: 'N/A', lastLoginDate: 'N/A' };
            }
        }));
        setData(updatedUsers);
    };

    const iconMap = {
        ADMIN: <AdminPanelSettingsOutlinedIcon />,
        COHOST: <SupervisedUserCircleOutlinedIcon />,
        OPERATOR: <PersonOutlinedIcon />,
        DEFAULT: <AttributionOutlinedIcon />,
    };
    const classMap = {
        ADMIN: 'rag-green-bg badgeSpan',
        COHOST: 'rag-red-bg badgeSpan',
        OPERATOR: 'rag-blue-bg badgeSpan',
        DEFAULT: 'rag-gray-bg badgeSpan',
    };
    const CustomJobTitleRenderer = ({ value }) => (
        <div>
            {iconMap[value] || iconMap.DEFAULT}
            <span className={classMap[value] || classMap.DEFAULT}>
                {value}
            </span>
        </div>
    );
    const CustomActionRenderer = ({ data }) => (
        <IconButton onClick={() => fetchLoginDetails(data.userPrincipalName.replace('_outlook.com', '@outlook.com'))}>
            <InfoIcon />
        </IconButton>
    );
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs] = useState([
        { field: "givenName", filter: true },
        { field: "surname", filter: true },
        {
            field: "jobTitle",
            cellRenderer: CustomJobTitleRenderer
        },
        { field: "userPrincipalName" },
        { field: "mail", filter: true },
        { field: "mobilePhone", filter: true },
        { field: "loginCount", headerName: "Login Count", maxWidth: 100 },
        { field: "lastLoginDate", headerName: "Last Login Date" },
        {
            headerName: "Actions",
            field: "actions",
            cellRenderer: CustomActionRenderer,
            sortable: false,
            filter: false, maxWidth: 100, resizable: false
        }
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
            <div className="w-full flex bg-kmcBG dark:bg-gray-700 text-sm justify-between place-items-center space-x-2 py-2 px-2 ">
                {/* TOOLS */}
                <UsersListToolbar
                    operation="Add"
                    itemCount={itemCount}
                    apiLoading={apiLoading}
                    dataAPIError={dataAPIError}
                    manualLoadData={manualLoadData} />
                {/* TOOLS */}
            </div>

            <Stack direction={"row"} spacing={2} className="w-full py-4">
                <Card sx={{ maxWidth: 275 }}>
                    <CardContent>
                        <Chip label="ADMIN" className="rag-green-bg text-white w-full" />
                        <div className="mt-4">
                            Can:
                            <ul>
                                <li><KeyboardArrowRightOutlinedIcon fontSize="small" />view all components of the application.</li>
                                <li><KeyboardArrowRightOutlinedIcon fontSize="small" />Access Azure using Admin account</li>
                                <li><KeyboardArrowRightOutlinedIcon fontSize="small" />Access Calendar using Admin account</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
                <Card sx={{ maxWidth: 275 }}>
                    <CardContent>
                        <Chip label="OPERATOR" className="rag-blue-bg text-white w-full" />
                        <div className="mt-4">
                            Can only look at:
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ul>
                                    <li><ArrowForwardOutlinedIcon fontSize="small" />Dashboard
                                        <ul className="ml-4">
                                            <li><KeyboardArrowRightOutlinedIcon fontSize="small" />Employees</li>
                                            <li><KeyboardArrowRightOutlinedIcon fontSize="small" />Vendors</li>
                                            <li><KeyboardArrowRightOutlinedIcon fontSize="small" />Clients</li>
                                            <li><KeyboardArrowRightOutlinedIcon fontSize="small" />Imp Partners</li>
                                            <li><KeyboardArrowRightOutlinedIcon fontSize="small" />Job Types</li>
                                            <li><KeyboardArrowRightOutlinedIcon fontSize="small" />Expense Types</li>
                                            <li><KeyboardArrowRightOutlinedIcon fontSize="small" />File Types</li>
                                        </ul>
                                    </li>
                                    <li><ArrowForwardOutlinedIcon fontSize="small" />Transactions
                                        <ul className="ml-4">
                                            <li><KeyboardArrowRightOutlinedIcon fontSize="small" />Jobs</li>
                                        </ul>
                                    </li>
                                </ul>
                                <ul>
                                    <li><ArrowForwardOutlinedIcon fontSize="small" />Files</li>
                                    <li><ArrowForwardOutlinedIcon fontSize="small" />Todo</li>
                                    <li><ArrowForwardOutlinedIcon fontSize="small" />Calendar</li>
                                    <li><ArrowForwardOutlinedIcon fontSize="small" />Todo Sidebar</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card sx={{ maxWidth: 275 }}>
                    <CardContent >
                        <Chip label="COHOST" className="rag-red-bg text-white w-full" />
                        <div className="mt-4">
                            Yet to define permissions
                        </div>
                    </CardContent>
                </Card>
            </Stack>

            <Stack direction={"row"} spacing={2} className="mt-0 w-full">
                <div className="flex-1">
                    <UserTopPermissions users={users} />
                </div>
                <div className="flex-1">
                    <UserNewPermissions users={users} />
                </div>
                <div className="flex-1">
                    <UserTransactionsPermissions users={users} />
                </div>
            </Stack>

            <div
                className="ag-theme-quartz" // applying the Data Grid theme
                style={{ height: 400 }} // the Data Grid will fill the size of the parent container
            >
                <AgGridReact
                    rowData={data ? data : []}
                    columnDefs={colDefs}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    rowClassRules={rowClassRules}
                    autoSizeStrategy={autoSizeStrategy}
                    enableCellTextSelection={true}
                />
            </div>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Login Details</DialogTitle>
                <DialogContent>
                    <DialogContentText><strong>Login Count:</strong> {loginDetails ? loginDetails.loginCount : ''}<br />
                        <strong>Last Login Date:</strong> {loginDetails ? loginDetails.lastLoginDate : ''}
                    </DialogContentText>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default UserList;
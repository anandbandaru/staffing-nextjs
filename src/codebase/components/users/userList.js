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
import { Stack, IconButton, Dialog, DialogTitle, DialogContent } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import UserTopPermissions from "./userTopPermissions";
import UserNewPermissions from "./userNewPermissions";
import UserTransactionsPermissions from "./userTransactionsPermissions";
import CustomSnackbar from "../snackbar/snackbar";
import { Button, Link } from '@mui/material';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const UserList = () => {
    const { accessToken, APIPath } = useContext(Context);
    const [data, setData] = useState([]);
    const [apiLoading, setApiLoading] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");
    const [itemCount, setItemCount] = useState(0);
    const [loginDetails, setLoginDetails] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [users, setUsers] = useState([]);

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

    // Fetch Users Data from Microsoft Graph API
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
            showSnackbar('success', "Users Data fetched");
        } catch (error) {
            setDataAPIError(error.toString());
            // console.log("fetchUsers:ERROR:" + error);
            setItemCount(0);
            setApiLoading(false);
            setData([]);
            showSnackbar('error', "User data fetch error" + error);
        }
    };

    // Fetch Login Details for ALL Users from API
    const fetchLoginDetailsForUsers = async (users) => {
        setApiLoading(true);
        const updatedUsers = await Promise.all(users.map(async (user) => {
            try {
                const response = await axios.get(APIPath + `/getlogindetails/${user.userPrincipalName.replace('_outlook.com', '@outlook.com')}`, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                    }
                });
                if (response.data.data[0] && response.data.data[0].loginCount !== undefined && response.data.data[0].lastLoginDate !== undefined) {
                    showSnackbar('success', "Users Login data fetched");
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
        setApiLoading(false);
    };

    // Fetch Login Details for EACH User from API
    const fetchLoginDetails = async (userName) => {
        try {
            setApiLoading(true);
            // console.log(userName)
            const response = await axios.get(APIPath + "/getlogindetails/" + userName, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                }
            });
            setLoginDetails(response.data.data[0]);
            setDialogOpen(true);
            setApiLoading(false);
            showSnackbar('success', "Users Login data fetched");
        } catch (error) {
            // console.log("ERROR: fetching login details:", error);
        }
    };

    const iconMap = {
        ADMIN: <AdminPanelSettingsOutlinedIcon />,
        COHOST: <SupervisedUserCircleOutlinedIcon />,
        OPERATOR: <PersonOutlinedIcon />,
        DEFAULT: <AttributionOutlinedIcon />,
        EMPLOYEE: <AttributionOutlinedIcon />,
    };
    const classMap = {
        ADMIN: 'rag-green-bg badgeSpan',
        COHOST: 'rag-gray-bg badgeSpan',
        OPERATOR: 'rag-blue-bg badgeSpan',
        DEFAULT: 'rag-red-bg badgeSpan',
        EMPLOYEE: 'rag-red-bg badgeSpan',
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
        //type: 'fitGridWidth',
        defaultMinWidth: 50
    };

    //For dialog MUI
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));

    return (
        <>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
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
                {apiLoading && !data ?
                    <div className="spinner"></div> :
                    <>
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
                    </>
                }
            </div>

            <BootstrapDialog
                onClose={() => setDialogOpen(false)}
                aria-labelledby="customized-dialog-title"
                open={dialogOpen}
            >
                <DialogTitle className="text-pink-600" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    Last Login Details
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setDialogOpen(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <div>
                        <Stack direction={'column'} spacing={1}>
                            <Stack direction={'row'} spacing={1}>
                                <div className="w-[200px] dialogItemTitle">Login Count</div>
                                <div className="">{loginDetails ? loginDetails.loginCount : ''}</div>
                            </Stack>
                            <Stack direction={'row'} spacing={1}>
                                <div className="w-[200px] dialogItemTitle">Login Date</div>
                                <div className="">{loginDetails ? loginDetails.lastLoginDate : ''}</div>
                            </Stack>
                            <Stack direction={'row'} spacing={1}>
                                <div className="w-[200px] dialogItemTitle">IP Address</div>
                                <div className="">{loginDetails ? loginDetails.ipAddress : ''}</div>
                            </Stack>
                            <Stack direction={'row'} spacing={1}>
                                <div className="w-[200px] dialogItemTitle">City</div>
                                <div className="">{loginDetails ? loginDetails.city : ''}</div>
                            </Stack>
                            <Stack direction={'row'} spacing={1}>
                                <div className="w-[200px] dialogItemTitle">Region</div>
                                <div className="">{loginDetails ? loginDetails.region : ''}</div>
                            </Stack>
                            <Stack direction={'row'} spacing={1}>
                                <div className="w-[200px] dialogItemTitle">Country</div>
                                <div className="">{loginDetails ? loginDetails.country : ''}</div>
                            </Stack>
                            <Stack direction={'row'} spacing={1}>
                                <div className="w-[200px] dialogItemTitle">Latitude</div>
                                <div className="">{loginDetails ? loginDetails.latitude : ''}</div>
                            </Stack>
                            <Stack direction={'row'} spacing={1}>
                                <div className="w-[200px] dialogItemTitle">Longitude</div>
                                <div className="">{loginDetails ? loginDetails.longitude : ''}</div>
                            </Stack>
                            {loginDetails && (
                                <Stack direction={'row'} spacing={1}>
                                    <div className="w-[200px] dialogItemTitle">Google Map</div>
                                    <div className="">
                                        <Link
                                            className=''
                                            href={`https://www.google.com/maps?q=${loginDetails.latitude},${loginDetails.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            underline="none"
                                        >
                                            <Button
                                                size='small'
                                                variant="contained"
                                                color="info"
                                                startIcon={<RoomOutlinedIcon />}
                                            >
                                                Open
                                            </Button>
                                        </Link>
                                    </div>
                                </Stack>
                            )}
                        </Stack>
                    </div>
                </DialogContent>
            </BootstrapDialog>

        </>
    )
}

export default UserList;
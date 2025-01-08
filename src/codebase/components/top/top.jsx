import React, { useContext, useEffect, useState } from "react";
import configData from "../../../CONFIG_RELEASE.json";
import './top.css';
import 'react-tooltip/dist/react-tooltip.css';
import { assets } from '../../assets/assets'
import { Context } from "../../context/context";
import { Tooltip } from 'react-tooltip';
import { pink } from '@mui/material/colors';
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import { Stack } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ModulesTop from "../top2/ModulesTop";
import TransactionsTop from "../top2/TransactionsTop";
import Dashboard from "../dashboard/dashboard";
import TodosMain from "../todo/todosMain";
import UsersMain from "../users/usersMain";
import FilesMain from "../files/filesMain";
import AppsIcon from '@mui/icons-material/Apps';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AttributionIcon from '@mui/icons-material/Attribution';
import CustomSnackbar from "../snackbar/snackbar";
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import Configuration from "../configuration/configuration";
import Settings from "../settings/settings";
import Balance from "../balance/balance";
import Calendar from "../calendar/calendar";

const Top = () => {

    const {
        isAPILoading,
        isAPIError,
        APIVersion,
        APIType,
        checkAPIAvailability,
        userName, userType } = useContext(Context);

    //page title
    useEffect(() => {
        document.title = "Staffing";
    });

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


    return (
        <div className="topHolder px-0">
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />

            <div className="topTabsHolder  flex flex-grow">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <div className="topLeft px-1 mt-1">
                        <Stack spacing={1} direction="row" className="items-center justify-center">
                            <img className="icon" src={assets.logo_24} alt="" />
                            <PriceChangeOutlinedIcon fontSize='large' />
                            <span className="logo" >
                                Staffing
                            </span>
                        </Stack>
                        <div className="release_version_Div">{configData.releases[0].version}</div>
                    </div>
                    <Tabs >
                        <TabList className="topTabsListHolder">
                            <Tab ><AppsIcon className="mr-1" />Dashboard</Tab>
                            <Tab ><WorkspacesIcon className="mr-1" />Modules</Tab>
                            <Tab ><CurrencyExchangeIcon className="mr-1" />Transactions</Tab>
                            {userType === 'ADMIN' && (
                                <Tab ><MoreTimeIcon className="mr-1" />Timesheets</Tab>
                            )}
                            <Tab ><FileCopyOutlinedIcon className="mr-1" />Files</Tab>
                            <Tab ><CheckCircleOutlineIcon className="mr-1" />Todo</Tab>
                            {userType === 'ADMIN' && (
                                <Tab ><AttributionIcon className="mr-1" />Users</Tab>
                            )}
                            <Tab ><CalendarMonthOutlinedIcon className="mr-1" />Calendar</Tab>
                            {userType === 'ADMIN' && (
                                <Tab ><SettingsEthernetIcon className="mr-1" />Configuration</Tab>
                            )}
                        </TabList>

                        <TabPanel className="px-2">
                            <Dashboard />
                        </TabPanel>
                        <TabPanel className="px-2">
                            <ModulesTop />
                        </TabPanel>
                        <TabPanel className="px-2">
                            <TransactionsTop />
                        </TabPanel>
                        {userType === 'ADMIN' && (
                            <TabPanel className="px-2">
                                Timesheets
                            </TabPanel>
                        )}
                        <TabPanel className="px-2">
                            <FilesMain />
                        </TabPanel>
                        <TabPanel className="px-2">
                            <TodosMain />
                        </TabPanel>
                        {userType === 'ADMIN' && (
                            <TabPanel className="px-2">
                                <UsersMain />
                            </TabPanel>
                        )}
                        <TabPanel className="px-2">
                            <Calendar />
                        </TabPanel>
                        {userType === 'ADMIN' && (
                            <TabPanel className="px-2">
                                <Configuration />
                            </TabPanel>
                        )}
                    </Tabs>
                </Box>
            </div>

            {userType === 'ADMIN' && (
                <Balance />
            )}

            <div className="userHolder">
                <div className="px-2  rounded-sm text-white">
                    <Stack spacing={1} direction="row" className="items-center justify-center">
                        <Avatar
                            sx={{ width: 16, height: 16, bgcolor: "ActiveCaption" }}
                        >
                        </Avatar>
                        <div className="">
                            {userName}
                        </div>
                        <div className="userTypeHolder px-2 ml-2">
                            {userType}
                        </div>
                    </Stack>
                </div>

            </div>


            {userType === 'ADMIN' && (
                <Settings />
            )}

            <Tooltip id="my-tooltip-api-availability" className="tooltip-example" />

            <div className="APICheckHolder"
                data-tooltip-id="my-tooltip-api-availability"
                data-tooltip-html="Status of API">
                {isAPILoading ?
                    // <img
                    //     src={assets.loader_Circles_icon} alt="" />
                    <CircularProgress size="16px" color="secondary" />
                    :
                    isAPIError ?
                        <>
                            <Button size="small" variant="contained" color="error" startIcon={<SwapHorizontalCircleOutlinedIcon />}
                                onClick={() => {
                                    checkAPIAvailability();
                                    showSnackbar('info', "Checked API availability");
                                }}
                            >
                                ERROR
                            </Button>
                        </>
                        :
                        <>
                            <Button size="small" variant="outlined" color="success" startIcon={<SwapHorizontalCircleOutlinedIcon />}
                                onClick={() => {
                                    checkAPIAvailability();
                                    showSnackbar('info', "Checked API availability");
                                }}
                            >
                                {APIType === "LOCAL" ? "LOCAL" : "ONLINE:" + APIVersion}
                            </Button>
                        </>
                }

            </div>


        </div>
    )
}
export default Top;
import React, { useContext, useEffect, useState } from "react";
import configData from "../../../CONFIG_RELEASE.json";
import './top.css';
import 'react-tooltip/dist/react-tooltip.css';
import { assets } from '../../assets/assets'
import { Context } from "../../context/context";
import { Tooltip } from 'react-tooltip';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import { Stack } from "@mui/material";
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
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AttributionIcon from '@mui/icons-material/Attribution';
import CustomSnackbar from "../snackbar/snackbar";
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import Configuration from "../configuration/configuration";
import Settings from "../settings/settings";
import Balance from "../balance/balance";
import Calendar from "../calendar/calendar";

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import CachedIcon from '@mui/icons-material/Cached';
import axios from 'axios';
import Footer from "../footer/footer";

const Top = () => {

    const {
        refreshPage,
        openDashboardAPIError,
        dashboardAPIError,
        isAPILoading,
        APIPath,
        userName, userType, todoOpen } = useContext(Context);

    //page title
    useEffect(() => {
        document.title = "Staffing";
    });

    useEffect(() => {
        axios.post(APIPath + '/login', { userName })
            .then(response => {
                if (response.data.STATUS === "FAIL")
                    showSnackbar('error', "Login trace failure");
                else
                    showSnackbar('info', "Login trace success");
            })
            .catch(error => {
                showSnackbar('error', "Login trace failure");
            });
    }, [userName]);

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

    //FOR NO data source scenario
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));
    const [openLoadingAPI, setOpenLoadingAPI] = React.useState(false);
    //this ensure to show the above dialog is no DS are given by API
    useEffect(() => {
        console.log("SHOW LOADING:" + isAPILoading)
        setOpenLoadingAPI(isAPILoading);
    }, [isAPILoading]);

    const [permissions, setPermissions] = useState([]);
    useEffect(() => {
        if (userType !== 'ADMIN') {
            axios.get(APIPath + `/gettoppermissions/${userName}`)
                .then(response => {
                    if (response.data.STATUS === "FAIL")
                        showSnackbar('error', "Top tabs Permissions failure");
                    else {
                        showSnackbar('info', "Top tabs Permissions success");
                        setPermissions(response.data.data)
                    }
                })
                .catch(error => {
                    showSnackbar('error', "Top tabs Permissions failure");
                });
        }
    }, [userName, userType]);

    const allTabs = [
        { name: 'Dashboard', icon: <AppsIcon className="mr-1" fontSize="small" /> },
        { name: 'New', icon: <ControlPointOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Transactions', icon: <AttachMoneyOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Timesheets', icon: <MoreTimeIcon className="mr-1" fontSize="small" /> },
        { name: 'Files', icon: <FileCopyOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Todo', icon: <CheckCircleOutlineIcon className="mr-1" fontSize="small" /> },
        { name: 'Users', icon: <AttributionIcon className="mr-1" fontSize="small" /> },
        { name: 'Calendar', icon: <CalendarMonthOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Configuration', icon: <SettingsEthernetIcon className="mr-1" fontSize="small" /> }
    ];
    const tabsToShow = userType === 'ADMIN' ? allTabs.map(tab => tab.name) : permissions;

    return (
        <div className="topHolder px-0">
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />

            <div className="topTabsHolder flex flex-grow">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <div className="topLeft px-1 mt-1">
                        <Stack spacing={1} direction="row" className="items-center justify-center">
                            <img className="icon" src={assets.logo_24} alt="" />
                            <PriceChangeOutlinedIcon fontSize='large' />
                        </Stack>
                        <div className="release_version_Div">{configData.releases[0].version}</div>
                    </div>
                    <Tabs>
                        <TabList className="topTabsListHolder">
                            {allTabs.map(tab => (
                                tabsToShow.includes(tab.name) && <Tab key={tab.name}>{tab.icon}{tab.name}</Tab>
                            ))}
                        </TabList>

                        {tabsToShow.includes('Dashboard') && <TabPanel className="px-2"><Dashboard /></TabPanel>}
                        {tabsToShow.includes('New') && <TabPanel className="px-2"><ModulesTop /></TabPanel>}
                        {tabsToShow.includes('Transactions') && <TabPanel className="px-2"><TransactionsTop /></TabPanel>}
                        {tabsToShow.includes('Timesheets') && <TabPanel className="px-2">Timesheets</TabPanel>}
                        {tabsToShow.includes('Files') && <TabPanel className="px-2"><FilesMain /></TabPanel>}
                        {tabsToShow.includes('Todo') && <TabPanel className="px-2"><TodosMain /></TabPanel>}
                        {tabsToShow.includes('Users') && <TabPanel className="px-2"><UsersMain /></TabPanel>}
                        {tabsToShow.includes('Calendar') && <TabPanel className="px-2"><Calendar /></TabPanel>}
                        {tabsToShow.includes('Configuration') && <TabPanel className="px-2"><Configuration /></TabPanel>}
                    </Tabs>
                </Box>
            </div>

            {userType === 'ADMIN' && (
                <Balance />
            )}

            <div className={`userHolder ${todoOpen ? '' : 'userHolderFull'}`} >
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

            <Footer />

            

            <BootstrapDialog
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={openLoadingAPI}
            >
                <DialogTitle className="dialogTitle" sx={{ m: 0, p: 1 }} id="customized-dialog-title" >
                    <Stack className="stackLoadingTitle" direction="row" spacing={2}>
                        <div>Please wait</div>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers size="small">
                    <Stack direction="column" spacing={2}>
                        <Stack className="stackLoadingMessages" direction="column" spacing={2}>
                            <LinearProgress color="secondary" />
                        </Stack>
                        <Stack className="stackLoadingMessages" direction="row" spacing={2}>
                            <div>Checking API availability</div>
                        </Stack>
                        <Stack className="stackLoadingMessages" direction="row" spacing={2}>
                            <div>Checking Application DB access</div>
                        </Stack>
                        <Stack className="stackLoadingMessages" direction="row" spacing={2}>
                            <div>Fetching configured list</div>
                        </Stack>
                    </Stack>
                </DialogContent>
            </BootstrapDialog>

            <BootstrapDialog
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={openDashboardAPIError}
            >
                <DialogTitle className="dialogTitle" sx={{ m: 0, p: 1 }} id="customized-dialog-title" >
                    <Stack className="stackLoadingTitle text-red-600" direction="row" spacing={2} >
                        <div>Errow in API - Mostly SQL issue</div>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers size="small">
                    <Alert severity="error" className="mb-4">{dashboardAPIError}</Alert>
                    <Button variant="contained" size="large" className="bg-pink-600 float-right mt-4"
                        startIcon={<CachedIcon />}
                        onClick={refreshPage}>Refresh
                    </Button>
                </DialogContent>
            </BootstrapDialog>


        </div>
    )
}
export default Top;
import React, { useContext, useEffect, useState } from "react";
import configData from "../../../CONFIG_RELEASE.json";
// import preval from 'preval.macro';
import './top.css';
import 'react-tooltip/dist/react-tooltip.css';
import { assets } from '../../assets/assets'
import { Context } from "../../context/context";
import { Tooltip } from 'react-tooltip';
import { styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Avatar from '@mui/material/Avatar';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import { Stack } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ReportGmailerrorredRoundedIcon from '@mui/icons-material/ReportGmailerrorredRounded';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ModulesTop from "../top2/ModulesTop";
import TransactionsTop from "../top2/TransactionsTop";
import Dashboard from "../dashboard/dashboard";
import TodosMain from "../todo/todosMain";
import UsersMain from "../users/usersMain";
import FilesMain from "../files/filesMain";
import CenterFocusWeakOutlinedIcon from '@mui/icons-material/CenterFocusWeakOutlined';
import AppsIcon from '@mui/icons-material/Apps';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AttributionIcon from '@mui/icons-material/Attribution';
import CustomSnackbar from "../snackbar/snackbar";

const Top = () => {

    const {
        isAPILoading,
        isAPIError,
        APIversion,
        checkAPIAvailability,
        setTopTabName,
        loading,
        userName, userType } = useContext(Context);

    const tabNames = ['Dashboard', 'Modules', 'Transactions', 'Timesheets', 'Expenses', 'Files', 'Todo', 'Users'];
    const [tabIndex, setTabIndex] = React.useState(0);
    const handleTabSelect = (index) => {
        setTabIndex(index);
        console.log('Selected Tab:', tabNames[index]);
        setTopTabName(tabNames[index]);
    };

    //drawer
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    //page title
    useEffect(() => {
        document.title = "Staffing";
    });

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
    const [openNoDatasources, setOpenNoDatasources] = React.useState(false);
    const [openLoadingDatasources, setOpenLoadingDatasources] = React.useState(false);
    const handleClickOpen_NoDatasources = () => {
        setOpenNoDatasources(false);
    };
    const handleCheckDSAgain = () => {
        window.location.reload();
    };

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
                    <div className="topLeft px-1 mt-2">
                        <Stack spacing={1} direction="row" className="items-center justify-center">
                            <img className="icon" src={assets.logo_24} alt="" />
                            <PriceChangeOutlinedIcon fontSize='large' />
                            <span className="logo" >
                                Staffing
                            </span>
                        </Stack>
                        <div className="release_version_Div">{configData.releases[0].version}</div>
                    </div>
                    <Tabs selectedIndex={tabIndex}
                        onSelect={handleTabSelect}>
                        <TabList className="topTabsListHolder">
                            {/* {tabNames.map((name, idx) => (
                                // <Tab key={idx}>{name}</Tab>
                                (name !== 'Timesheets' || userType === 'ADMIN') && (
                                    <Tab key={idx} ><CenterFocusWeakOutlinedIcon className="mr-1" />{name}</Tab>
                                )
                            ))} */}
                            <Tab ><AppsIcon className="mr-1" />Dashboard</Tab>
                            <Tab ><WorkspacesIcon className="mr-1" />Modules</Tab>
                            <Tab ><CurrencyExchangeIcon className="mr-1" />Transactions</Tab>
                            {userType === 'ADMIN' && (
                                <Tab ><MoreTimeIcon className="mr-1" />Timesheets</Tab>
                            )}
                            <Tab ><AddShoppingCartIcon className="mr-1" />Expenses</Tab>
                            <Tab ><AttachmentIcon className="mr-1" />Files</Tab>
                            <Tab ><CheckCircleOutlineIcon className="mr-1" />Todo</Tab>
                            <Tab ><AttributionIcon className="mr-1" />Users</Tab>
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
                        {userType === 'ADMIN' ?
                            <TabPanel className="px-2">
                                Timesheets
                            </TabPanel>
                            :
                            <></>}
                        <TabPanel className="px-2">
                            Expenses
                        </TabPanel>
                        <TabPanel className="px-2">
                            {/* <FilesMain /> */}
                            FILES
                        </TabPanel>
                        <TabPanel className="px-2">
                            <TodosMain />
                        </TabPanel>
                        <TabPanel className="px-2">
                            {/* <UsersMain /> */}
                            USERS
                        </TabPanel>
                    </Tabs>
                </Box>
            </div>
            <div className="optionsHolder">
                {!loading ?
                    <></>
                    :
                    <></>
                }
                <SettingsOutlinedIcon sx={{ width: 24, height: 24 }} onClick={toggleDrawer("right", true)} />
            </div>

            <div className="userHolder">
                <div className="px-2  rounded-sm text-white">
                    <Stack spacing={1} direction="row" className="items-center justify-center">
                        <Avatar
                            sx={{ width: 16, height: 16, bgcolor: pink[500] }}
                        >
                        </Avatar>
                        <div className="">
                            {userName}
                        </div>
                        <div className="bg-pink-500 px-2 ml-2">
                            {userType}
                        </div>
                    </Stack>
                </div>

            </div>

            <Drawer
                anchor="right"
                open={state["right"]}
                onClose={toggleDrawer("right", false)}
            >
                <Box className="SettingsPartsHolder" role="presentation" onClick={toggleDrawer("right", true)}>
                    <Card className="SettingsPart" variant="outlined">
                        <CardContent>
                            <Typography className="ToggleTitle" component="div">
                                Switch results template
                            </Typography>
                            <Typography className="ToggleCaption" variant="caption" component="div">
                                This would show the results from AI in new format.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <div className="templateSwitchHolder">
                                gjhgj
                            </div>
                        </CardActions>
                    </Card>
                    <Card className="SettingsPart" variant="outlined">
                        <CardContent>
                            <Typography className="ToggleTitle" component="div">
                                Show greetings on landing page
                            </Typography>
                            <Typography className="ToggleCaption" variant="caption" component="div">
                                This would show the tool's capabilities and curated example prompts.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <div className="greetingsBoxesSwitchHolder">
                                6859969
                            </div>
                        </CardActions>
                    </Card>
                </Box>
            </Drawer>

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
                                ERROR: service issue
                            </Button>
                            {/* <SwapHorizontalCircleOutlinedIcon className="APICheckClicker" color="error" onClick={checkAPIAvailability} />
                            <span className="APICheckHolder_text">service issue</span> */}
                        </>
                        :
                        <>
                            <Button size="small" variant="contained" color="success" startIcon={<SwapHorizontalCircleOutlinedIcon />} 
                                onClick={() => {
                                    checkAPIAvailability();
                                    showSnackbar('info', "Checked API availability");
                                }}
                            >
                                OK: {APIversion === "LOCAL VERSION" ? "Local API" : "Online API: " + APIversion}
                            </Button>
                            {/* <SwapHorizontalCircleOutlinedIcon className="APICheckClicker" color="success" onClick={checkAPIAvailability} />
                            <span className="APICheckHolder_text"></span> */}
                        </>
                }

            </div>

            <BootstrapDialog
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={openNoDatasources}
            >
                <DialogTitle color="error" className="dialogTitle" sx={{ m: 0, p: 1 }} id="customized-dialog-title" >
                    <Stack direction="row" spacing={2}>
                        <div>No Data Sources configured</div>
                        <Button variant="outlined" color="primary" size="small"
                            startIcon={<RefreshRoundedIcon />}
                            onClick={handleCheckDSAgain}
                        >
                            Check again.
                        </Button>
                    </Stack>
                </DialogTitle>
                <IconButton
                    onClick={handleClickOpen_NoDatasources}
                    aria-label="close"
                    sx={{
                        position: 'absolute',
                        right: 3,
                        top: 3,
                        color: (theme) => theme.palette.grey[900],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Stack direction="row" spacing={1}>
                        <ReportGmailerrorredRoundedIcon color="error" />
                        <span className="devTitleHolder">Looks like there are no data sources configured in the application. Check the configuration.</span>

                    </Stack>
                </DialogContent>
            </BootstrapDialog>
            <BootstrapDialog
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={openLoadingDatasources}
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
                            <div>Checking Key Vault access</div>
                        </Stack>
                        <Stack className="stackLoadingMessages" direction="row" spacing={2}>
                            <div>Checking Application DB access</div>
                        </Stack>
                        <Stack className="stackLoadingMessages" direction="row" spacing={2}>
                            <div>Fetching configured list of data sources</div>
                        </Stack>
                    </Stack>
                </DialogContent>
            </BootstrapDialog>

        </div>
    )
}
export default Top;
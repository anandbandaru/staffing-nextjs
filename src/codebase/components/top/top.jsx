import React, { useContext, useEffect, useState } from "react";
import configData from "../../../CONFIG_RELEASE.json";
import './top.css';
import 'react-tooltip/dist/react-tooltip.css';
import { assets } from '../../assets/assets'
import { Context } from "../../context/context";
import { Tooltip } from 'react-tooltip';
import { pink } from '@mui/material/colors';
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Avatar from '@mui/material/Avatar';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import { Stack, Skeleton } from "@mui/material";
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
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AttributionIcon from '@mui/icons-material/Attribution';
import CustomSnackbar from "../snackbar/snackbar";
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import GenericList from "../forms/GenericList";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import AssignmentIndSharpIcon from '@mui/icons-material/AssignmentIndSharp';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import preval from 'preval.macro';
import axios from 'axios';
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined';

const Top = () => {

    const {
        APIPath,
        APIAvailabilityResponse,
        isAPILoading,
        isAPIError,
        APIVersion,
        APIType,
        checkAPIAvailability,
        setTopTabName,
        loading,
        userName, userType } = useContext(Context);

    const tabNames = ['Dashboard', 'Modules', 'Transactions', 'Timesheets', 'Expenses', 'Files', 'Todo', 'Users', 'Configuration'];
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

    const [apiLoading, setApiLoading] = useState(false);
    const [counts, setCounts] = useState({
        storageusage: 0,
        storagelimit: 0,
    });
    useEffect(() => {
        const fetchCounts = async () => {
            setApiLoading(true);
            const endpoints = [
                '/counts/storagelimit',
                '/counts/storageusage'
            ];

            try {
                const responses = await Promise.all(
                    endpoints.map(endpoint => axios.get(APIPath + endpoint).catch(() => ({ data: { total: 0 } })))
                );

                const newCounts = responses.reduce((acc, response, index) => {
                    const key = endpoints[index].split('/').pop();
                    acc[key] = response.data.total;
                    return acc;
                }, {});

                setCounts(newCounts);
            } catch (error) {
                console.error('Error fetching counts:', error);
            } finally {
                setApiLoading(false);
            }
        };

        fetchCounts();
    }, [APIPath]);


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
                            <Tab ><SettingsEthernetIcon className="mr-1" />Configuration</Tab>
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
                            <FilesMain />
                        </TabPanel>
                        <TabPanel className="px-2">
                            <TodosMain />
                        </TabPanel>
                        <TabPanel className="px-2">
                            <UsersMain />
                        </TabPanel>
                        <TabPanel className="px-2">
                            <GenericList formType={'jobTypes'} />
                            {/* <GenericList formType={"employeeTypes"} />
                            <GenericList formType={"dependentTypes"} />
                            <GenericList formType={"visaTypes"} /> */}
                        </TabPanel>
                    </Tabs>
                </Box>
            </div>

            <div className="balanceHolder">
                $ 102.45
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
                                Developer Info:
                            </Typography>
                            <Stack spacing={1}>
                                {
                                    configData.developers.map((item, index) => (
                                        <List key={index} className="devContainer" sx={{ width: '300px', maxWidth: 350 }}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar className="devContainerAvatar">
                                                        <AssignmentIndSharpIcon color="#f0ad4e" />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={item.name} secondary={item.role} />
                                            </ListItem>
                                        </List>
                                    ))
                                }
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card className="SettingsPart" variant="outlined">
                        <CardContent>
                            <Typography className="ToggleTitle" component="div">
                                Storage:
                            </Typography>
                            <div className=' flex-0 p-1' >
                                <Card sx={{ maxWidth: 335 }} >
                                    <CardContent className='mt-0'>
                                        <Stack className='mt-0' spacing={2} direction={"row"}>
                                            <div className='flex justify-center items-center border-r-2 border-red-500 pr-2'>
                                                <AddToDriveOutlinedIcon fontSize='large' className="h-36" />
                                            </div>
                                            <div className='pr-2'>
                                                <Typography component="div">
                                                    Google Drive Storage Utilization
                                                </Typography>
                                                {apiLoading
                                                    ?
                                                    <Skeleton variant="circular" width={20} height={20} />
                                                    :
                                                    <>
                                                        <Stack className='mt-3' spacing={2} direction={"row"}>
                                                            <Chip label={`LIMIT: ${counts.storagelimit} GB`} color="primary" variant="outlined" size="small"></Chip>
                                                            <Chip label={`USAGE: ${counts.storageusage.toFixed(2)} GB`} color="error" variant="outlined" size="small"></Chip>
                                                        </Stack>
                                                        <Box mt={1} spacing="2">
                                                            <LinearProgress className='gDriveProgress' variant="determinate" value={(counts.storageusage / counts.storagelimit) * 100} />
                                                        </Box>
                                                    </>
                                                }
                                            </div>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </div>

                        </CardContent>
                    </Card>

                    <Card className="SettingsPart" variant="outlined">
                        <CardContent>
                            <Tabs>
                                <TabList className="settingsTabsListHolder">
                                    <Tab>API details</Tab>
                                    <Tab>UI Build</Tab>
                                    <Tab>Versions</Tab>
                                </TabList>

                                <TabPanel className="py-4">
                                    <div className="info_release_builddate_Div">
                                        {isAPILoading
                                            ?
                                            // <img className="icon" src={assets.loader_Circles_icon} alt="" />
                                            <LinearProgress color="secondary" />
                                            :
                                            <>
                                                <Chip className="info_release_API_type_Div mb-4"
                                                    label={APIType === "LOCAL" ? "Local API Consumption" : "Online Azure API Consumption"}
                                                    size="small" color={APIType === "LOCAL" ? 'primary' : 'success'} />
                                                {/* <div className="info_release_API_Div" dangerouslySetInnerHTML={{ __html: APItext }}> */}
                                                <div className="info_release_API_Div">
                                                    <TableContainer component={Paper}>
                                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                                            <TableBody className="info_release_API_response_TableRow">
                                                                <TableRow>
                                                                    <TableCell component="th" scope="row">API URL</TableCell>
                                                                    <TableCell align="right">{APIPath}</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell component="th" scope="row">API TYPE</TableCell>
                                                                    <TableCell align="right">{APIType}</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell component="th" scope="row">API Availability</TableCell>
                                                                    <TableCell align="right">{isAPIError ?
                                                                        <>
                                                                            <ErrorIcon fontSize="small" color="error" />
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <CheckCircleIcon fontSize="small" color="success" />
                                                                        </>
                                                                    }</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell component="th" scope="row">API Version</TableCell>
                                                                    <TableCell align="right">{APIAvailabilityResponse ? APIAvailabilityResponse.APIVersion : ""}</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </TabPanel>
                                <TabPanel className="py-1">
                                    <div className="info_release_builddate_Div">
                                        <Chip label={preval`module.exports = 'Last build Date: ' + new Date().toLocaleString();`} size="small" color='primary' variant="outlined" />
                                    </div>
                                </TabPanel>
                                <TabPanel className="py-0">
                                    <div>
                                        {
                                            configData.releases.map((item, index) => (
                                                <Accordion
                                                    key={index}
                                                    // expanded={expanded === `panel${index + 1}`} 
                                                    // onChange={handleChange(`panel${index + 1}`)}
                                                    slotProps={{ transition: { unmountOnExit: true } }}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ArrowDownwardIcon />}
                                                        aria-controls={`panel${index + 1}bh-content`}
                                                        id={`panel${index + 1}bh-header`}
                                                    >
                                                        <Stack spacing={1} direction="row">
                                                            <Chip label={item.version} size="small" color={index === 0 ? 'success' : 'default'} variant="outlined" />
                                                            <Chip label={item.date} size="small" color={index === 0 ? 'success' : 'default'} variant="outlined" />
                                                            {index === 0 ?
                                                                <Chip label="current" size="small" color='success' />
                                                                :
                                                                <></>}
                                                        </Stack>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Typography variant="caption">
                                                            <ul className="ChangeLogUL">
                                                                {item.notes.map((noteitem, noteindex) => (
                                                                    <li key={noteindex}>{noteitem}</li>
                                                                ))}
                                                            </ul>
                                                        </Typography>
                                                    </AccordionDetails>
                                                </Accordion>
                                            ))
                                        }

                                    </div>
                                </TabPanel>
                            </Tabs>

                        </CardContent>
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
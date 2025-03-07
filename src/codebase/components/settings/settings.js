import React, { useContext, useEffect, useState } from "react";
import configData from "../../../CONFIG_RELEASE.json";
import './settings.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Context } from "../../context/context";
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Avatar from '@mui/material/Avatar';
import { Stack, Skeleton, TableHead } from "@mui/material";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import AssignmentIndSharpIcon from '@mui/icons-material/AssignmentIndSharp';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
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
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { Button, Link } from '@mui/material';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import RealtimeNoteUpdate from "../realtime/realtimeNoteUpdate";
import RealtimeCount from "../realtime/realtimeCount";
import RealtimeUserUpdate from "../realtime/realtimeUserUpdate";
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

const Settings = () => {

    const {
        APIPath,
        APIAvailabilityResponse,
        isAPILoading,
        isAPIError,
        APIType,
        loading, todoOpen } = useContext(Context);
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
                    endpoints.map(endpoint => axios.get(APIPath + endpoint, {
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        }
                    }).catch(() => ({ data: { total: 0 } })))
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

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 16,
        },
    }));

    return (

        <>
            <div className={`optionsHolder ${todoOpen ? '' : 'optionsHolderFull'}`} >
                {!loading ?
                    <></>
                    :
                    <></>
                }
                <SettingsOutlinedIcon sx={{ width: 24, height: 24 }} onClick={toggleDrawer("bottom", true)} />
            </div>

            <Drawer
                anchor="bottom"
                open={state["bottom"]}
                onClose={toggleDrawer("bottom", false)}
            >
                <Box className="w-full SettingsPartsHolder" role="presentation" onClick={toggleDrawer("bottom", true)} >
                    <Stack direction={"row"} spacing={2} className="w-full py-4 px-4">

                        <Card sx={{ maxWidth: 195 }} className="SettingsPart" variant="outlined">
                            <CardContent>
                                <Typography className="ToggleTitle" component="div">
                                    Real Time Note:
                                </Typography>
                                <div className="my-2">
                                    This gets dispayed to all users who are viewing at the application.
                                </div>
                                <div className='py-4' >
                                    <RealtimeNoteUpdate />
                                    {/* <RealtimeUserUpdate /> */}
                                </div>
                            </CardContent>
                        </Card>

                        <Card sx={{ maxWidth: 100 }} className="SettingsPart" variant="outlined">
                            <CardContent>
                                <Typography className="ToggleTitle" component="div">
                                    Visits:
                                </Typography>
                                <div className='py-4' >
                                    <RealtimeCount />
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs>
                            <TabList className="settingsTabsListHolder">
                                <Tab>API details</Tab>
                                <Tab>UI Build</Tab>
                                <Tab>Versions</Tab>
                                <Tab>Quick Links</Tab>
                                <Tab>Developer Info</Tab>
                                <Tab>Google Drive Storage</Tab>
                                <Tab>Company Details</Tab>
                            </TabList>

                            <TabPanel className="py-0">
                                <div className="info_release_builddate_Div">
                                    {isAPILoading
                                        ?
                                        // <img className="icon" src={assets.loader_Circles_icon} alt="" />
                                        <LinearProgress color="secondary" />
                                        :
                                        <>
                                            <Chip className="info_release_API_type_Div mb-4"
                                                label={APIType === "LOCAL" ? "Local API Consumption" : "Online Azure API Consumption"}
                                                size="small" color={APIType === "LOCAL" ? 'warning' : 'success'} />
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
                            <TabPanel className="py-0">
                                <div className="info_release_builddate_Div">
                                    <Chip label={preval`module.exports = 'Last build Date: ' + new Date().toLocaleString();`} size="small" color='primary' variant="outlined" />
                                </div>
                            </TabPanel>
                            <TabPanel className="py-0">
                                <div className="max-h-52 overflow-y-auto">
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
                                                                <li key={noteindex}><KeyboardArrowRightOutlinedIcon fontSize="small" />{noteitem}</li>
                                                            ))}
                                                        </ul>
                                                    </Typography>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))
                                    }

                                </div>
                            </TabPanel>
                            <TabPanel className="py-0">
                                <Stack spacing={2} direction={"column"} className="my-2">
                                    <Link className='float-right'
                                        href="https://outlook.live.com/calendar/0/view/month"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        underline="none"
                                    >
                                        <Button
                                            size='small'
                                            variant="contained"
                                            color="info"
                                            startIcon={<InsertLinkOutlinedIcon />}
                                        >
                                            VSK Calendar
                                        </Button>
                                    </Link>
                                    <Link className='float-right'
                                        href="https://outlook.live.com/mail/0/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        underline="none"
                                    >
                                        <Button
                                            size='small'
                                            variant="contained"
                                            color="info"
                                            startIcon={<InsertLinkOutlinedIcon />}
                                        >
                                            VSK Mail
                                        </Button>
                                    </Link>
                                    <Link className='float-right'
                                        href="https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        underline="none"
                                    >
                                        <Button
                                            size='small'
                                            variant="contained"
                                            color="info"
                                            startIcon={<InsertLinkOutlinedIcon />}
                                        >
                                            Azure User Management
                                        </Button>
                                    </Link>
                                </Stack>
                            </TabPanel>
                            <TabPanel className="py-0">
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
                            </TabPanel>
                            <TabPanel className="py-0">
                                <div className=' flex-0 p-1 my-2' >
                                    <Card sx={{ maxWidth: 235 }} >
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
                                                            <Stack className='mt-3' spacing={2} direction={"column"}>
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
                            </TabPanel>
                            <TabPanel>
                                <TableContainer component={Paper} className="tableContainer mb-6">
                                    <Table size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left"></StyledTableCell>
                                                <StyledTableCell align="right"></StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow >
                                                <TableCell component="th" scope="row" className="divTitle bg-white">Company Name</TableCell>
                                                <TableCell align="right" className=" bg-white">{configData.companyDetails[0].title}</TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell component="th" scope="row" className="divTitle bg-white">Company Address</TableCell>
                                                <TableCell align="right" className=" bg-white">{configData.companyDetails[0].address}</TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell component="th" scope="row" className="divTitle bg-white">Company Cheque Name</TableCell>
                                                <TableCell align="right" className=" bg-white">{configData.companyDetails[0].chequeTitle}</TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell component="th" scope="row" className="divTitle bg-white">Company Cheque Address</TableCell>
                                                <TableCell align="right" className=" bg-white">{configData.companyDetails[0].chequeAddress}</TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell component="th" scope="row" className="divTitle bg-white">Company Cheque Phone</TableCell>
                                                <TableCell align="right" className=" bg-white">{configData.companyDetails[0].chequePhone}</TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell component="th" scope="row" className="divTitle bg-white">Company Cheque Email</TableCell>
                                                <TableCell align="right" className=" bg-white">{configData.companyDetails[0].chequeEmail}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>
                        </Tabs>

                    </Stack>
                </Box>
            </Drawer>
        </>
    )
}
export default Settings;
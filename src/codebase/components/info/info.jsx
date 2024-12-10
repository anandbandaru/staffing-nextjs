import React, { useContext } from "react";
import configData from "../../../CONFIG_RELEASE.json";
import { Context } from "../../context/context";
import './info.css';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Stack } from "@mui/material";
import preval from 'preval.macro';
import Box from '@mui/material/Box';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinearProgress from '@mui/material/LinearProgress';

const Info = () => {
    const { 
        isAPIError,
        APIversion,
        isAPILoading,
        APIPath,
        APIAvailabilityResponse } = useContext(Context);
    const [openInfo, setOpenInfo] = React.useState(false);

    //For dialog MUI
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    const handleClose_info = () => {
        setOpenInfo(false);
    };
    const handleClickOpen_info = () => {
        setOpenInfo(true);
    };
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));

    // FOR TABS


    return (
        <>
            <div className="bottom-item bottom-entry bottom-entry-info" onClick={handleClickOpen_info}>
                {/* <img src={assets.info_icon} alt="" />  */}
                <PrivacyTipOutlinedIcon fontSize="small" />
                <p>Info</p>
            </div>
            <BootstrapDialog
                onClose={handleClose_info}
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={openInfo}
            >
                <DialogTitle className="dialogTitle" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    About GenAI Application
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose_info}
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
                    <Typography gutterBottom variant="body2">
                        {configData.info_text}
                    </Typography>

                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <Tabs>
                            <TabList className="myReactTabsHolder">
                                <Tab>API details</Tab>
                                <Tab>UI Build</Tab>
                                <Tab>Recent Versions</Tab>
                                <Tab>Old Versions</Tab>
                            </TabList>

                            <TabPanel>
                                <div className="info_release_builddate_Div">
                                    {isAPILoading 
                                    ?
                                        // <img className="icon" src={assets.loader_Circles_icon} alt="" />
                                        <LinearProgress  color="secondary" />
                                    :
                                    <>
                                        <Chip className="info_release_API_type_Div" 
                                        label={APIversion === "LOCAL VERSION" ? "Local API Consumption" : "Online Azure API Consumption"} 
                                        size="small" color={APIversion === "LOCAL VERSION" ? 'primary' : 'success'}  />
                                        {/* <div className="info_release_API_Div" dangerouslySetInnerHTML={{ __html: APItext }}> */}
                                        <div className="info_release_API_Div">
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
                                                <TableBody className="info_release_API_response_TableRow">                                                
                                                    <TableRow>
                                                        <TableCell component="th" scope="row">API URL</TableCell>
                                                        <TableCell align="right">{APIPath}</TableCell>
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
                                                        <TableCell align="right">{APIAvailabilityResponse ? APIAvailabilityResponse.APIversion : ""}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" scope="row">Azure OpenAI API Version</TableCell>
                                                        <TableCell align="right">{APIAvailabilityResponse ? APIAvailabilityResponse.OpenAIAPIVersion : ""}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" scope="row">Azure OpenAI Endpoint</TableCell>
                                                        <TableCell align="right">{APIAvailabilityResponse ? APIAvailabilityResponse.OpenAIEndpoint : ""}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" scope="row">Azure OpenAI Model Version</TableCell>
                                                        <TableCell align="right">{APIAvailabilityResponse ? APIAvailabilityResponse.OpenAIGPTVersion : ""}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" scope="row"># of configured Data Sources</TableCell>
                                                        <TableCell align="right">{APIAvailabilityResponse ? APIAvailabilityResponse.datasources.length : ""}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" scope="row">Key Vault Access from API</TableCell>
                                                        <TableCell align="right">{
                                                            APIAvailabilityResponse ? 
                                                                APIAvailabilityResponse.isErrorKeyVault ?
                                                                <>
                                                                    <Stack direction="row" spacing={1}>
                                                                    <ErrorIcon fontSize="small" color="error" />
                                                                    <div>
                                                                    Ensure you do az-login in your development machine
                                                                    </div>
                                                                    </Stack>
                                                                </>:
                                                                <>
                                                                    <CheckCircleIcon fontSize="small" color="success" />
                                                                </>
                                                            : 
                                                                ""
                                                                }
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                            </TableContainer>
                                        </div>
                                    </>
                                    }
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="info_release_builddate_Div">
                                    <Chip label={preval`module.exports = 'Last build Date: ' + new Date().toLocaleString();`} size="small" color='primary' variant="outlined" />
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div>
                                    {
                                        configData.releases.slice(0, 3).map((item, index) => (
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
                                                        <Chip label="current" size="small" color='success'  />
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
                            <TabPanel>
                                <div>
                                    {
                                        configData.releases.slice(3).map((item, index) => (
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
                                                        <Chip label={item.version} size="small" color='default' variant="outlined" />
                                                        <Chip label={item.date} size="small" color='default' variant="outlined" />
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
                    </Box>


                </DialogContent>
                <DialogActions className="ActionsButtons">
                    <Button onClick={handleClose_info} variant="outlined" size="small" startIcon={<InsertLinkRoundedIcon />}>
                        OpenAI
                    </Button>
                    <Button onClick={handleClose_info} variant="outlined" size="small" startIcon={<InsertLinkRoundedIcon />}>
                        Azure OpenAI
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )
}

export default Info;
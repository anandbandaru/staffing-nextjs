import React, { useContext, useEffect } from "react";
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

import MenuItem from '@mui/material/MenuItem';
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Fade from '@mui/material/Fade';
import LogoutIcon from '@mui/icons-material/Logout';

import ListItemText from '@mui/material/ListItemText';

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
import OwnersMain from "../owners/ownersMain";

const Top = () => {

    const {
        isAPILoading,
        isAPIError,
        APIversion,
        checkAPIAvailability,
        loading } = useContext(Context);

    const [tabIndex, setTabIndex] = React.useState(0);
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
        console.log("tit")
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

    //this ensure to show the above dialog is no DS are given by API
    // useEffect(() => {
    //     setOpenNoDatasources(true);
    //     setOpenLoadingDatasources(true)
    //     //AFTER SOME TIME CLOSE THE DIALOG IF API FAILURE OCCURS
    //     setTimeout(() => {
    //         if(isAPIError)
    //         {
    //             setOpenLoadingDatasources(false);
    //             setOpenNoDatasources(false);
    //         }
    //     }, 5000);

    // }, [isAPIError]);

    const handleCheckDSAgain = () => {
        window.location.reload();
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="topHolder px-0">

            <div className="topLeft px-1 mt-2">
                <img className="icon" src={assets.logo_24} alt="" />
                <span className="logo" >
                    Staffing
                </span>
                <div className="release_version_Div">{configData.releases[0].version}</div>
            </div>
            <div className="topTabsHolder">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Tabs selectedIndex={tabIndex}
                        onSelect={(index) => setTabIndex(index)}>
                        <TabList className="topTabsListHolder">
                            <Tab>Dashboard</Tab>
                            <Tab>Owners</Tab>
                            <Tab>Companies</Tab>
                            <Tab>Employees</Tab>
                            <Tab>Projects</Tab>
                            <Tab>Timeheets</Tab>
                            <Tab>Invoices</Tab>
                            <Tab>Files</Tab>
                            <Tab>Todo</Tab>
                        </TabList>

                        <TabPanel className="px-2">
                            Dashboard
                        </TabPanel>
                        <TabPanel className="px-2">
                            <OwnersMain />
                        </TabPanel>
                        <TabPanel className="px-2">
                            sdg
                        </TabPanel>
                        <TabPanel className="px-2">
                            ag
                        </TabPanel>
                        <TabPanel className="px-2">
                            234
                        </TabPanel>
                        <TabPanel className="px-2">
                            234
                        </TabPanel>
                        <TabPanel className="px-2">
                            234
                        </TabPanel>
                        <TabPanel className="px-2">
                            234
                        </TabPanel>
                        <TabPanel className="px-2">
                            234
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

            <div className="notificationsHolder">
                {!loading ?
                    <></>
                    :
                    <></>
                }
                <CircleNotificationsOutlinedIcon sx={{ width: 24, height: 24 }} onClick={toggleDrawer("right", true)} />
            </div>

            <div className="userHolder">

                <Avatar
                    id="fade-button"
                    aria-controls={open ? 'fade-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    sx={{ width: 24, height: 24, bgcolor: pink[500] }}
                >
                </Avatar>
                <Menu
                    id="fade-menu"
                    MenuListProps={{
                        'aria-labelledby': 'fade-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    <div className="m-2 p-2">
                        User information here
                    </div>
                    <MenuItem>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText onClick={handleClose}>Logout</ListItemText>
                    </MenuItem>
                </Menu>
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
                            <SwapHorizontalCircleOutlinedIcon className="APICheckClicker" color="error" onClick={checkAPIAvailability} />
                            <span className="APICheckHolder_text">service issue</span>

                        </>
                        :
                        <>
                            <SwapHorizontalCircleOutlinedIcon className="APICheckClicker" color="success" onClick={checkAPIAvailability} />
                            <span className="APICheckHolder_text">OK: {APIversion === "LOCAL VERSION" ? "Local API" : "Online API: " + APIversion}</span>
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
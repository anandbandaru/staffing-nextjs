import React, { useContext, useEffect, useState } from 'react';
import configData from "../../../CONFIG_RELEASE.json";
import { Context } from "../../context/context";
import './footer.css';
import { Box, Stack, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';
import Alert from '@mui/material/Alert';
import CachedIcon from '@mui/icons-material/Cached';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import CustomSnackbar from "../snackbar/snackbar";

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

const Footer = ({ ipAddress, city, region, country_name }) => {
    const {
        tokenExpiry,
        refreshPage,
        isAPILoading,
        isAPIError,
        checkAPIAvailability,
        APIType,
        APIVersion,
        userType
    } = useContext(Context);

    const [isTokenExpired, setIsTokenExpired] = useState(false);
    const [elapsedTime, setElapsedTime] = useState("");
    const [timeLeft, setTimeLeft] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(true); // State for expand/collapse

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const showSnackbar = (severity, message) => {
        setSnackbarSeverity(severity);
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    // Token expiry check
    useEffect(() => {
        if (tokenExpiry) {
            const intervalId = setInterval(() => {
                if (Date.now() >= tokenExpiry) {
                    setIsTokenExpired(true);
                }
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [tokenExpiry]);

    // Calculate time left for token expiry
    useEffect(() => {
        if (tokenExpiry) {
            const intervalId = setInterval(() => {
                const now = Date.now();
                const diff = tokenExpiry - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${hours}:${minutes < 10 ? '0' : ''}${minutes}`);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [tokenExpiry]);

    // Calculate elapsed login time
    useEffect(() => {
        const loginTime = Date.now();
        const intervalId = setInterval(() => {
            const now = Date.now();
            const diff = now - loginTime;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setElapsedTime(`${hours}:${minutes < 10 ? '0' : ''}${minutes}`);
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const renderAPICheckButton = () => {
        if (isAPILoading) {
            return 'loading...';
        }

        if (isAPIError) {
            return (
                <Button
                    size="small"
                    variant="contained"
                    color="error"
                    sx={{ padding: '0px 6px', fontSize: '0.75rem', minWidth: 'auto' }}
                    startIcon={<SwapHorizontalCircleOutlinedIcon />}
                    onClick={() => {
                        checkAPIAvailability();
                        showSnackbar('info', "Checked API availability");
                    }}
                >
                    ERROR
                </Button>
            );
        }

        return (
            <Button
                size="small"
                variant="contained"
                color="success"
                disabled={userType === "EMPLOYEE"}
                sx={{ padding: '0px 6px', fontSize: '0.75rem', minWidth: 'auto' }}
                startIcon={<SwapHorizontalCircleOutlinedIcon />}
                onClick={() => {
                    checkAPIAvailability();
                    showSnackbar('info', "Checked API availability");
                }}
            >
                {APIType === "LOCAL" ? "LOCAL" : `ONLINE: ${APIVersion}`}
            </Button>
        );
    };

    const renderLocationInfo = () => {
        if (!ipAddress) return null;

        return (
            <>
                <div className="itemToHideForSmall"><p>IP: {ipAddress}</p></div>
                <div className="itemToHideForSmall"><p>City: {city}</p></div>
                <div className="itemToHideForSmall"><p>Region: {region}</p></div>
                <div className="itemToHideForSmall"><p>Country: {country_name}</p></div>
            </>
        );
    };

    return (
        <>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <Box component="footer" className="bg-gray-800 text-gray-400 py-0.5 footerHolder">
                <Stack spacing={1} direction="row" className="items-center px-4 footerItemHolder">

                    <a
                        href="#"
                        size="small"
                        color="inherit"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        sx={{ marginRight: '0px'  }}
                    >
                        {isCollapsed ? <ArrowForwardIosRoundedIcon /> : <ArrowBackIosRoundedIcon />}
                    </a>

                    {!isCollapsed && (
                        <>
                            <div>© {new Date().getFullYear()}</div>
                            <div>Logged in for: <span className='bg-orange-500 px-1 text-white'>{elapsedTime}</span></div>
                            <div>Time left in Login session: <span className='bg-pink-500 px-1 text-white'>{timeLeft}</span></div>
                            <div className="itemToHideForSmall">APP version: {configData.releases[0].version}</div>
                            {renderLocationInfo()}
                            <div className="APICheckHolder"
                                data-tooltip-id="my-tooltip-api-availability"
                                data-tooltip-html="Status of API"
                            >
                                {renderAPICheckButton()}
                            </div>
                        </>
                    )}
                </Stack>
            </Box>

            <BootstrapDialog
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={isTokenExpired}
            >
                <DialogTitle className="dialogTitle" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    <Stack className="stackLoadingTitle text-red-600" direction="row" spacing={2}>
                        <div>Login Security Token Expired</div>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers size="small">
                    <Alert severity="error" className="mb-4">You need to login again to use the application.</Alert>
                    <Button
                        variant="contained"
                        size="large"
                        className="bg-pink-600 float-right mt-4"
                        startIcon={<CachedIcon />}
                        onClick={refreshPage}
                    >
                        Refresh
                    </Button>
                </DialogContent>
            </BootstrapDialog>
        </>
    );
};

export default Footer;
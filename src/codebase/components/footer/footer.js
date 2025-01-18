import React, { useContext, useEffect, useState } from 'react';
import configData from "../../../CONFIG_RELEASE.json";
import { Context } from "../../context/context";
import './footer.css';
import { Box, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';
import Alert from '@mui/material/Alert';
import CachedIcon from '@mui/icons-material/Cached';
import CustomSnackbar from "../snackbar/snackbar";
// import preval from 'preval.macro';

const Footer = ({ipAddress, city, region, country_name}) => {
    const { tokenExpiry, refreshPage, isAPILoading, isAPIError, checkAPIAvailability,
        APIType, APIVersion
    } = useContext(Context);
    const [isTokenExpired, setIsTokenExpired] = useState(false);
    const [loginTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState("");
    const [timeLeft, setTimeLeft] = useState("");

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

    //TOKEN EXPIRY
    useEffect(() => {
        if (tokenExpiry) {
            const checkTokenExpiry = async () => {
                if (Date.now() >= tokenExpiry) {
                    setIsTokenExpired(true);
                } else {
                }
            };

            const intervalId = setInterval(() => {
                checkTokenExpiry();
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [tokenExpiry]);

    //TOKEN TIME LEFT
    useEffect(() => {
        if (tokenExpiry) {
            const calculateTimeLeft = () => {
                const now = Date.now();
                const diff = tokenExpiry - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                let leftTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
                setTimeLeft(leftTime);
            };

            const intervalId = setInterval(calculateTimeLeft, 1000);

            return () => clearInterval(intervalId);
        }
    }, [tokenExpiry]);

    //LOGIN TIME
    useEffect(() => {
        if (loginTime) {
            const calculateElapsedTime = () => {
                const now = Date.now();
                const diff = now - loginTime;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                let elapTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
                setElapsedTime(elapTime);
            };

            const intervalId = setInterval(calculateElapsedTime, 1000);

            return () => clearInterval(intervalId);
        }
    }, [loginTime]);

    return (
        <>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <Box
                component="footer"
                className="bg-gray-800 text-gray-400 py-0.5 footerHolder"
            >
                <Stack spacing={1} direction="row" className="items-center px-4 footerItemHolder">
                    <div>
                        © {new Date().getFullYear()}
                    </div>
                    <div>Logged in for: <span className='bg-orange-500 px-1 text-white'>{elapsedTime}</span></div>
                    <div>Time left in Login session: <span className='bg-pink-500 px-1 text-white'>{timeLeft}</span></div>
                    <div>APP version: {configData.releases[0].version}</div>
                    {/* <div>{preval`module.exports = 'Last build Date: ' + new Date().toLocaleString();`}</div> */}
                    {ipAddress && (
                        <>
                        <div>
                            <p>IP: {ipAddress}</p>
                        </div>
                        <div>
                            <p>City: {city}</p>
                        </div>
                        <div>
                            <p>Region: {region}</p>
                        </div>
                        <div>
                            <p>Country: {country_name}</p>
                        </div>
                        </>
                    )}
                    <div className="APICheckHolder"
                        data-tooltip-id="my-tooltip-api-availability"
                        data-tooltip-html="Status of API">
                        {isAPILoading ?
                            'loading...'
                            :
                            isAPIError ?
                                <>
                                    <Button size="small" variant="contained" color="error"
                                        sx={{
                                            padding: '0px 6px',
                                            fontSize: '0.75rem',
                                            minWidth: 'auto',
                                        }}
                                        startIcon={<SwapHorizontalCircleOutlinedIcon />}
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
                                    <Stack direction={"row"} spacing={2}>
                                        <Button size="small" variant="contained" color="success"
                                            sx={{
                                                padding: '0px 6px',
                                                fontSize: '0.75rem',
                                                minWidth: 'auto',
                                            }}
                                            startIcon={<SwapHorizontalCircleOutlinedIcon />}
                                            onClick={() => {
                                                checkAPIAvailability();
                                                showSnackbar('info', "Checked API availability");
                                            }}
                                        >
                                            {/* <div className="spinnerWhite mr-2"></div> */}
                                            {APIType === "LOCAL" ? "LOCAL" : "ONLINE:" + APIVersion}
                                        </Button>
                                    </Stack>
                                </>
                        }
                    </div>
                    {isAPILoading ?
                        <>
                            loading......................
                        </>
                        : <></>
                    }
                </Stack>
            </Box>

            <BootstrapDialog
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={isTokenExpired}
            >
                <DialogTitle className="dialogTitle" sx={{ m: 0, p: 1 }} id="customized-dialog-title" >
                    <Stack className="stackLoadingTitle text-red-600" direction="row" spacing={2} >
                        <div>Login Security Token Expired</div>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers size="small">
                    <Alert severity="error" className="mb-4">You need to login again to use the application.</Alert>
                    <Button variant="contained" size="large" className="bg-pink-600 float-right mt-4"
                        startIcon={<CachedIcon />}
                        onClick={refreshPage}>Refresh
                    </Button>
                </DialogContent>
            </BootstrapDialog>
        </>
    );
};

export default Footer;
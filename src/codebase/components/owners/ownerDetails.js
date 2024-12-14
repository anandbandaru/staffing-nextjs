import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import Stack from '@mui/material/Stack';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function OwnerDetails({ ownerID, operation }) {
    const { APIPath } = useContext(Context);
    const [open, setOpen] = React.useState(false);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [data, setData] = useState({ data: [] });
    const [firstName, setFirstName] = useState('');
    const [apiLoading, setApiLoading] = useState(true);
    const [apiLoadingError, setApiLoadingError] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");
    //For dialog MUI
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    const handleClose = () => {
        setOpen(false);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));
    const getOwnerDetails = () => {
        let apiUrl = APIPath + "/getownerdetails/" + ownerID
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    //console.log(result);
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setDataAPIError(result.error.code + " - " + result.error.message);
                        setData({});
                        setApiLoadingError(true);
                    }
                    else {
                        setData(result);
                        setFirstName(result.data[0].firstName);
                        //alert(firstName);
                        setDataAPIError(result.total == 0 ? "No Owners information present." : "ok");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    console.log("RequestData:On JUST error: API call failed")
                    setDataAPIError("RequestData:On JUST error: API call failed");
                    setApiLoading(false);
                    setApiLoadingError(true);
                }
            )
    }
    useEffect(() => {
        if (operation === "View" || operation === "Edit") {
            getOwnerDetails();
        }
    }, [firstName]);

    return (
        <>
            <Stack direction="row" spacing={1} >
                <IconButton aria-label="Metadata" title="Metadata" color="primary"
                    onClick={() => {
                        // window.alert(ownerID);
                        handleClickOpen();
                    }
                    }>
                    <ReadMoreIcon />
                </IconButton>
            </Stack>
            <BootstrapDialog
                className=""
                onClose={handleClose}
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={open}
                // fullScreen
                // keepMounted
                // TransitionProps={{
                //     onEntering: () => console.log('Entering'),
                //     onExiting: () => console.log('Exiting'),
                // }}
            >
                <DialogTitle className="text-pink-600" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    {operation} owner: ID: {ownerID}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
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
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <Tabs selectedIndex={tabIndex}
                            onSelect={(index) => setTabIndex(index)}>
                            <TabList className="thirdTabsListHolder">
                                <Tab>Metadata</Tab>
                                <Tab>Documents</Tab>
                                <Tab>Relations</Tab>
                            </TabList>

                            <TabPanel className="px-2">
                                {/* <OwnerNew ownerID={ownerID} operation="View" /> */}
                                <TableContainer component={Paper}>
                                    <Table size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Title</TableCell>
                                                <TableCell>Value</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.data.map((item, index) => (
                                                Object.entries(item).map(([key, value]) => (
                                                    <TableRow key={`${index}-${key}`}>
                                                        <TableCell component="th" scope="row">
                                                            {key}
                                                        </TableCell>
                                                        <TableCell>{value}</TableCell>
                                                    </TableRow>
                                                ))
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>
                            <TabPanel className="px-2">
                                Documents
                            </TabPanel>
                            <TabPanel className="px-2">
                                Reports
                            </TabPanel>
                        </Tabs>
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </>

    )
}

export default OwnerDetails;
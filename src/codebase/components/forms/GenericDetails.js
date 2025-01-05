import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import Stack from '@mui/material/Stack';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import IconButton from '@mui/material/IconButton';
// import Dialog from '@mui/material/Dialog';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import GenericFilesListSimple from '../forms/GenericFilesListSimple';
import EmployeeGenericList from '../employees/employeeGList';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'


function GenericDetails({ ID, operation, doLoading, moduleName }) {
    const { APIPath } = useContext(Context);
    const [open, setOpen] = React.useState(false);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(true);

    // For dialog MUI
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
        if (operation === "View" || operation === "Edit") {
            getDetails();
        }
    };

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));

    const getAPIEndpoint = () => {
        switch (moduleName) {
            case 'OWNERS':
                return APIPath + "/getownerdetails";
            case 'COMPANIES':
                return APIPath + "/getcompanydetails";
            case 'OWNERSHIPS':
                return APIPath + "/getownershipdetails";
            case 'EMPLOYEES':
                return APIPath + "/getemployeedetails";
            case 'VENDORS':
                return APIPath + "/getvendordetails";
            case 'CLIENTS':
                return APIPath + "/getclientdetails";
            case 'IMPLEMENTATIONPARTNERS':
                return APIPath + "/getimplementationpartnerdetails";
            case 'JOBTYPES':
                return APIPath + "/getjobtypedetails";
            case 'EXPENSETYPES':
                return APIPath + "/getexpensetypedetails";
            case 'FILETYPES':
                return APIPath + "/getfiletypedetails";
            case 'TODOS':
                return APIPath + "/gettododetails";
            default:
                return '';
        }
    };

    const getDetails = () => {
        setApiLoading(true);
        let apiUrl = getAPIEndpoint() + "/" + ID;
        console.log(apiUrl)
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        setData({ data: [] });
                    } else {
                        setData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({ data: [] });
                    setApiLoading(false);
                }
            );
    };

    useEffect(() => {
        if (doLoading) {
            if (operation === "View" || operation === "Edit") {
                getDetails();
            }
        }
    }, [ID]);

    const highlightKeys = ['ID', 'DISABLED', 'IMPORTANT', 'COMPLETED', 'SSN'];

    return (
        <>
            <Stack direction="row" spacing={1}>
                <IconButton aria-label="Metadata" title="Metadata" color="primary" onClick={handleClickOpen}>
                    <ReadMoreIcon />
                </IconButton>
            </Stack>

            <Dialog open={open} onClose={() => handleClose(false)} className="relative z-50 flex w-full">
                <div className="fixed inset-1 w-full items-center justify-center p-1 bg-gray-700 bg-opacity-50">
                    <DialogPanel className="space-y-4 bg-white p-3 px-5 border-gray-600 border-opacity-80 border-8 rounded-lg">
                        <DialogTitle className="font-bold text-lg">{operation} {moduleName}: ID: {ID}</DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 12,
                                top: 4,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon className='text-red-600' />
                        </IconButton>

                        {apiLoading ? (
                            <div className="spinner"></div>
                        ) : (
                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                                    <TabList className="thirdTabsListHolder">
                                        <Tab>Metadata</Tab>
                                        {((moduleName !== "FILETYPES" && moduleName !== "EXPENSETYPES") && <>
                                            <Tab>Documents</Tab>
                                            <Tab>Relations</Tab>
                                        </>
                                        )}
                                        {(moduleName === "EMPLOYEES" && <>
                                            <Tab>Dependents</Tab>
                                            <Tab>Passports</Tab>
                                            <Tab>Visas</Tab>
                                            <Tab>I94s</Tab>
                                        </>
                                        )}
                                    </TabList>

                                    <TabPanel className="px-2">
                                        <TableContainer component={Paper}>
                                            <Table size="small" aria-label="Details table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className='bg-gray-200 max-w-[200px]'>Column</TableCell>
                                                        <TableCell className='bg-gray-400'>Value</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data.data.map((item, index) => (
                                                        Object.entries(item).map(([key, value]) => (
                                                            <TableRow key={`${index}-${key}`}>
                                                                <TableCell component="th" scope="row" className="max-w-[200px]">
                                                                    <span className={`${highlightKeys.includes(key.toUpperCase()) ? 'rag-gray-bg px-2' : ''}`}>
                                                                        {key}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className='bg-gray-100'>
                                                                    {value === true ? (
                                                                        <span className="bg-red-500 text-white px-1 py-1 rounded">YES</span>
                                                                    ) : value === false ? (
                                                                        <span className="bg-green-500 text-white px-1 py-1 rounded">NO</span>
                                                                    ) : (
                                                                        value
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </TabPanel>

                                    {(moduleName !== "FILETYPES" && <>
                                        <TabPanel className="px-2">
                                            <GenericFilesListSimple moduleId={ID} componentName={moduleName} />
                                        </TabPanel>
                                        <TabPanel className="px-2">
                                            Relations
                                        </TabPanel>
                                    </>
                                    )}
                                    {(moduleName === "EMPLOYEES" && <>
                                        <TabPanel className="px-2">
                                            <EmployeeGenericList formType={'Dependent'} employeeID={ID} />
                                        </TabPanel>
                                        <TabPanel className="px-2">
                                            <EmployeeGenericList formType={'Passport'} employeeID={ID} />
                                        </TabPanel>
                                        <TabPanel className="px-2">
                                            <EmployeeGenericList formType={'Visa'} employeeID={ID} />
                                        </TabPanel>
                                        <TabPanel className="px-2">
                                            <EmployeeGenericList formType={'I94'} employeeID={ID} />
                                        </TabPanel>
                                    </>
                                    )}
                                </Tabs>
                            </Box>
                        )}
                    </DialogPanel>
                </div>
            </Dialog>

            {/* <BootstrapDialog
                className=""
                onClose={handleClose}
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
                maxWidth={false}
            >
                <DialogTitle className="text-pink-600 w-60" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    {operation} {moduleName}: ID: {ID}
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
                    {apiLoading ? (
                        <div className="spinner"></div>
                    ) : (
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                                <TabList className="thirdTabsListHolder">
                                    <Tab>Metadata</Tab>
                                    {(moduleName !== "FILETYPES" && <>
                                        <Tab>Documents</Tab>
                                        <Tab>Relations</Tab>
                                    </>
                                    )}
                                    {(moduleName === "EMPLOYEES" && <>
                                        <Tab>Dependents</Tab>
                                        <Tab>Passports</Tab>
                                        <Tab>Visas</Tab>
                                        <Tab>I94s</Tab>
                                    </>
                                    )}
                                </TabList>

                                <TabPanel className="px-2">
                                    <TableContainer component={Paper}>
                                        <Table size="small" aria-label="a dense table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className='bg-gray-200'>Column</TableCell>
                                                    <TableCell className='bg-gray-300'>Value</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data.data.map((item, index) => (
                                                    Object.entries(item).map(([key, value]) => (
                                                        <TableRow key={`${index}-${key}`}>
                                                            <TableCell component="th" scope="row">
                                                                {key}
                                                            </TableCell>
                                                            <TableCell className='bg-gray-100'>
                                                                {value === true ? "YES" : value}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </TabPanel>

                                {(moduleName !== "FILETYPES" && <>
                                    <TabPanel className="px-2">
                                        <GenericFilesListSimple moduleId={ID} componentName={moduleName} />
                                    </TabPanel>
                                    <TabPanel className="px-2">
                                        Relations
                                    </TabPanel>
                                </>
                                )}
                                {(moduleName === "EMPLOYEES" && <>
                                    <TabPanel className="px-2">
                                        <EmployeeGenericList formType={'Dependent'} employeeID={ID} />
                                    </TabPanel>
                                    <TabPanel className="px-2">
                                        <EmployeeGenericList formType={'Passport'} employeeID={ID} />
                                    </TabPanel>
                                    <TabPanel className="px-2">
                                        <EmployeeGenericList formType={'Visa'} employeeID={ID} />
                                    </TabPanel>
                                    <TabPanel className="px-2">
                                        <EmployeeGenericList formType={'I94'} employeeID={ID} />
                                    </TabPanel>
                                </>
                                )}
                            </Tabs>
                        </Box>
                    )}
                </DialogContent>
            </BootstrapDialog> */}
        </>
    );
}

export default GenericDetails;
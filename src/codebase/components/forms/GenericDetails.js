import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import Stack from '@mui/material/Stack';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment } from '@mui/material'; // Added InputAdornment import
import SearchIcon from '@mui/icons-material/Search'; // Added SearchIcon import
import GenericFilesListSimple from '../forms/GenericFilesListSimple';
import EmployeeGenericList from '../employees/employeeGList';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import JobRatesList from '../jobs/jobRatesList'
import TimesheetDetails from '../timesheetentry/timesheetDetails';
import TimesheetCapturedHours from '../timesheetentry/capturedHours';
import TimesheetReminders from '../timesheets/timesheetReminders';

function GenericDetails({ ID, operation, doLoading, moduleName, timesheetNumber }) {
    const { APIPath, userType } = useContext(Context);
    const [open, setOpen] = React.useState(false);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
        if (operation === "View" || operation === "Edit") {
            getDetails();
        }
    };

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
            case 'JOBS':
                return APIPath + "/getjobdetails";
            case 'EXPENSETYPES':
                return APIPath + "/getexpensetypedetails";
            case 'FILETYPES':
                return APIPath + "/getfiletypedetails";
            case 'TODOS':
                return APIPath + "/gettododetails";
            case 'EXPENSES':
                return APIPath + "/getexpensedetails";
            case 'MY_TIMESHEETS':
                return APIPath + "/gettimesheetdetails";
            default:
                return '';
        }
    };

    const getDetails = () => {
        setApiLoading(true);
        let apiUrl = getAPIEndpoint() + "/" + ID;
        // console.log(apiUrl)
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
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

    const highlightKeys = ['ID', 'DISABLED', 'IMPORTANT', 'COMPLETED', 'SSN', 'EIN', 'IS', 'TIMESHEETNUMBER'];

    const filteredData = data.data.filter(item =>
        Object.entries(item).some(([key, value]) => {
            // // console.log("SEARCHED:" + searchTerm.toLowerCase())
            // // console.log("MATCHING:" + key)
            return key.toLowerCase().includes(searchTerm.toLowerCase())
        }
        )
    );

    return (
        <>
            <Stack direction="row" spacing={1}>
                <IconButton aria-label="Metadata" title="Metadata" color="primary" onClick={handleClickOpen}>
                    <ReadMoreIcon />
                </IconButton>
            </Stack>

            <Dialog open={open} onClose={() => handleClose(false)} className="relative z-50 flex w-full">
                <div className="fixed inset-1 w-full items-center justify-center p-20 bg-gray-700 bg-opacity-50 pt-20">
                    <DialogPanel className="space-y-4 bg-white p-1 px-2 border-gray-600 border-opacity-80 border-8 rounded-lg" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                        <DialogTitle className="font-bold text-lg">
                            {operation}
                            {timesheetNumber ?
                                <>
                                    - TIMESHEET ID: {timesheetNumber}
                                </>
                                :
                                <>
                                    - {moduleName}: ID: {ID}
                                </>
                            }
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 72,
                                top: 64,
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
                                        {((moduleName === "JOBS" && userType === "ADMIN") && <>
                                            <Tab>Historical Rates</Tab>
                                        </>
                                        )}
                                        {((moduleName !== "FILETYPES" && moduleName !== "EXPENSETYPES" && moduleName !== "JOBTYPES") && <>
                                            <Tab>Documents</Tab>
                                        </>
                                        )}
                                        {(moduleName === "MY_TIMESHEETS" && <>
                                            <Tab>Captured Hours</Tab>
                                            <Tab>Status, Notes</Tab>
                                            <Tab>Audit</Tab>
                                            <Tab>Reminders</Tab>
                                        </>
                                        )}
                                        {(moduleName === "EMPLOYEES" && <>
                                            <Tab>Dependents</Tab>
                                            {/* <Tab>Passports</Tab>
                                            <Tab>Visas</Tab>
                                            <Tab>I94s</Tab> */}
                                        </>
                                        )}
                                    </TabList>

                                    <TabPanel className="px-2">
                                        <TableContainer component={Paper}>
                                            <Table size="small" aria-label="Details table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className='bg-gray-200 max-w-[200px] items-center justify-center'>
                                                            <Stack direction={'row'} spacing={2}>
                                                                <TextField // Added TextField for search bar
                                                                    size="small"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    margin="dense"
                                                                    label="Search Column"
                                                                    value={searchTerm}
                                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                                    InputProps={{
                                                                        endAdornment: (
                                                                            <InputAdornment position="end">
                                                                                <SearchIcon />
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                    sx={{ marginLeft: 1 }}
                                                                />
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell className='bg-gray-400'>Value</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {filteredData.map((item, index) => (
                                                        Object.entries(item).map(([key, value]) => (
                                                            key.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                                            !((key.toUpperCase().includes('RATE') || key.toUpperCase().includes('DEDUCTION')) && userType !== 'ADMIN') && (
                                                                <TableRow key={`${index}-${key}`}>
                                                                    <TableCell component="th" scope="row" className="max-w-[200px]">
                                                                        <span className={`${highlightKeys.includes(key.toUpperCase()) || key.toLowerCase().includes('id') || key.toLowerCase().includes('is') ? 'rag-gray-bg px-2' : ''}`}>
                                                                            {key}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell className='bg-gray-100'>
                                                                        {(value === true || value === 1 && key !== "employeeID") ? (
                                                                            <span className="bg-red-500 text-white px-1 py-1 rounded">YES {value}</span>
                                                                        ) : (value === false || value === 0) ? (
                                                                            <span className="bg-green-500 text-white px-1 py-1 rounded">NO {value}</span>
                                                                        ) : (value === "Submitted") ? (
                                                                            <span className="bg-orange-400 text-white px-1 py-1 rounded">{value}</span>
                                                                        ) : (value === "Approved") ? (
                                                                            <span className="bg-green-500 text-white px-1 py-1 rounded">{value}</span>
                                                                        ) : (value === "SentBack") ? (
                                                                            <span className="bg-yellow-500 text-white px-1 py-1 rounded">{value}</span>
                                                                        ) : (
                                                                            value
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        ))
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </TabPanel>

                                    {((moduleName === "JOBS" && userType === "ADMIN") && <>
                                        <TabPanel className="px-2">
                                            <JobRatesList ratesDate={data ? data.RATES : []} />
                                        </TabPanel>
                                    </>
                                    )}
                                    {(moduleName !== "FILETYPES" && <>
                                        <TabPanel className="px-2">
                                            <GenericFilesListSimple moduleId={ID} componentName={moduleName === "MY_TIMESHEETS" ? "TIMESHEETS" : moduleName} />
                                        </TabPanel>
                                    </>
                                    )}
                                    {(moduleName === "MY_TIMESHEETS" && <>
                                        <TabPanel className="px-2">
                                            <TimesheetCapturedHours timesheetId={ID} />
                                        </TabPanel>
                                        <TabPanel className="px-2">
                                            <TimesheetDetails ID={ID} operation="View" doLoading={true} type="STATUS_NOTES" />
                                        </TabPanel>
                                        <TabPanel className="px-2">
                                            <TimesheetDetails ID={ID} operation="View" doLoading={true} type="AUDIT" />
                                        </TabPanel>
                                        <TabPanel className="px-2">
                                            <TimesheetReminders timesheetNumber={timesheetNumber} />
                                        </TabPanel>
                                    </>
                                    )}
                                    {(moduleName === "EMPLOYEES" && <>
                                        <TabPanel className="px-2">
                                            <EmployeeGenericList formType={'Dependent'} employeeID={ID} />
                                        </TabPanel>
                                        {/* <TabPanel className="px-2">
                                            <EmployeeGenericList formType={'Passport'} employeeID={ID} />
                                        </TabPanel>
                                        <TabPanel className="px-2">
                                            <EmployeeGenericList formType={'Visa'} employeeID={ID} />
                                        </TabPanel>
                                        <TabPanel className="px-2">
                                            <EmployeeGenericList formType={'I94'} employeeID={ID} />
                                        </TabPanel> */}
                                    </>
                                    )}
                                </Tabs>
                            </Box>
                        )}
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}

export default GenericDetails;
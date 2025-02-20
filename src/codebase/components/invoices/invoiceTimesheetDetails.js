import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import Stack from '@mui/material/Stack';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Button } from '@mui/material'; // Added InputAdornment import
import SearchIcon from '@mui/icons-material/Search'; // Added SearchIcon import
import GenericFilesListSimple from '../forms/GenericFilesListSimple';
import TimesheetDetails from '../timesheetentry/timesheetDetails';
import TimesheetCapturedHours from '../timesheetentry/capturedHours';
import TimesheetReminders from '../timesheets/timesheetReminderHistory';

function InvoiceTimesheetDetails({ operation, doLoading, moduleName, timesheetNumber }) {
    const { APIPath, userType } = useContext(Context);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [ID, setTimesheetId] = useState('');

    const getAPIEndpoint = () => {
        switch (moduleName) {
            case 'JOBS':
                return APIPath + "/getjobdetails";
            case 'MY_TIMESHEETS':
                return APIPath + "/gettimesheetdetailsbynumber";
            default:
                return '';
        }
    };

    const getDetails = () => {
        setApiLoading(true);
        let apiUrl = getAPIEndpoint() + "/" + timesheetNumber;
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
                        setTimesheetId(result.data[0].Id)
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
    }, [timesheetNumber]);

    const highlightKeys = ['ID', 'DISABLED', 'IMPORTANT', 'COMPLETED', 'SSN', 'EIN', 'IS', 'TIMESHEETNUMBER'];

    const filteredData = data.data.filter(item =>
        Object.entries(item).some(([key, value]) => {
            return key.toLowerCase().includes(searchTerm.toLowerCase())
        }
        )
    );

    return (
        <>
            {apiLoading ? (
                <div className="spinner"></div>
            ) : (
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                        <TabList className="thirdTabsListHolder">
                            <Tab>Metadata</Tab>
                            <Tab>Documents</Tab>
                            <Tab>Captured Hours</Tab>
                            <Tab>Status, Notes</Tab>
                            <Tab>Audit</Tab>
                            <Tab>Reminders</Tab>
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
                        <TabPanel className="px-2">
                            <GenericFilesListSimple moduleId={ID} componentName={moduleName === "MY_TIMESHEETS" ? "TIMESHEETS" : moduleName} />
                        </TabPanel>
                        <TabPanel className="px-2">
                            <Stack direction="column" spacing={1}>
                                <div className='divTotalHours'>
                                    TOTAL HOURS: {filteredData[0].hours}
                                </div>
                                <GenericFilesListSimple moduleId={ID} componentName={moduleName === "MY_TIMESHEETS" ? "TIMESHEETS" : moduleName} />
                                <TimesheetCapturedHours timesheetId={ID} timesheetNumber={null} />
                            </Stack>
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

                    </Tabs>
                </Box>
            )}
        </>
    );
}

export default InvoiceTimesheetDetails;
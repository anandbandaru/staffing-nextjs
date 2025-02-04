import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import Stack from '@mui/material/Stack';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment } from '@mui/material'; // Added InputAdornment import
import SearchIcon from '@mui/icons-material/Search'; // Added SearchIcon import
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

function TimesheetDetails({ ID, operation, doLoading }) {
    const { APIPath, userType } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [dataAudit, setDataAudit] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const getAdminDetails = () => {
        setApiLoading(true);
        let apiUrl = APIPath + "/gettimesheetadmindetails" + "/" + ID;
        // console.log(apiUrl)
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
    const getAuditDetails = () => {
        setApiLoading(true);
        let apiUrl = APIPath + "/gettimesheetauditdetails" + "/" + ID;
        // console.log(apiUrl)
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        setDataAudit({ data: [] });
                    } else {
                        setDataAudit(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setDataAudit({ data: [] });
                    setApiLoading(false);
                }
            );
    };

    useEffect(() => {
        if (doLoading) {
            if (operation === "View" || operation === "Edit") {
                getAdminDetails();
                getAuditDetails();
            }
        }
    }, [ID]);

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
                                                    {(value === "Submitted") ? (
                                                        <span className="bg-red-500 text-white px-1 py-1 rounded">YES</span>
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

                    <div >
                        <VerticalTimeline>
                            {dataAudit.data.map((entry, index) => (
                                <VerticalTimelineElement
                                    key={index}
                                    date={entry.actionDate}
                                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                                >
                                    <h3 className="vertical-timeline-element-title">Event {index + 1}</h3>
                                    <h4 className="vertical-timeline-element-subtitle">By: {entry.action}</h4>
                                    <p>Action: {entry.action}</p>
                                </VerticalTimelineElement>
                            ))}
                        </VerticalTimeline>
                    </div>
                </Box>

            )}
        </>
    );
}

export default TimesheetDetails;
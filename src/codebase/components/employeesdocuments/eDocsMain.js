import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import configData from "../../../CONFIG_RELEASE.json";
import axios from 'axios';
import './eDocsMain.css';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import { Stack } from '@mui/material';
import SSN_Upload from './SSN_Upload';


const EmployeeDocumentsMain = () => {
    const { APIPath, userName, userEmployeeId } = useContext(Context);
    const [visaType, setVisaType] = useState('');
    const [sections, setSections] = useState([]);
    const [otherSections, setOtherSections] = useState([]);
    const [open, setOpen] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const [documentStatus, setDocumentStatus] = useState({});
    const [documentDates, setDocumentDates] = useState({});


    // Example components for different sections
    const SSNUploadComponent = () => <div className='bg-yellow-200'><SSN_Upload userEmployeeId={userEmployeeId} /></div>;
    const PassportUploadComponent = () => <div className='bg-yellow-200'>Passport Upload Component</div>;
    const W4UploadComponent = () => <div className='bg-yellow-200'>W4 Upload Component</div>;
    const I20UploadComponent = () => <div className='bg-yellow-200'>I20 Upload Component</div>;
    const I94UploadComponent = () => <div className='bg-yellow-200'>I94 Upload Component</div>;

    const getDetails = async () => {
        setApiLoading(true);
        let apiUrl = APIPath + "/getemployeedetails/" + userEmployeeId;
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        setVisaType('');
                    } else {
                        setVisaType(result.data[0].VisaType);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setVisaType('');
                    setApiLoading(false);
                }
            )
    }

    const getEmployeeDocuments = async () => {
        setApiLoading(true);
        let apiUrl = APIPath + "/getemployeedocuments/" + userEmployeeId;
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        // Handle error
                    } else {
                        const status = {};
                        const dates = {};
                        result.data.forEach(doc => {
                            Object.keys(doc).forEach(key => {
                                if (key.endsWith('_Done')) {
                                    const code = key.replace('_Done', '');
                                    status[code] = doc[key];
                                    dates[code] = doc.createdDate;
                                }
                            });
                        });
                        setDocumentStatus(status);
                        setDocumentDates(dates);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setVisaType('');
                    setApiLoading(false);
                }
            )
    }

    useEffect(() => {
        const fetchData = async () => {
            await getDetails();
            await getEmployeeDocuments();
            const availableSections = configData.employeeDocumentSections;
            const availableOtherSections = configData.employeeDocumentOtherSections;
            const filteredSections = availableSections;
            //.filter(section => section !== visaType);
            setSections(filteredSections);
            setOtherSections(availableOtherSections);
        };
        fetchData();
    }, [visaType]);

    const handleOpen = (sectionCode) => {
        setSelectedSection(sectionCode);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const sectionComponents = {
        SSN: SSNUploadComponent,
        PASSPORT: PassportUploadComponent,
        W4: W4UploadComponent,
        I20: I20UploadComponent,
        I94: I94UploadComponent,
        // Add other mappings here
    }
    const SelectedComponent = selectedSection ? sectionComponents[selectedSection] : null;

    return (
        <div className="ownerMainHolder">
            <div className="subTabsHolder">
                <div className='sectionsDivider'>
                    Default sections
                </div>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: 70 }}>Status</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Fields</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sections.map((section, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ width: 70 }}>
                                            {documentStatus[section.code] ? (
                                                <CheckCircleIcon className="completed-icon" />
                                            ) : (
                                                <DoNotDisturbOnOutlinedIcon className="waiting-icon" />
                                            )}
                                        </TableCell>
                                        <TableCell>{section.name}</TableCell>
                                        <TableCell>
                                            {React.createElement(sectionComponents[section.code] || (() => <div>No Component</div>))}
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={2}>
                                                <Button size='small' variant="contained" onClick={() => handleOpen(section.code)}>Upload</Button>
                                                {documentStatus[section.code] && (
                                                    <Button size='small' variant="outlined">View</Button>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <div className='sectionsDivider'>
                    Other sections
                </div>
                <Box className="mt-10" sx={{ width: '100%', typography: 'body1' }}>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: 70 }}>Status</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Fields</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {otherSections.map((section, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ width: 70 }}>
                                            {documentStatus[section.code] ? (
                                                <CheckCircleIcon className="completed-icon" />
                                            ) : (
                                                <DoNotDisturbOnOutlinedIcon className="waiting-icon" />
                                            )}
                                        </TableCell>
                                        <TableCell>{section.name}</TableCell>
                                        <TableCell>
                                            {React.createElement(sectionComponents[section.code] || (() => <div>No Component</div>))}
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={2}>
                                                <Button size='small' variant="contained" onClick={() => handleOpen(section.code)}>Upload</Button>
                                                {documentStatus[section.code] && (
                                                    <Button size='small' variant="outlined">View</Button>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box>
                    <h2 id="modal-title">Upload {selectedSection && sections.find(section => section.code === selectedSection).name} Document</h2>
                    {SelectedComponent && <SelectedComponent />}
                    <Button onClick={handleClose}>Close</Button>
                </Box>
            </Modal>
        </div>
    );
};

export default EmployeeDocumentsMain;
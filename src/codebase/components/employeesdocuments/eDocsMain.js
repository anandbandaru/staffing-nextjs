import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import configData from "../../../CONFIG_RELEASE.json";
import axios from 'axios';
import './eDocsMain.css';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import { Stack } from '@mui/material';

// Example components for different sections
const SSNUploadComponent = () => <div className='bg-yellow-200'>SSN Upload Component</div>;
const PassportUploadComponent = () => <div className='bg-yellow-200'>Passport Upload Component</div>;
const W4UploadComponent = () => <div className='bg-yellow-200'>W4 Upload Component</div>;
const I20UploadComponent = () => <div className='bg-yellow-200'>I20 Upload Component</div>;
const I94UploadComponent = () => <div className='bg-yellow-200'>I94 Upload Component</div>;

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
                    <Grid container spacing={1}>
                        {sections.map((section, index) => (
                            <Grid item xs={12} sm={3} md={6} lg={3} key={index}>
                                <Paper elevation={3} className="section-paper my-0 p-2 relative">
                                    {documentStatus[section.code] ? (
                                        <CheckCircleIcon className="completed-icon" />
                                    ) : (
                                        <DoNotDisturbOnOutlinedIcon className="waiting-icon" />
                                    )}
                                    <div className='sectionName mb-10'>{section.name}</div>
                                    <div className='sectionCode'>{section.code}</div>
                                    <div className='sectionStatus'>{section.status}</div>
                                    <Stack direction="row" spacing={2}>
                                        <Button variant="contained" onClick={() => handleOpen(section.code)}>Upload</Button>
                                        {documentStatus[section.code] && (
                                            <Button variant="outlined" >View</Button>
                                        )}
                                    </Stack>
                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="modal-title"
                                        aria-describedby="modal-description"
                                    >
                                        <Box>
                                            <h2 id="modal-title">Upload {section.name} Document</h2>
                                            {SelectedComponent && <SelectedComponent />}
                                            <Button onClick={handleClose}>Close</Button>
                                        </Box>
                                    </Modal>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <div className='sectionsDivider'>
                    Other sections
                </div>
                <Box className="mt-10" sx={{ width: '100%', typography: 'body1' }}>
                    <Grid container spacing={1}>
                        {otherSections.map((section, index) => (
                            <Grid item xs={12} sm={3} md={6} lg={3} key={index}>
                                <Paper elevation={3} className="section-paper my-0 p-2 relative">
                                    {documentStatus[section.code] ? (
                                        <CheckCircleIcon className="completed-icon" />
                                    ) : (
                                        <DoNotDisturbOnOutlinedIcon className="waiting-icon" />
                                    )}
                                    <div className='sectionName mb-10'>{section.name}</div>
                                    <div className='sectionCode'>{section.code}</div>
                                    <Stack direction="row" spacing={2}>
                                        <Button variant="contained" onClick={() => handleOpen(section.code)}>Upload</Button>
                                        {documentStatus[section.code] && (
                                            <Button variant="outlined" >View</Button>
                                        )}
                                    </Stack>
                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="modal-title"
                                        aria-describedby="modal-description"
                                    >
                                        <Box>
                                            <h2 id="modal-title">Upload {section.name} Document</h2>
                                            {SelectedComponent && <SelectedComponent />}
                                            <Button onClick={handleClose}>Close</Button>
                                        </Box>
                                    </Modal>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </div>
        </div>
    );
};

export default EmployeeDocumentsMain;
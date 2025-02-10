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

// Example components for different sections
const SSNUploadComponent = () => <div className='bg-yellow-200'>SSN Upload Component</div>;
const PassportUploadComponent = () => <div className='bg-yellow-200'>Passport Upload Component</div>;
const W4UploadComponent = () => <div className='bg-yellow-200'>W4 Upload Component</div>;
const I20UploadComponent = () => <div className='bg-yellow-200'>I20 Upload Component</div>;
const I94UploadComponent = () => <div className='bg-yellow-200'>I94 Upload  Component</div>;

const EmployeeDocumentsMain = () => {
    const { APIPath, userName, userEmployeeId } = useContext(Context);
    const [visaType, setVisaType] = useState('');
    const [sections, setSections] = useState([]);
    const [otherSections, setOtherSections] = useState([]);
    const [open, setOpen] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);  // Add this line);
    const [selectedSection, setSelectedSection] = useState(null);

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
                    }
                    else {
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

    useEffect(() => {
        const fetchData = async () => {
            await getDetails();
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
                                    <div className='sectionName mb-10'>{section.name}</div>
                                    <div className='sectionCode'>{section.code}</div>
                                    <Button variant="contained" onClick={() => handleOpen(section.code)}>Upload</Button>
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
                                    <div className='sectionName mb-10'>{section.name}</div>
                                    <div className='sectionCode'>{section.code}</div>
                                    <Button variant="contained" onClick={() => handleOpen(section.code)}>Upload</Button>
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

import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import configData from "../../../CONFIG_RELEASE.json";
import './eDocsMain.css';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import { Link, Stack } from '@mui/material';
import SSN_Upload from './SSN_Upload';
import EmployeeMetadata from '../employees/employeeMetadata';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';

const EmployeeDocumentsAdminChecklist = ({ userEmployeeId }) => {
    const { APIPath } = useContext(Context);
    const [visaType, setVisaType] = useState('');
    const [sections, setSections] = useState([]);
    const [open, setOpen] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const [documentStatus, setDocumentStatus] = useState({});

    //GET EMPLOYEE DOCS DETAILS
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
                        result.data.forEach(doc => {
                            Object.keys(doc).forEach(key => {
                                if (key.endsWith('_Done')) {
                                    const code = key.replace('_Done', '');
                                    if (doc[key]) {
                                        status[code] = doc[key];
                                    }
                                }
                            });
                        });
                        setDocumentStatus(prevStatus => ({ ...prevStatus, ...status }));
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setVisaType('');
                    setApiLoading(false);
                }
            )
    }

    const fetchData = async () => {
        await getEmployeeDocuments();
        const availableSections = configData.employeeDocumentSections;
        const filteredSections = availableSections;
        //.filter(section => section !== visaType);
        setSections(filteredSections);
    };

    useEffect(() => {
        fetchData();
    }, [visaType]);


    return (
        <div className="ownerMainHolder">
            {apiLoading ? <>
                <div className='spinner'></div>
            </> :
                <>
                    <div className="subTabsHolder">
                        <div className='sectionsDivider'>
                            Required Documents/Information
                        </div>
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ width: 70 }}>Status</TableCell>
                                            <TableCell>Name</TableCell>
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
                                                <TableCell>
                                                    {section.name}
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </div>
                </>
            }


        </div>
    );
};

export default EmployeeDocumentsAdminChecklist;
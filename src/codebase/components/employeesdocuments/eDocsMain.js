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
import { Stack } from '@mui/material';
import SSN_Upload from './SSN_Upload';
import EmployeeMetadata from '../employees/employeeMetadata';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import US_ID_DL_Upload from './US_ID_DL_Upload';
import PASSPORT_Upload from './PASSPORT_Upload';
import EmployeeGAddForm from '../employees/employeeGAddForm';
import EmployeeGenericList from '../employees/employeeGList';

const EmployeeDocumentsMain = () => {
    const { APIPath, userName, userEmployeeId } = useContext(Context);
    const [visaType, setVisaType] = useState('');
    const [sections, setSections] = useState([]);
    const [otherSections, setOtherSections] = useState([]);
    const [open, setOpen] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const [documentStatus, setDocumentStatus] = useState({});
    const [employeeData, setEmployeeData] = useState({});

    // Example components for different sections
    const US_ID_DLUploadComponent = () => <div><US_ID_DL_Upload userEmployeeId={userEmployeeId} operation="NEW" code="US_ID_DL" /></div>;
    const SSNUploadComponent = () => <div><SSN_Upload userEmployeeId={userEmployeeId} operation="NEW" code="SSN" /></div>;
    const PassportUploadComponent = () => <div><PASSPORT_Upload userEmployeeId={userEmployeeId} operation="NEW" code="PASSPORT" /></div>;
    const I94UploadComponent = () => <div>I94 Upload Component</div>;
    const ALL_I20SUploadComponent = () => <div>ALL_I20SUploadComponent Upload Component</div>;
    const I20UploadComponent = () => <div>I20UploadComponent Upload Component</div>;
    const W4UploadComponent = () => <div>W4 Upload Component</div>;
    const OPT_H4_CARDSUploadComponent = () => <div>OPT_H4_CARDSUploadComponent Upload Component</div>;
    const UNDER_GRAD_CERTUploadComponent = () => <div>UNDER_GRAD_CERTUploadComponent Upload Component</div>;
    const GRAD_CERTUploadComponent = () => <div>GRAD_CERTUploadComponent Upload Component</div>;
    const TENTH_INTERMEDIATEUploadComponent = () => <div>TENTH_INTERMEDIATEUploadComponent Upload Component</div>;
    const WORK_PERMITUploadComponent = () => <div>WORK_PERMITUploadComponent Upload Component</div>;
    const I9_FORMUploadComponent = () => <div>I9_FORMUploadComponent Upload Component</div>;
    const CONSENT_AGREEMENTUploadComponent = () => <div>CONSENT_AGREEMENTUploadComponent Upload Component</div>;
    const W4_FORMUploadComponent = () => <div>W4_FORMUploadComponent Upload Component</div>;
    const ADP_FORMUploadComponent = () => <div>ADP_FORMUploadComponent Upload Component</div>;
    const ADDITIONAL_DOCSUploadComponent = () => <div>ADDITIONAL_DOCSUploadComponent Upload Component</div>;

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
                        setEmployeeData(result.data[0]);
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

    const manualLoadData = async () => {
        await getEmployeeDocuments();
        const availableSections = configData.employeeDocumentSections;
        const availableOtherSections = configData.employeeDocumentOtherSections;
        const filteredSections = availableSections;
        //.filter(section => section !== visaType);
        setSections(filteredSections);
        setOtherSections(availableOtherSections);
    }

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

    useEffect(() => {
        fetchData();
    }, [visaType]);

    const sectionComponents = {
        US_ID_DL: US_ID_DLUploadComponent,
        SSN: SSNUploadComponent,
        PASSPORT: PassportUploadComponent,
        I94: I94UploadComponent,
        ALL_I20S: ALL_I20SUploadComponent,
        I20: I20UploadComponent,
        W4: W4UploadComponent,
        OPT_H4_CARDS: OPT_H4_CARDSUploadComponent,
        UNDER_GRAD_CERT: UNDER_GRAD_CERTUploadComponent,
        GRAD_CERT: GRAD_CERTUploadComponent,
        TENTH_INTERMEDIATE: TENTH_INTERMEDIATEUploadComponent,
        WORK_PERMIT: WORK_PERMITUploadComponent,
        I9_FORM: I9_FORMUploadComponent,
        CONSENT_AGREEMENT: CONSENT_AGREEMENTUploadComponent,
        W4_FORM: W4_FORMUploadComponent,
        ADP_FORM: ADP_FORMUploadComponent,
        ADDITIONAL_DOCS: ADDITIONAL_DOCSUploadComponent,
    }
    const SelectedComponent = selectedSection ? sectionComponents[selectedSection] : null;

    //For dialog MUI
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpen(false);
        manualLoadData();
    };
    const handleClickOpen = (sectionCode) => {
        setSelectedSection(sectionCode);
        setOpen(true);
    };
    const handleCloseView = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenView(false);
    };
    const handleClickOpenView = (sectionCode) => {
        setSelectedSection(sectionCode);
        setOpenView(true);
    };
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));

    //DEPENDENTS
    const [formType, setFormType] = React.useState('');
    const [openGenericForm, setOpenGenericForm] = React.useState(false);
    const [openGenericFormView, setOpenGenericFormView] = React.useState(false);
    const handleMenuItemClick = (type) => {
        setFormType(type);
        setOpenGenericForm(true);
    };
    const handleCloseGenericForm = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenGenericForm(false);
    };
    const handleMenuItemClickView = (type) => {
        setFormType(type);
        setOpenGenericFormView(true);
    };
    const handleCloseGenericFormView = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenGenericFormView(false);
    };

    return (
        <div className="ownerMainHolder">
            <div className="subTabsHolder">
                <EmployeeMetadata employee={employeeData} />
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
                                        {/* <TableCell>
                                            {React.createElement(sectionComponents[section.code] || (() => <div>No Component</div>))}
                                        </TableCell> */}
                                        <TableCell>
                                            <Stack direction="row" spacing={2}>
                                                <Button size='small' variant="contained" onClick={() => handleClickOpen(section.code)}>Upload</Button>
                                                {documentStatus[section.code] && (
                                                    <Button size='small' variant="outlined" onClick={() => handleClickOpenView(section.code)}>View</Button>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell sx={{ width: 70 }}></TableCell>
                                    <TableCell>Dependents Information</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={2}>
                                            <Button size='small' variant="contained" onClick={() => handleMenuItemClick('Dependent')} >Add</Button>
                                            <Button size='small' variant="outlined"  onClick={() => handleMenuItemClickView('Dependent')}>View</Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </div>

            <BootstrapDialog
                className="myFullScreenDialog"
                onClose={handleClose}
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle className="text-pink-600" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    Upload {selectedSection && sections.find(section => section.code === selectedSection).name} Document
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
                    {SelectedComponent && <SelectedComponent code={selectedSection} />}
                </DialogContent>
            </BootstrapDialog>

            <BootstrapDialog
                onClose={handleCloseView}
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={openView}
            >
                <DialogTitle className="text-pink-600" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    View {selectedSection && sections.find(section => section.code === selectedSection).name} Document
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseView}
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
                    {/* {SelectedComponent && <SelectedComponent code={selectedSection} />} */}
                </DialogContent>
            </BootstrapDialog>

            {/* DEPENDENT ADD */}
            <BootstrapDialog
                fullScreen
                className="myFullScreenDialog"
                onClose={handleCloseGenericForm}
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={openGenericForm}
            >
                <DialogTitle className="text-pink-600 w-60" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    {formType}: Employee: ID: {userEmployeeId}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseGenericForm}
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
                    <EmployeeGAddForm formType={formType} employeeID={userEmployeeId} />
                </DialogContent>
            </BootstrapDialog>
            {/* DEPENDENT VIEW */}
            <BootstrapDialog
                fullScreen
                className="myFullScreenDialog"
                onClose={handleCloseGenericFormView}
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={openGenericFormView}
            >
                <DialogTitle className="text-pink-600 w-60" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                    {formType}: Employee: ID: {userEmployeeId}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseGenericFormView}
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
                    <EmployeeGenericList formType={formType} employeeID={userEmployeeId} />
                </DialogContent>
            </BootstrapDialog>
        </div>
    );
};

export default EmployeeDocumentsMain;
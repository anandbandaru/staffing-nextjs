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
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import US_ID_DL_Upload from './US_ID_DL_Upload';
import PASSPORT_Upload from './PASSPORT_Upload';
import EmployeeGAddForm from '../employees/employeeGAddForm';
import EmployeeGenericList from '../employees/employeeGList';
import EmployeeDocumentsGenericList from './eDocsGList';
import I94_Upload from './I94_Upload';
import ALL_I20S_Upload from './ALL_I20S_Upload';
import OPT_H4_CARDS_Upload from './OPT_H4_CARDS_Upload'
import UNDER_GRAD_CERT_Upload from './UNDER_GRAD_CERT_Upload';
import GRAD_CERT_Upload from './GRAD_CERT_Upload';
import TENTH_INTERMEDIATE_Upload from './TENTH_INTERMEDIATE_Upload';

const EmployeeDocumentsMain = () => {
    const { APIPath, userEmployeeId } = useContext(Context);
    const [visaType, setVisaType] = useState('');
    const [sections, setSections] = useState([]);
    const [open, setOpen] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const [documentStatus, setDocumentStatus] = useState({});
    const [employeeData, setEmployeeData] = useState({});

    // Example components for different sections
    const UsIdDlUploadComponent = () => <div><US_ID_DL_Upload userEmployeeId={userEmployeeId} operation="NEW" code="US_ID_DL" /></div>;
    const SsnUploadComponent = () => <div><SSN_Upload userEmployeeId={userEmployeeId} operation="NEW" code="SSN" /></div>;
    const PassportUploadComponent = () => <div><PASSPORT_Upload userEmployeeId={userEmployeeId} operation="NEW" code="PASSPORT" /></div>;
    const I94UploadComponent = () => <div><I94_Upload userEmployeeId={userEmployeeId} operation="NEW" code="I94" /></div>;
    const AllI20sUploadComponent = () => <div><ALL_I20S_Upload userEmployeeId={userEmployeeId} operation="NEW" code="ALL_I20S" /></div>;
    const OptH4CardsUploadComponent = () => <div><OPT_H4_CARDS_Upload userEmployeeId={userEmployeeId} operation="NEW" code="OPT_H4_CARDS" /></div>;
    const UnderGradCertUploadComponent = () => <div><UNDER_GRAD_CERT_Upload  userEmployeeId={userEmployeeId} operation="NEW" code="UNDER_GRAD_CERT" /></div>;
    const GradCertUploadComponent = () => <div><GRAD_CERT_Upload userEmployeeId={userEmployeeId} operation="NEW" code="GRAD_CERT" /> </div>;
    const TenthIntermediateUploadComponent = () => <div><TENTH_INTERMEDIATE_Upload userEmployeeId={userEmployeeId} operation="NEW" code="TENTH_INTERMEDIATE"/></div>;
    const WorkPermitUploadComponent = () => <div>WORK_PERMITUploadComponent Upload Component</div>;
    const I9FormUploadComponent = () => <div>I9_FORMUploadComponent Upload Component</div>;
    const ConsentAgreementUploadComponent = () => <div>CONSENT_AGREEMENTUploadComponent Upload Component</div>;
    const W4FormUploadComponent = () => <div>W4_FORMUploadComponent Upload Component</div>;
    const AdpFormUploadComponent = () => <div>ADP_FORMUploadComponent Upload Component</div>;
    const AdditionalDocsUploadComponent = () => <div>ADDITIONAL_DOCSUploadComponent Upload Component</div>;

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
        const filteredSections = availableSections;
        //.filter(section => section !== visaType);
        setSections(filteredSections);
    }

    const fetchData = async () => {
        await getDetails();
        await getEmployeeDocuments();
        const availableSections = configData.employeeDocumentSections;
        const filteredSections = availableSections;
        //.filter(section => section !== visaType);
        setSections(filteredSections);
    };

    useEffect(() => {
        fetchData();
    }, [visaType]);

    const sectionComponents = {
        US_ID_DL: UsIdDlUploadComponent,
        SSN: SsnUploadComponent,
        PASSPORT: PassportUploadComponent,
        I94: I94UploadComponent,
        ALL_I20S: AllI20sUploadComponent,
        OPT_H4_CARDS: OptH4CardsUploadComponent,
        UNDER_GRAD_CERT: UnderGradCertUploadComponent,
        GRAD_CERT: GradCertUploadComponent,
        TENTH_INTERMEDIATE: TenthIntermediateUploadComponent,
        WORK_PERMIT: WorkPermitUploadComponent,
        I9_FORM: I9FormUploadComponent,
        CONSENT_AGREEMENT: ConsentAgreementUploadComponent,
        W4_FORM: W4FormUploadComponent,
        ADP_FORM: AdpFormUploadComponent,
        ADDITIONAL_DOCS: AdditionalDocsUploadComponent,
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
                                    <TableCell>Reference</TableCell>
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
                                            {section.refer && (
                                                <Link
                                                    href={section.refer}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    underline="none"
                                                >
                                                    <Button
                                                        size='small'
                                                        variant="outlined"
                                                        color="secondary"
                                                        startIcon={<InsertLinkOutlinedIcon />}
                                                    >
                                                        Download here
                                                    </Button>
                                                </Link>
                                            )}
                                        </TableCell>
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
                                    <TableCell sx={{ width: 70 }}>
                                        <SupervisorAccountOutlinedIcon className='mr-2' />
                                    </TableCell>
                                    <TableCell>Dependents Information</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={2}>
                                            <Button size='small' variant="outlined" onClick={() => handleMenuItemClickView('Dependent')}>View</Button>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={2}>
                                            <Button size='small' variant="contained" onClick={() => handleMenuItemClick('Dependent')} >Add</Button>
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

            {/* VIEW */}
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
                    <EmployeeDocumentsGenericList code={selectedSection} employeeID={userEmployeeId} />
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
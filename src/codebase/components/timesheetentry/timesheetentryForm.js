import React, { useState } from 'react';
import { Formik, FieldArray } from 'formik';
import { Button, Typography, Box, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TimesheetEntryDialog from './timesheetentryDialog';
import { differenceInDays } from 'date-fns';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TimesheetEntryMetadata from './timesheetentryMetadata';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import TimesheetAudit from '../timesheets/timesheetAudit';

const TimesheetEntryForm = ({ data, onFormSubmitSuccess }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTimesheet, setSelectedTimesheet] = useState(null);

    const handleOpenDialog = (timesheet) => {
        setSelectedTimesheet(timesheet);
        setOpenDialog(true);
    };

    const handleCloseDialog = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenDialog(false);
        setSelectedTimesheet(null);
    };

    //For dialog MUI
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));

    const uniqueJobNames = [...new Set(data.map(item => item.jobName))];

    const getStatusClassName = (status) => {
        switch (status) {
            case 'Rejected':
                return 'rag-red-bg badgeSpan';
            case 'Pending':
                return 'rag-orange-bg badgeSpan';
            case 'SentBack':
                return 'rag-yellow-bg badgeSpan';
            default:
                return 'badgeSpan';
        }
    };

    return (
        <Formik
            initialValues={{
                timesheets: data.map(item => ({
                    ...item,
                    hours: Array(differenceInDays(new Date(item.endDate), new Date(item.startDate)) + 1).fill('')
                }))
            }}
            onSubmit={(values) => {
                // Handle form submission
            }}
        >
            {formik => (
                <Box className='w-[1200px] md:w-[1000px] sm:w-[700px] m-0'>
                    <Tabs className='mt-4 rounded-md '>
                        <TabList className="timeTabsListHolder">
                            {uniqueJobNames.map((jobName, index) => (
                                <Tab key={index}>
                                    JOB: {jobName}
                                </Tab>
                            ))}
                        </TabList>
                        {uniqueJobNames.map((jobName, tabIndex) => {
                            const jobDetails = data.find(item => item.jobName === jobName);
                            return (
                                <TabPanel key={tabIndex} className="w-full bg-slate-200">

                                    <TimesheetEntryMetadata timesheet={jobDetails} />

                                    <FieldArray name="timesheets">
                                        {({ remove, push }) => (
                                            <Box
                                                className='p-4'
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                                    gap: 1,
                                                }}
                                            >
                                                {formik.values.timesheets
                                                    .filter(timesheet => timesheet.jobName === jobName)
                                                    .map((timesheet, index) => (
                                                        <div key={index} className='bg-slate-100 relative'>
                                                            <Card variant="outlined">
                                                                <CardContent key={index} className='bg-slate-100'>
                                                                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                                                        TIMESHEET ID
                                                                    </Typography>
                                                                    <div className='badgeSpan rag-graylight-bg absolute right-2 top-2' sx={{ color: 'text.secondary', fontSize: 11 }}>
                                                                        {timesheet.daysPending}
                                                                    </div>
                                                                    <Typography variant="h5" component="div">
                                                                        {timesheet.timesheetNumber}
                                                                    </Typography>
                                                                    <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                                                                        <span className={getStatusClassName(timesheet.status)}>{timesheet.status}</span>
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        <span className=''>Start Date: {timesheet.startDate}</span>
                                                                        <br />
                                                                        <span className=''>End Date: {timesheet.endDate}</span>
                                                                    </Typography>
                                                                </CardContent>
                                                                <div className='bg-blue-100 m-0'>
                                                                    <IconButton aria-label="SUBMIT" title="SUBMIT" color="primary"
                                                                        className='ml-2'
                                                                        onClick={() => handleOpenDialog(timesheet)}
                                                                    >
                                                                        <ExitToAppOutlinedIcon />
                                                                    </IconButton>
                                                                    <TimesheetAudit ID={timesheet.Id} timesheetNumber={timesheet.timesheetNumber} operation="View" doLoading={true} />
                                                                    
                                                                </div>
                                                            </Card>
                                                        </div>
                                                    ))}
                                            </Box>
                                        )}
                                    </FieldArray>
                                </TabPanel>
                            );
                        })}
                    </Tabs>
                    {selectedTimesheet && (
                        <BootstrapDialog
                            fullScreen
                            className="myFullScreenDialog"
                            onClose={handleCloseDialog}
                            TransitionComponent={Transition}
                            aria-labelledby="customized-dialog-title"
                            open={openDialog}
                        >
                            <DialogTitle className="text-pink-600 w-[900]" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                                Timesheet: {selectedTimesheet.timesheetNumber}
                            </DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseDialog}
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
                                <TimesheetEntryDialog
                                    timesheet={selectedTimesheet}
                                    onClose={handleCloseDialog}
                                    onFormSubmitSuccess={onFormSubmitSuccess}
                                />
                            </DialogContent>
                        </BootstrapDialog>
                    )}
                </Box>
            )}
        </Formik>
    );
};

export default TimesheetEntryForm;
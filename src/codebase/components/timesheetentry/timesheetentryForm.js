import React, { useState } from 'react';
import { Formik, FieldArray } from 'formik';
import { Button, Grid, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Stack, Dialog, DialogTitle, DialogContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TimesheetEntryDialog from './timesheetentryDialog';
import { format, addDays, differenceInDays } from 'date-fns';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const TimesheetEntryForm = ({ data }) => {
    const [expanded, setExpanded] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTimesheet, setSelectedTimesheet] = useState(null);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

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
                <Box className='w-[1200px] m-0'>
                    <Tabs className='mt-4 bg-slate-100 rounded-md w-[1200px]'>
                        <TabList className="timeTabsListHolder">
                            {uniqueJobNames.map((jobName, index) => (
                                <Tab key={index}>JOB: {jobName}</Tab>
                            ))}
                        </TabList>
                        {uniqueJobNames.map((jobName, tabIndex) => (
                            <TabPanel key={tabIndex} className="w-[1200px]">
                                <FieldArray name="timesheets">
                                    {({ remove, push }) => (
                                        <Grid container spacing={1}>
                                            {formik.values.timesheets
                                                .filter(timesheet => timesheet.jobName === jobName)
                                                .map((timesheet, index) => (
                                                    <Grid item xs={12} key={index} >
                                                        <Accordion expanded={expanded === index} onChange={handleAccordionChange(index)} className='w-full'>
                                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                                <Stack direction="row" spacing={1}>
                                                                    <span>
                                                                        TIMESHEET ID:
                                                                        {timesheet.timesheetNumber}
                                                                    </span>
                                                                    <span className='rag-red-bg badgeSpan'>{timesheet.status}</span>
                                                                    <span className='rag-blue-bg badgeSpan'>Start Date: {timesheet.startDate}</span>
                                                                    <span className='rag-blue-bg badgeSpan'>End Date: {timesheet.endDate}</span>
                                                                </Stack>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={() => handleOpenDialog(timesheet)}
                                                                >
                                                                    Open
                                                                </Button>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </Grid>
                                                ))}
                                        </Grid>
                                    )}
                                </FieldArray>
                            </TabPanel>
                        ))}
                    </Tabs>
                    {selectedTimesheet && (

                        <BootstrapDialog
                        fullWidth
                            onClose={handleCloseDialog}
                            TransitionComponent={Transition}
                            aria-labelledby="customized-dialog-title"
                            open={openDialog}
                        >
                            <DialogTitle className="text-pink-600" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                                Timesheet Entry
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
import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import './dashboard.css';
import axios from 'axios';
import { Stack, Grid, Card, CardContent, Typography, Skeleton, Button } from '@mui/material';
import SaveButton from '../button/saveButton';
import BorderInnerIcon from '@mui/icons-material/BorderInner';

const Dashboard = () => {
    const { APIPath, userType, isAPILoading, setIsAPILoading,
        setOpenDashboardAPIError,
        setDashboardAPIError } = useContext(Context);
    const [counts, setCounts] = useState({
        owners: 0,
        todos: 0,
        activetodos: 0,
        importantactivetodos: 0,
        completedtodos: 0,
        companies: 0,
        employees: 0,
        clients: 0,
        implementationpartners: 0,
        vendors: 0,
        jobs: 0,
        invoices: 0,
        payroll: 0,
        timesheets: 0,
        filetypes: 0,
        expensetypes: 0,
        jobtypes: 0,
        files: 0,
        storageusage: 0,
        storagelimit: 0,
        invoicesclosed: 0,
        invoicessaved: 0,
        timesheetsapproved: 0,
        timesheetsrejected: 0,
        timesheetssentback: 0,
        timesheetssubmitted: 0,
        receipts: 0,
    });

    const loadDashboardElements = () => {
        const fetchCounts = async () => {
            setIsAPILoading(true);
            const allEndpoints = [
                '/counts/owners',
                '/counts/todos',
                '/counts/activetodos',
                '/counts/importantactivetodos',
                '/counts/completedtodos',
                '/counts/companies',
                '/counts/employees',
                '/counts/clients',
                '/counts/implementationpartners',
                '/counts/vendors',
                '/counts/jobs',
                // '/counts/invoices',
                '/counts/expenses',
                // '/counts/payroll',
                // '/counts/timesheets',
                '/counts/filetypes',
                '/counts/expensetypes',
                '/counts/jobtypes',
                '/counts/files',
                '/counts/invoicesclosed',
                '/counts/invoicessaved',
                '/counts/timesheetsapproved',
                '/counts/timesheetsrejected',
                '/counts/timesheetssentback',
                '/counts/timesheetssubmitted',
                '/counts/receipts',
            ];
            // Filter endpoints based on userType
            const endpoints = allEndpoints.filter(endpoint => {
                if (userType !== 'ADMIN'
                    &&
                    (
                        endpoint.includes('owners')
                        || endpoint.includes('companies')
                        || endpoint.includes('expenses')
                        || endpoint.includes('payroll')
                        || endpoint.includes('invoicesclosed')
                        || endpoint.includes('invoicessaved')
                        || endpoint.includes('timesheetsapproved')
                        || endpoint.includes('timesheetsrejected')
                        || endpoint.includes('timesheetssentback')
                        || endpoint.includes('timesheetssubmitted')
                    )
                ) {
                    return false;
                }
                return true;
            });
            APICaller(endpoints);
        };
        fetchCounts();
    }

    const APICaller = async (endpoints) => {
        try {
            setIsAPILoading(true);
            // console.log("FINAL DASH ENDPOINTS: " + endpoints)
            const responses = await Promise.all(
                endpoints.map(
                    endpoint => axios.get(APIPath + endpoint, {
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        }
                    })
                        .then((res) => {
                            if (res.data.STATUS === "FAIL") {
                                setDashboardAPIError(res.data.ERROR.MESSAGE);
                                setOpenDashboardAPIError(true);
                                return {
                                    data: { total: 0 }
                                };
                            }
                            return res; // Return the response if status is not "FAIL"
                        })
                        .catch((error) => {
                            // console.log(`Error fetching ${endpoint}:`, error);
                            setOpenDashboardAPIError(true);
                            setDashboardAPIError(error);
                            return {
                                data: { total: 0 }
                            };
                        })
                )
            );

            const newCounts = responses.reduce((acc, response, index) => {
                const key = endpoints[index].split('/').pop();
                acc[key] = response.data.total;
                return acc;
            }, {});

            setCounts(newCounts);
        } catch (error) {
            // console.log('Error fetching counts:', error);
        } finally {
            setIsAPILoading(false);
        }
    }

    const renderCard = (title, count) => (
        <Card sx={{ minWidth: 75 }}>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 12 }}>
                    {title}
                </Typography>
                {isAPILoading ?
                    <Skeleton variant="circular" width={20} height={20} />
                    :
                    <div className='dashCardsCounts'>{count ? count : "-"}</div>
                }
            </CardContent>
        </Card >
    );

    useEffect(() => {
        loadDashboardElements();
    }, []);

    return (
        <>
            <SaveButton onClick={loadDashboardElements} startIcon={<BorderInnerIcon />} >
                Click to Fetch Data
            </SaveButton>
            <div className="my-5 mx-3">
                <Grid container spacing={1} className='p-5 mt-10 bg-slate-200'>
                    {userType === 'ADMIN' && (
                        <>
                            <Grid item md={1}>
                                {renderCard('Owners', counts.owners)}
                            </Grid>
                            <Grid item md={1}>
                                {renderCard('Companies', counts.companies)}
                            </Grid>
                        </>
                    )}
                    <Grid item md={1}>
                        {renderCard('employees', counts.employees)}
                    </Grid>
                    <Grid item md={1}>
                        {renderCard('Clients', counts.clients)}
                    </Grid>
                    <Grid item md={1}>
                        {renderCard('Impl. Partners', counts.implementationpartners)}
                    </Grid>
                    <Grid item md={1}>
                        {renderCard('Vendors', counts.vendors)}
                    </Grid>
                    <Grid item md={1}>
                        {renderCard('Files', counts.files)}
                    </Grid>
                    <Grid item md={1.6}>
                        <Card sx={{ minWidth: 155 }}>
                            <CardContent>
                                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 12 }}>
                                    To Dos
                                </Typography>
                                <Stack spacing={1} direction="row">
                                    {isAPILoading ? (
                                        <Skeleton variant="rectangular" width={210} height={20} />
                                    ) : (
                                        <>
                                            <div className='dashCardsCounts'>{counts.todos}</div>
                                            <div title='Active' className='dashCardsCounts bg-green-500 px-2'>{counts.activetodos}</div>
                                            <div title='Completed' className='dashCardsCounts bg-yellow-400 px-2'>{counts.completedtodos}</div>
                                            <div title='Active & Important' className='bg-red-500 px-2 text-white dashCardsCounts'>{counts.importantactivetodos}</div>
                                        </>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={2}>
                    </Grid>
                </Grid>
                <div className='mt-4 flex-0  bg-slate-200' >
                    <Grid container spacing={1} className='p-5 mt-10 bg-slate-200'>
                        <Grid item md={1}>
                            {renderCard('Jobs', counts.jobs)}
                        </Grid>
                        {userType === 'ADMIN' && (
                            <>
                                <Grid item md={1.1}>
                                    <Card sx={{ minWidth: 95 }}>
                                        <CardContent>
                                            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 12 }}>
                                                Invoices
                                            </Typography>
                                            <Stack spacing={1} direction="row">
                                                {isAPILoading ? (
                                                    <Skeleton variant="rectangular" width={110} height={20} />
                                                ) : (
                                                    <>
                                                        <div title='Saved' className='dashCardsCounts bg-yellow-500 px-2'>{counts.invoicessaved}</div>
                                                        <div title='Closed' className='dashCardsCounts bg-green-400 px-2'>{counts.invoicesclosed}</div>
                                                    </>
                                                )}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item md={1}>
                                    {renderCard('Expenses', counts.expenses)}
                                </Grid>
                                <Grid item md={1}>
                                    {renderCard('Payroll', counts.payroll)}
                                </Grid>
                                <Grid item md={1.6}>
                                    <Card sx={{ minWidth: 95 }}>
                                        <CardContent>
                                            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 12 }}>
                                                Timesheets
                                            </Typography>
                                            <Stack spacing={1} direction="row">
                                                {isAPILoading ? (
                                                    <Skeleton variant="rectangular" width={180} height={20} />
                                                ) : (
                                                    <>
                                                        <div title='Submitted' className='dashCardsCounts bg-yellow-500 px-2'>{counts.timesheetssubmitted}</div>
                                                        <div title='Sent Back' className='dashCardsCounts bg-red-600 px-2 text-white'>{counts.timesheetssentback}</div>
                                                        <div title='Rejected' className='dashCardsCounts bg-red-400 px-2'>{counts.timesheetsrejected}</div>
                                                        <div title='Approved' className='dashCardsCounts bg-green-400 px-2'>{counts.timesheetsapproved}</div>
                                                    </>
                                                )}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item md={1}>
                                    {renderCard('Receipts', counts.receipts)}
                                </Grid>
                            </>
                        )}
                    </Grid>
                </div>
                <div className='mt-4 flex-0  bg-slate-200' >
                    <Grid container spacing={1} className='p-5 mt-10 bg-slate-200'>
                        <Grid item md={1}>
                            {renderCard('File Types', counts.filetypes)}
                        </Grid>
                        <Grid item md={1}>
                            {renderCard('Expense Types', counts.expensetypes)}
                        </Grid>
                        <Grid item md={1}>
                            {renderCard('Job Types', counts.jobtypes)}
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
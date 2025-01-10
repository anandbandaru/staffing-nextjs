import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../../context/context";
import './dashboard.css';
import axios from 'axios';
import { Stack, Grid, Card, CardContent, Typography, Skeleton } from '@mui/material';

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
    });


    useEffect(() => {
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
                '/counts/files'
            ];
            // Filter endpoints based on userType
            const endpoints = allEndpoints.filter(endpoint => {
                if (userType !== 'ADMIN'
                    &&
                    (
                        endpoint.includes('owners')
                        || endpoint.includes('companies')
                        || endpoint.includes('invoices')
                        || endpoint.includes('expenses')
                        || endpoint.includes('payroll')
                        || endpoint.includes('timesheets')
                    )
                ) {
                    return false;
                }
                return true;
            });
            APICaller(endpoints);
        };
        fetchCounts();
    }, [APIPath, userType]);

    const APICaller = async (endpoints) => {
        try {
            setIsAPILoading(true);
            console.log("FINAL DASH ENDPOINTS: " + endpoints)
            const responses = await Promise.all(
                endpoints.map(
                    endpoint => axios.get(APIPath + endpoint)
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
                            console.log(`Error fetching ${endpoint}:`, error);
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
            console.log('Error fetching counts:', error);
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

    return (
        <>
            <div className="my-10 mx-3">
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
                            {/* <CardActions>
                        Something here
                    </CardActions> */}
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
                                <Grid item md={1}>
                                    {renderCard('Invoices', counts.invoices)}
                                </Grid>
                                <Grid item md={1}>
                                    {renderCard('Expenses', counts.expenses)}
                                </Grid>
                                <Grid item md={1}>
                                    {renderCard('Payroll', counts.payroll)}
                                </Grid>
                                <Grid item md={1}>
                                    {renderCard('Timesheets', counts.timesheets)}
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
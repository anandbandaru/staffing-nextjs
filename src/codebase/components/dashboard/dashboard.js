import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../../context/context";
import './dashboard.css';
import axios from 'axios';
import { Stack, Grid, Card, CardContent, Typography, Box, Chip, Skeleton } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined';

const Dashboard = () => {
    const { APIPath } = useContext(Context);
    const [apiLoading, setApiLoading] = useState(false);
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
        jobs: 0,
        invoices: 0,
        payroll: 0,
        timesheets: 0,
        filetypes: 0,
        expensetypes: 0,
        jobtypes:0,
        files: 0,
        storageusage: 0,
        storagelimit: 0,
    });

    useEffect(() => {
        const fetchCounts = async () => {
            setApiLoading(true);
            const endpoints = [
                '/counts/owners',
                '/counts/todos',
                '/counts/activetodos',
                '/counts/importantactivetodos',
                '/counts/completedtodos',
                '/counts/companies',
                '/counts/employees',
                '/counts/clients',
                '/counts/implementationpartners',
                // '/counts/jobs',
                // '/counts/invoices',
                // '/counts/payroll',
                // '/counts/timesheets',
                '/counts/filetypes',
                '/counts/expensetypes',
                '/counts/jobtypes',
                '/counts/files',
                '/counts/storagelimit',
                '/counts/storageusage'
            ];

            try {
                const responses = await Promise.all(
                    endpoints.map(endpoint => axios.get(APIPath + endpoint).catch(() => ({ data: { total: 0 } })))
                );

                const newCounts = responses.reduce((acc, response, index) => {
                    const key = endpoints[index].split('/').pop();
                    acc[key] = response.data.total;
                    return acc;
                }, {});

                setCounts(newCounts);
            } catch (error) {
                console.error('Error fetching counts:', error);
            } finally {
                setApiLoading(false);
            }
        };

        fetchCounts();
    }, [APIPath]);

    const renderCard = (title, count) => (
        <Card sx={{ minWidth: 75 }}>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 12 }}>
                    {title}
                </Typography>
                {apiLoading ?
                    <Skeleton variant="circular" width={20} height={20} />
                    :
                    <div className='dashCardsCounts'>{count}</div>
                }
            </CardContent>
            {/* <CardActions>
                Something here
            </CardActions> */}
        </Card>
    );

    return (
        <>
            <div className="my-10">

            </div>
            <Grid container spacing={1} className='p-5 mt-10 bg-slate-200'>
                <Grid item md={1}>
                    {renderCard('Owners', counts.owners)}
                </Grid>
                <Grid item md={1.6}>
                    <Card sx={{ minWidth: 155 }}>
                        <CardContent>
                            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 12 }}>
                                To Dos
                            </Typography>
                            <Stack spacing={1} direction="row">
                                {apiLoading ? (
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
                <Grid item md={1}>
                    {renderCard('Companies', counts.companies)}
                </Grid>
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
                    {renderCard('Jobs', counts.jobs)}
                </Grid>
                <Grid item md={1}>
                    {renderCard('Invoices', counts.invoices)}
                </Grid>
                <Grid item md={1}>
                    {renderCard('Payroll', counts.payroll)}
                </Grid>
                <Grid item md={1}>
                    {renderCard('Timesheets', counts.timesheets)}
                </Grid>
                <Grid item md={1}>
                    {renderCard('File Types', counts.filetypes)}
                </Grid>
                <Grid item md={1}>
                    {renderCard('Expense Types', counts.expensetypes)}
                </Grid>
                <Grid item md={1}>
                    {renderCard('Job Types', counts.jobtypes)}
                </Grid>
                <Grid item md={1}>
                    {renderCard('Files', counts.files)}
                </Grid>
                <Grid item md={2}>
                </Grid>
            </Grid>
            <div className='mt-4 flex-0 p-5 bg-slate-200' >
                <Card sx={{ maxWidth: 280 }} >
                    <CardContent className='mt-0'>
                        <Stack className='mt-0' spacing={2} direction={"row"}>
                            <div className='flex justify-center items-center border-r-2 border-red-500 pr-2'>
                                <AddToDriveOutlinedIcon fontSize='large' className="h-36" />
                            </div>
                            <div className='pr-2'>
                                <Typography component="div">
                                    Google Drive Storage Utilization
                                </Typography>
                                {apiLoading
                                    ?
                                    <Skeleton variant="circular" width={20} height={20} />
                                    :
                                    <>
                                        <Stack className='mt-3' spacing={2} direction={"row"}>
                                            <Chip label={`LIMIT: ${counts.storagelimit} GB`} color="primary" variant="outlined" size="small"></Chip>
                                            <Chip label={`USAGE: ${counts.storageusage.toFixed(2)} GB`} color="error" variant="outlined" size="small"></Chip>
                                        </Stack>
                                        <Box mt={1} spacing="2">
                                            <LinearProgress className='gDriveProgress' variant="determinate" value={(counts.storageusage / counts.storagelimit) * 100} />
                                        </Box>
                                    </>
                                }
                            </div>
                        </Stack>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default Dashboard;
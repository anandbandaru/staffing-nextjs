import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

const EmployeeMetadata = ({ employee }) => {

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    return (
                <div>
                    <Stack direction="row" spacing={1} className='mt-4 mb-4'>
                        
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Title</StyledTableCell>
                                        <StyledTableCell align="right">Value</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">ID</TableCell>
                                        <TableCell align="right">{employee.Id}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">First Name</TableCell>
                                        <TableCell align="right">{employee.firstName}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">Last Name</TableCell>
                                        <TableCell align="right">{employee.lastName}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">VisaType</TableCell>
                                        <TableCell align="right">
                                            <span className='badgeSpan rag-blue-bg'>{employee.VisaType}</span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">Address</TableCell>
                                        <TableCell align="right">
                                        <span className=''>{employee.address}</span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Title</StyledTableCell>
                                        <StyledTableCell align="right">Value</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">Employee Type</TableCell>
                                        <TableCell align="right">{employee.employeeType}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">Personal Email</TableCell>
                                        <TableCell align="right">{employee.personalEmail}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">Personal US Phone</TableCell>
                                        <TableCell align="right">{employee.personalUSPhone}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">Personal Phone</TableCell>
                                        <TableCell align="right">{employee.personalPhone}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">Application Email</TableCell>
                                        <TableCell align="right">
                                        <span className=''>{employee.applicationEmail}</span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </div>
    );
};

export default EmployeeMetadata;
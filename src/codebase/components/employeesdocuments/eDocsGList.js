import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import CustomSnackbar from "../snackbar/snackbar";
import Alert from '@mui/material/Alert';
import { Button, Link } from '@mui/material';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';

function EmployeeDocumentsGenericList({ employeeID, code }) {
    const { APIPath } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(true);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const showSnackbar = (severity, message) => {
        setSnackbarSeverity(severity);
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const getDetails = () => {
        setApiLoading(true);
        let apiUrl = APIPath + "/getemployeedocumentsbycode/" + employeeID + "/" + code;
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.ERROR && result.ERROR.CODE !== "0") {
                        setData({ data: [] });
                        showSnackbar('error', result.ERROR.MESSAGE);
                    } else {
                        setData(result);
                        showSnackbar('success', code + " Data fetched");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({ data: [] });
                    setApiLoading(false);
                }
            );
    };

    useEffect(() => {
        getDetails();
    }, [employeeID, code]);

    return (
        <>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            {apiLoading ? (
                <div className="spinner"></div>
            ) : (
                <>
                    {data.data.length > 0 ? (
                        <div>
                            <table className="min-w-full bg-white border border-gray-200 text-left">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">TYPE</th>
                                        <th className="py-2 px-4 border-b">File</th>
                                        {code === 'US_ID_DL' && (
                                            <>
                                                <th className="py-2 px-4 border-b">ID Number</th>
                                                <th className="py-2 px-4 border-b">Expiry Date</th>
                                            </>
                                        )}
                                        {code === 'SSN' && (
                                            <>
                                                <th className="py-2 px-4 border-b">SSN</th>
                                            </>
                                        )}
                                        {code === 'ALL_I20S' && (
                                            <>
                                                <th className="py-2 px-4 border-b">SevisNumber</th>
                                            </>
                                        )}
                                        {code === 'OPT_H4_CARDS' && (
                                            <>
                                                <th className="py-2 px-4 border-b">ID Number</th>
                                                <th className="py-2 px-4 border-b">Start Date</th>
                                                <th className="py-2 px-4 border-b">End Date</th>
                                            </>
                                        )}
                                        {code === 'I94' && (
                                            <>
                                                <th className="py-2 px-4 border-b">Number</th>
                                                <th className="py-2 px-4 border-b">Expiry Date</th>
                                            </>
                                        )}
                                        {code === 'PASSPORT' && (
                                            <>
                                                <th className="py-2 px-4 border-b">ID Number</th>
                                                <th className="py-2 px-4 border-b">Issue Date</th>
                                                <th className="py-2 px-4 border-b">Expiry Date</th>
                                            </>
                                        )}
                                        {code === 'WORK_PERMIT' && (
                                            <>
                                            <th className="py-2 px-4 border-b">Type</th>
                                            <th className="py-2 px-4 border-b">Expiry Date</th>
                                            </>
                                        )}
                                        <th className="py-2 px-4 border-b">Created By</th>
                                        <th className="py-2 px-4 border-b">Created Date</th>
                                        <th className="py-2 px-4 border-b">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map(item => (
                                        <tr key={item.Id}>
                                            <td className="py-2 px-4 border-b border-r">{item.code}</td>
                                            <td className="py-2 px-4 border-b border-r">
                                                <Link className='float-right'
                                                    href={item.gDriveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    underline="none"
                                                >
                                                    <Button
                                                        size='small'
                                                        variant="contained"
                                                        color="info"
                                                        startIcon={<InsertLinkOutlinedIcon />}
                                                    >
                                                        Open
                                                    </Button>
                                                </Link>
                                            </td>
                                            {code === 'US_ID_DL' && (
                                                <>
                                                    <td className="py-2 px-4 border-b border-r">{item.US_ID_DL_IDNumber}</td>
                                                    <td className="py-2 px-4 border-b border-r">{item.US_ID_DL_ExpiryDate}</td>
                                                </>
                                            )}
                                            {code === 'SSN' && (
                                                <>
                                                    <td className="py-2 px-4 border-b border-r">{item.SSN_IDNumber}</td>
                                                </>
                                            )}
                                            {code === 'ALL_I20S' && (
                                                <>
                                                    <td className="py-2 px-4 border-b border-r">{item.ALL_I20S_SevisNumber}</td>
                                                </>
                                            )}
                                            {code === 'OPT_H4_CARDS' && (
                                                <>
                                                    <td className="py-2 px-4 border-b border-r">{item.OPT_H4_CARDS_IDNumber}</td>
                                                    <td className="py-2 px-4 border-b border-r">{item.OPT_H4_CARDS_StartDate}</td>
                                                    <td className="py-2 px-4 border-b border-r">{item.OPT_H4_CARDS_EndDate}</td>
                                                </>
                                            )}
                                            {code === 'I94' && (
                                                <>
                                                    <td className="py-2 px-4 border-b border-r">{item.I94_IDNumber}</td>
                                                    <td className="py-2 px-4 border-b border-r">{item.I94_ExpiryDate}</td>
                                                </>
                                            )}
                                            {code === 'PASSPORT' && (
                                                <>
                                                <td className="py-2 px-4 border-b border-r">{item.PASSPORT_IDNumber}</td>
                                                <td className="py-2 px-4 border-b border-r">{item.PASSPORT_IssueDate}</td>
                                                <td className="py-2 px-4 border-b border-r">{item.PASSPORT_ExpiryDate}</td>
                                                </>
                                            )}
                                            {code === 'WORK_PERMIT' && (
                                                <>
                                                    <td className="py-2 px-4 border-b border-r">{item.WORK_PERMIT_Type}</td>
                                                    <td className="py-2 px-4 border-b border-r">{item.WORK_PERMIT_ExpiryDate}</td>
                                                </>
                                            )}
                                            <td className="py-2 px-4 border-b border-r">{item.createdBy}</td>
                                            <td className="py-2 px-4 border-b border-r">{item.createdDate}</td>
                                            <td className="py-2 px-4 border-b border-r">{item.notes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <>
                            <Alert severity="warning">No {code} Data</Alert>
                        </>
                    )}
                </>
            )}
        </>
    );
}

export default EmployeeDocumentsGenericList;
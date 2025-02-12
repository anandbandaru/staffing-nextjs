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
                                        <th className="py-2 px-4 border-b">File</th>
                                        {code === 'SSN' && (
                                            <>
                                                <th className="py-2 px-4 border-b">SSN</th>
                                            </>
                                        )}
                                        {code === 'I94' && (
                                            <>
                                                <th className="py-2 px-4 border-b">I94 Number</th>
                                                <th className="py-2 px-4 border-b">I94 Expiry Date</th>
                                            </>
                                        )}
                                        <th className="py-2 px-4 border-b">Created By</th>
                                        <th className="py-2 px-4 border-b">Created Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map(item => (
                                        <tr key={item.Id}>
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
                                            {code === 'SSN' && (
                                                <>
                                                    <td className="py-2 px-4 border-b border-r">{item.SSN_IDNumber}</td>
                                                </>
                                            )}
                                            {code === 'I94' && (
                                                <>
                                                    <td className="py-2 px-4 border-b border-r">{item.i94Number}</td>
                                                    <td className="py-2 px-4 border-b border-r">{item.i94ExpiryDate}</td>
                                                </>
                                            )}
                                            <td className="py-2 px-4 border-b border-r">{item.createdBy}</td>
                                            <td className="py-2 px-4 border-b border-r">{item.createdDate}</td>
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
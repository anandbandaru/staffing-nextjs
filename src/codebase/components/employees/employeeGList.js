import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import CustomSnackbar from "../snackbar/snackbar";
import Alert from '@mui/material/Alert';

function EmployeeGenericList({ employeeID, formType }) {
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

    const getApiUrl = () => {
        switch (formType) {
            case 'Dependent':
                return `/getdependents/`;
            case 'Visa':
                return `/getvisas/`;
            case 'Passport':
                return `/getpassports/`;
            case 'I94':
                return `/geti94s/`;
            default:
                return '';
        }
    };

    const getDetails = () => {
        setApiLoading(true);
        let apiUrl = APIPath + getApiUrl() + employeeID;
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
                        showSnackbar('success', formType + " Data fetched");
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
    }, [employeeID, formType]);

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
                                        <th className="py-2 px-4 border-b">Id</th>
                                        {formType === 'Dependent' && (
                                            <>
                                                <th className="py-2 px-4 border-b">Full Name</th>
                                                <th className="py-2 px-4 border-b">Dependent Type</th>
                                            </>
                                        )}
                                        {formType === 'Visa' && (
                                            <>
                                                <th className="py-2 px-4 border-b">Visa Number</th>
                                                <th className="py-2 px-4 border-b">Visa Expiry Date</th>
                                                <th className="py-2 px-4 border-b">Visa Issue Date</th>
                                                <th className="py-2 px-4 border-b">Visa Type</th>
                                            </>
                                        )}
                                        {formType === 'Passport' && (
                                            <>
                                                <th className="py-2 px-4 border-b">Passport Number</th>
                                                <th className="py-2 px-4 border-b">Passport Expiry Date</th>
                                                <th className="py-2 px-4 border-b">Passport Issue Date</th>
                                            </>
                                        )}
                                        {formType === 'I94' && (
                                            <>
                                                <th className="py-2 px-4 border-b">I94 Number</th>
                                                <th className="py-2 px-4 border-b">I94 Expiry Date</th>
                                            </>
                                        )}
                                        <th className="py-2 px-4 border-b">Notes</th>
                                        <th className="py-2 px-4 border-b">Created By</th>
                                        <th className="py-2 px-4 border-b">Created Date</th>
                                        <th className="py-2 px-4 border-b">Modified By</th>
                                        <th className="py-2 px-4 border-b">Modified Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map(item => (
                                        <tr key={item.Id}>
                                            <td className="py-2 px-4 border-b border-r">{item.Id}</td>
                                            {formType === 'Dependent' && (
                                                <>
                                                    <td className="py-2 px-4 border-b border-r">{item.fullName}</td>
                                                    <td className="py-2 px-4 border-b border-r">{item.dependentType}</td>
                                                </>
                                            )}
                                            {formType === 'Visa' && (
                                                <>
                                                    <td className="py-2 px-4 border-b border-r">{item.visaNumber}</td>
                                                    <td className="py-2 px-4 border-b border-r">{item.visaExpiryDate}</td>
                                                    <td className="py-2 px-4 border-b border-r">{item.visaIssueDate}</td>
                                                    <td className="py-2 px-4 border-b border-r">{item.visaType}</td>
                                                </>
                                            )}
                                            {formType === 'Passport' && (
                                                <>
                                                    <td className="py-2 px-4 border-b border-r">{item.passportNumber}</td>
                                                    <td className="py-2 px-4 border-b border-r">{item.passportExpiryDate}</td>
                                                    <td className="py-2 px-4 border-b border-r">{item.passportIssueDate}</td>
                                                </>
                                            )}
                                            {formType === 'I94' && (
                                                <>
                                                    <td className="py-2 px-4 border-b border-r">{item.i94Number}</td>
                                                    <td className="py-2 px-4 border-b border-r">{item.i94ExpiryDate}</td>
                                                </>
                                            )}
                                            <td className="py-2 px-4 border-b border-r">{item.notes}</td>
                                            <td className="py-2 px-4 border-b border-r">{item.createdBy}</td>
                                            <td className="py-2 px-4 border-b border-r">{item.createdDate}</td>
                                            <td className="py-2 px-4 border-b border-r">{item.modifiedBy}</td>
                                            <td className="py-2 px-4 border-b border-r">{item.modifiedDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <>
                            <Alert severity="warning">No {formType} Data</Alert>
                        </>
                    )}
                </>
            )}
        </>
    );
}

export default EmployeeGenericList;
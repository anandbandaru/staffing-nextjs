import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import { Button, Link } from '@mui/material';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import CustomSnackbar from "../snackbar/snackbar";
import Alert from '@mui/material/Alert';

function GenericFilesListSimple({ ID, moduleId, componentName }) {
    const { APIPath } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(true);
    const [dataAPIError, setDataAPIError] = useState("");

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

    const getListOfFiles = () => {
        setApiLoading(true);
        let apiUrl = `${APIPath}/getfilesformoduleid/${componentName}/${moduleId}`;
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        setDataAPIError(`${result.error.code} - ${result.error.message}`);
                        setData({});
                        showSnackbar('error', result.error.message);
                    } else {
                        setData(result);
                        if (result.total === 0) {
                            setDataAPIError(result.total === 0 ? "No Documents information present." : "ok");
                        }
                        else {
                        }
                        showSnackbar('success', "Documents information fetched.");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    setDataAPIError("RequestData:On JUST error: API call failed");
                    setApiLoading(false);
                    showSnackbar('error', "Documents information Error.");
                }
            );
    };

    useEffect(() => {
        getListOfFiles();
    }, [moduleId]);

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
                    {data && data.data.length > 0 ? (
                        <div>
                            <table className="min-w-full bg-white border border-gray-200 text-left">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">File Id</th>
                                        <th className="py-2 px-4 border-b">Title</th>
                                        <th className="py-2 px-4 border-b">Created By</th>
                                        <th className="py-2 px-4 border-b">Created Date</th>
                                        <th className="py-2 px-4 border-b">Notes</th>
                                        <th className="py-2 px-4 border-b">File Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map(filteredFiles => (
                                        <tr key={filteredFiles.Id}>
                                            <td className="py-2 px-4 border-b border-r">{filteredFiles.Id}</td>
                                            <td className="py-2 px-4 border-b border-r">{filteredFiles.title}</td>
                                            <td className="py-2 px-4 border-b border-r">{filteredFiles.createdBy}</td>
                                            <td className="py-2 px-4 border-b border-r">{filteredFiles.createdDate}</td>
                                            <td className="py-2 px-4 border-b border-r">{filteredFiles.notes}</td>
                                            <td className="py-2 px-4 border-b border-r">
                                                <Link className='float-right'
                                                    href={filteredFiles.gDriveLink}
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <>
                            <Alert severity="warning">No Data: {dataAPIError}</Alert>
                        </>
                    )}
                </>
            )}
        </>
    );
}

export default GenericFilesListSimple;
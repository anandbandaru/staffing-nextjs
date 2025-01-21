import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import { Box, Card, CardContent, CardActions, Typography, Button, Link } from '@mui/material';
import AddToDriveSharpIcon from '@mui/icons-material/AddToDriveSharp';
import CustomSnackbar from "../snackbar/snackbar";
import Alert from '@mui/material/Alert';

function GenericFilesList({ ID, moduleId, componentName }) {
    const { APIPath } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(true);
    const [apiLoadingError, setApiLoadingError] = useState(false);
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
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        setDataAPIError(`${result.error.code} - ${result.error.message}`);
                        setData({});
                        setApiLoadingError(true);
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
                    setApiLoadingError(true);
                    showSnackbar('error', "Documents information Error.");
                }
            );
    };

    useEffect(() => {
        getListOfFiles();
    }, [moduleId]);

    const excludedColumns = ["module", "moduleId", "Id", "gDriveLink", "createdDate"];

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
                    {data ? (
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            {data.data.map((item, index) => (
                                <Card key={index} sx={{ marginBottom: 2 }}>
                                    <CardContent className='border-b-2 border-gray-400'>
                                        {Object.entries(item)
                                            .filter(([key]) => !excludedColumns.includes(key))
                                            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                                            .map(([key, value]) => (
                                                <Box key={key} sx={{ marginBottom: 1 }}>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        {key === "gDriveLink" ? "Document" : key}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {value === true ? "YES" : value}
                                                    </Typography>
                                                </Box>
                                            ))}
                                    </CardContent>
                                    {item.gDriveLink && (
                                        <CardActions>
                                            <Typography variant="body2" className='float-left'>
                                                CREATED ON: {item.createdDate}
                                            </Typography>
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
                                                    startIcon={<AddToDriveSharpIcon />}
                                                >
                                                    Open
                                                </Button>
                                            </Link>
                                        </CardActions>
                                    )}
                                </Card>
                            ))}
                        </Box>
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

export default GenericFilesList;
import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import { Box, Card, CardContent, CardActions, Typography, Button, Link } from '@mui/material';
import AddToDriveSharpIcon from '@mui/icons-material/AddToDriveSharp';

function OwnerDetails({ ID, moduleId, componentName }) {
    const { APIPath } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(true);
    const [apiLoadingError, setApiLoadingError] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");

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
                    } else {
                        setData(result);
                        setDataAPIError(result.total === 0 ? "No Documents information present." : "ok");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    setDataAPIError("RequestData:On JUST error: API call failed");
                    setApiLoading(false);
                    setApiLoadingError(true);
                }
            );
    };

    useEffect(() => {
        getListOfFiles();
    }, [moduleId]);

    const excludedColumns = ["module", "moduleId", "Id", "gDriveLink", "createdDate"];

    return (
        <>
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
                                            <Link  className='float-right'
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
                        <>{dataAPIError}</>
                    )}
                </>
            )}
        </>
    );
}

export default OwnerDetails;
import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import { Button, Link } from '@mui/material';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';

function GenericFilesListSimple({ ID, moduleId, componentName }) {
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

    return (
        <>
            {apiLoading ? (
                <div className="spinner"></div>
            ) : (
                <>
                    {data ? (
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
                        <>{dataAPIError}</>
                    )}
                </>
            )}
        </>
    );
}

export default GenericFilesListSimple;
import React, { useState, useEffect } from 'react';
import configData from "../../../CONFIG_RELEASE.json";
import Alert from '@mui/material/Alert';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import { Button, Link } from '@mui/material';

function GenericList({ formType }) {
    const [data, setData] = useState([]);

    const setDataAsperComponent = () => {
        console.log("PROVIDED:::" + formType);
        switch (formType) {
            case "jobTypes":
                setData(configData.jobTypes);
                console.log("setting jobTypes")
                break;
            case "employeeTypes":
                setData(configData.employeeTypes);
                console.log("setting employeeTypes")
                break;
            case "dependentTypes":
                setData(configData.dependentTypes);
                console.log("setting dependentTypes")
                break;
            case "visaTypes":
                setData(configData.visaTypes);
                console.log("setting visaTypes")
                break;
            case "GOOGLEDRIVE_FOLDERS":
                setData(configData.GOOGLEDRIVE_FOLDERS);
                console.log("setting GOOGLEDRIVE_FOLDERS")
                break;
            default:
                setData([]);
                console.log("setting empty")
                break
        }
    };
    useEffect(() => {
        setDataAsperComponent();
    }, [formType]);

    return (
        <>
            {data.length > 0 ? (
                <table className=" bg-white border border-gray-200 text-left">
                    <thead>
                        <tr>
                            {formType !== "GOOGLEDRIVE_FOLDERS" ?
                                <th className="py-6 px-4 border-b bg-slate-300">{formType}</th>
                                :
                                <>
                                    <th className="py-6 px-4 border-b bg-slate-300">{formType}</th>
                                    <th className="py-6 px-4 border-b bg-slate-300">Value</th>
                                    <th className="py-6 px-4 border-b bg-slate-300">Link</th>
                                </>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                {formType !== "GOOGLEDRIVE_FOLDERS" ?
                                    <td className="py-2 px-4 border-b border-r">
                                        {item.name}
                                    </td>
                                    :
                                    <>
                                        <td className="py-2 px-4 border-b border-r">
                                            {item.foldername}
                                        </td>
                                        <td className="py-2 px-4 border-b border-r">
                                            {item.folderid}
                                        </td>
                                        <td>
                                            <Link className='float-right'
                                                href={`https://drive.google.com/drive/u/1/folders/${item.folderid}`}
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
                                    </>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <>
                    <Alert severity="error">No configured item present.</Alert>
                </>
            )
            }
        </>
    );
}

export default GenericList;
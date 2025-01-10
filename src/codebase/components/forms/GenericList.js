import React, { useState, useEffect } from 'react';
import configData from "../../../CONFIG_RELEASE.json";
import Alert from '@mui/material/Alert';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import { Button, Link } from '@mui/material';

function GenericList({ formType }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            const dataMap = {
                jobTypes: configData.jobTypes,
                employeeTypes: configData.employeeTypes,
                dependentTypes: configData.dependentTypes,
                visaTypes: configData.visaTypes,
                timesheetsPeriods: configData.timesheetsPeriods,
                invoicePeriods: configData.invoicePeriods,
                GOOGLEDRIVE_FOLDERS: configData.GOOGLEDRIVE_FOLDERS,
                expenseCategories: configData.expenseCategories,
                currencyTypes: configData.currencyTypes
            };

            const selectedData = dataMap[formType] || [];
            setData(selectedData);
            console.log(`Setting data for ${formType}`);
        };

        fetchData();
    }, [formType]);

    return (
        <>
            {data.length > 0 ? (
                <table className="bg-white border border-gray-200 text-left">
                    <thead>
                        <tr>
                            <th className="py-6 px-4 border-b bg-slate-300">{formType}</th>
                            {formType === "GOOGLEDRIVE_FOLDERS" && (
                                <>
                                    <th className="py-6 px-4 border-b bg-slate-300">Value</th>
                                    <th className="py-6 px-4 border-b bg-slate-300">Link</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                {formType !== "GOOGLEDRIVE_FOLDERS" ? (
                                    <td className="py-2 px-4 border-b border-r">{item.name}</td>
                                ) : (
                                    <>
                                        <td className="py-2 px-4 border-b border-r">{item.foldername}</td>
                                        <td className="py-2 px-4 border-b border-r">{item.folderid}</td>
                                        <td>
                                            <Link
                                                className='float-right'
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
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <Alert severity="error">No configured item present.</Alert>
            )}
        </>
    );
}

export default GenericList;
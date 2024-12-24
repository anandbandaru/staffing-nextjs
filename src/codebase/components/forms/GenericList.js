import React, { useState, useContext, useEffect } from 'react';
import configData from "../../../CONFIG_RELEASE.json";
import Alert from '@mui/material/Alert';

function GenericList({ formType }) {
    const [data, setData] = useState( [] );

    const setDataAsperComponent = () => {
        console.log("PROVIDED:::" + formType);
        switch (formType) {
            case "jobTypes":
                setData(configData.jobTypes);
                console.log("setting jobTypes")
            case "employeeTypes":
                setData(configData.employeeTypes);
                console.log("setting employeeTypes")
            case "dependentTypes":
                setData(configData.dependentTypes);
                console.log("setting dependentTypes")
            case "visaTypes":
                setData(configData.visaTypes);
                console.log("setting visaTypes")
            default:
                setData([]);
                console.log("setting empty")
        }
    };
    useEffect(() => {
        setDataAsperComponent();
    }, [formType]);

    return (
        <>
            {data.length > 0 ? (
                <div>
                    <table className="min-w-full bg-white border border-gray-200 text-left">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Name</th>
                                {formType === 'Dependent' && (
                                    <>
                                        <th className="py-2 px-4 border-b">Full Name</th>
                                        <th className="py-2 px-4 border-b">Dependent Type</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.Id}>
                                    <td className="py-2 px-4 border-b border-r">{item.Name}</td>
                                    {formType === 'Dependent' && (
                                        <>
                                            <td className="py-2 px-4 border-b border-r">{item.fullName}</td>
                                            <td className="py-2 px-4 border-b border-r">{item.dependentType}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <>
                    <Alert severity="error">No configured item present.</Alert>
                </>
            )}
        </>
    );
}

export default GenericList;
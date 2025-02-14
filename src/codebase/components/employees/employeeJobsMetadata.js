import React from 'react';
import Alert from '@mui/material/Alert';

const EmployeeJobsMetadata = ({ employeeJobs }) => {

    return (
        <div>
            {employeeJobs.length > 0 ? (
                <div>
                    <table className="min-w-full bg-white border border-gray-200 text-left">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Job Name</th>
                                <th className="py-2 px-4 border-b">Job Title</th>
                                <th className="py-2 px-4 border-b">Job Start</th>
                                <th className="py-2 px-4 border-b">Job End</th>
                                <th className="py-2 px-4 border-b">Client Name</th>
                                <th className="py-2 px-4 border-b">Timesheets Period</th>
                                <th className="py-2 px-4 border-b">Invoice Period</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeJobs.map(item => (
                                <tr key={item.jobName}>
                                    <td className="py-2 px-4 border-b border-r">{item.jobName}</td>
                                    <td className="py-2 px-4 border-b border-r">{item.jobTitle}</td>
                                    <td className="py-2 px-4 border-b border-r">{item.jobStartDate}</td>
                                    <td className="py-2 px-4 border-b border-r">{item.jobEndDate}</td>
                                    <td className="py-2 px-4 border-b border-r">{item.Client}</td>
                                    <td className="py-2 px-4 border-b border-r">{item.timesheetsPeriod}</td>
                                    <td className="py-2 px-4 border-b border-r">{item.invoicePeriod}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <>
                    <Alert severity="warning">No Jobs Data</Alert>
                </>
            )}
        </div>
    );
};

export default EmployeeJobsMetadata;
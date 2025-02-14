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
                                <th className="px-4 py-1 bg-slate-700 text-white">Job Name</th>
                                <th className="px-4 bg-slate-700 text-white">Job Title</th>
                                <th className="px-4 bg-slate-700 text-white">Job Start</th>
                                <th className="px-4 bg-slate-700 text-white">Job End</th>
                                <th className="px-4 bg-slate-700 text-white">Client Name</th>
                                <th className="px-4 bg-slate-700 text-white">Timesheets Period</th>
                                <th className="px-4 bg-slate-700 text-white">Invoice Period</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeJobs.map(item => (
                                <tr key={item.jobName}>
                                    <td className="py-1 px-4 border-b border-r">{item.jobName}</td>
                                    <td className="py-1 px-4 border-b border-r">{item.jobTitle}</td>
                                    <td className="py-1 px-4 border-b border-r">{item.jobStartDate}</td>
                                    <td className="py-1 px-4 border-b border-r">{item.jobEndDate}</td>
                                    <td className="py-1 px-4 border-b border-r">{item.Client}</td>
                                    <td className="py-1 px-4 border-b border-r">{item.timesheetsPeriod}</td>
                                    <td className="py-1 px-4 border-b border-r">{item.invoicePeriod}</td>
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
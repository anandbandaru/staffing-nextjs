import React from 'react';

function JobRatesList({ ratesDate }) {
    return (
        <>
            {ratesDate.length > 0 ? (
                <div>
                    <table className="min-w-full bg-white border border-gray-200 text-left">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Id</th>
                                <th className="py-2 px-4 border-b">Job Id</th>
                                <th className="py-2 px-4 border-b">Rate</th>
                                <th className="py-2 px-4 border-b">Deduction Percentage</th>
                                <th className="py-2 px-4 border-b">Deduction Flat</th>
                                <th className="py-2 px-4 border-b">Notes</th>
                                <th className="py-2 px-4 border-b">Created By</th>
                                <th className="py-2 px-4 border-b">Created Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratesDate.map(item => (
                                <tr key={item.Id}>
                                    <td className="py-2 px-4 border-b border-r">{item.Id}</td>
                                    <td className="py-2 px-4 border-b border-r">{item.jobId}</td>
                                    <td className="py-2 px-4 border-b border-r">{item.rate}</td>
                                    <td className="py-2 px-4 border-b border-r">{item.deductionPercentage}</td>
                                    <td className="py-2 px-4 border-b border-r">{item.deductionFlat}</td>
                                    <td className="py-2 px-4 border-b border-r">{item.notesRate}</td>
                                    <td className="py-2 px-4 border-b border-r">{item.createdBy}</td>
                                    <td className="py-2 px-4 border-b border-r">{item.createdDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <>No historical rates present for this Job ID</>
            )}
        </>
    );
}

export default JobRatesList;
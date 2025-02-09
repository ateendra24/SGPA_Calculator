import React from 'react';

export default function SemesterTable({
    semesterNumber,
    subjects,
    marks,
    handleInputChange,
    totalCredits,
    sgpa,
    calculateSGPA
}) {
    return (
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-lg">
                    {semesterNumber}
                </span>
                Semester {semesterNumber}
            </h2>
            <table className="w-full mb-6 text-sm sm:text-base">
                <thead className="bg-[#3c66f3]">
                    <tr>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-white rounded-l-lg">Subject</th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-white">Internal</th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-white rounded-r-lg">External</th>
                    </tr>
                </thead>
                <tbody className="px-2 sm:px-3">
                    {subjects.map((subject, index) => (
                        <tr key={index} className="border-b border-gray-50">
                            <td className="py-2 sm:py-3 text-gray-800 font-medium text-sm">{subject}</td>
                            <td className="py-2 sm:py-3 pr-1 sm:pr-2">
                                <input
                                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="00"
                                    min="1"
                                    max="100"
                                    type="number"
                                    value={marks[index].internal}
                                    onChange={(e) => handleInputChange(index, "internal", e.target.value)}
                                />
                            </td>
                            <td className="py-2 sm:py-3 pl-1 sm:pl-2">
                                <input
                                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="00"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={marks[index].theory}
                                    onChange={(e) => handleInputChange(index, "theory", e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p className="text-gray-600 mb-2">Total Credits: {totalCredits}</p>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                <button
                    onClick={calculateSGPA}
                    className="w-full sm:w-auto text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium rounded-xl text-lg px-6 py-3 transition-colors duration-200"
                >
                    Calculate SGPA
                </button>
                <div className="text-xl sm:text-2xl font-bold text-gray-800">
                    SGPA: <span className="text-blue-600">{sgpa}</span>
                </div>
            </div>
        </div>
    );
} 
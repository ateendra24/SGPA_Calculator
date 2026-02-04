import React from 'react';

export default function SemesterTable({
    semesterNumber,
    subjects = [],
    marks = [],
    credits = [],
    handleInputChange,
    totalCredits,
    sgpa,
    calculateSGPA
}) {
    // Ensure marks array is properly sized
    const safeMarks = marks.length === subjects.length
        ? marks
        : subjects.map((_, index) => marks[index] || { internal: "", theory: "" });

    return (
        <div className="bg-white flex flex-col p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-xl">
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
                            <td className="py-2 sm:py-3 text-gray-800 font-medium text-sm">{subject} ({credits[index] || 0})</td>
                            <td className="py-2 sm:py-3 pr-1 sm:pr-2">
                                <input
                                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="00"
                                    min="1"
                                    max="100"
                                    type="number"
                                    value={safeMarks[index]?.internal || ""}
                                    onChange={(e) => handleInputChange(index, "internal", e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const inputs = Array.from(document.querySelectorAll("input[type='number']"));
                                            const index = inputs.indexOf(e.target);
                                            if (index > -1 && index < inputs.length - 1) {
                                                inputs[index + 1].focus();
                                            }
                                        }
                                    }}
                                />
                            </td>
                            <td className="py-2 sm:py-3 pl-1 sm:pl-2 relative">
                                <input
                                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="00"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={safeMarks[index]?.theory || ""}
                                    onChange={(e) => handleInputChange(index, "theory", e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const inputs = Array.from(document.querySelectorAll("input[type='number']"));
                                            const index = inputs.indexOf(e.target);
                                            if (index > -1 && index < inputs.length - 1) {
                                                inputs[index + 1].focus();
                                            }
                                        }
                                    }}
                                />
                                {(() => {
                                    const internal = parseInt(safeMarks[index]?.internal) || 0;
                                    const theory = parseInt(safeMarks[index]?.theory) || 0;
                                    if (internal === 0 && theory === 0) return null; // Don't show if empty

                                    const total = internal + theory;
                                    const thresholds = [40, 45, 50, 60, 70, 80, 90];
                                    let nextThreshold = null;

                                    for (const t of thresholds) {
                                        if (total < t) {
                                            if (t - total <= 2) {
                                                nextThreshold = t;
                                            }
                                            break;
                                        }
                                    }

                                    if (nextThreshold) {
                                        const diff = nextThreshold - total;
                                        return (
                                            <div className="absolute top-1/2 right-4 md:right-6 transform -translate-y-1/2 z-10 group">
                                                <div className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold border border-orange-200 cursor-help shadow-sm animate-pulse">
                                                    i
                                                </div>
                                                <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 hidden group-hover:block bg-orange-50 text-orange-700 text-[10px] sm:text-xs px-2 py-1 rounded shadow-md border border-orange-200 whitespace-nowrap z-20">
                                                    <span>⚠️ +{diff} marks for {nextThreshold}</span>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 mt-auto text-sm font-medium text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span>Total Credits: <span className="text-gray-900">{totalCredits}</span></span>
                {(() => {
                    const totalObtained = safeMarks.reduce((acc, curr) => acc + (parseInt(curr.internal) || 0) + (parseInt(curr.theory) || 0), 0);
                    // Assuming max marks per subject is 100 (which is implied by the inputs)
                    const totalMax = safeMarks.length * 100;
                    const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";

                    return (
                        <>
                            <span>Marks: <span className="text-gray-900">{totalObtained}</span>/{totalMax}</span>
                            <span>Percentage: <span className="text-blue-600">{percentage}%</span></span>
                        </>
                    );
                })()}
            </div>

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
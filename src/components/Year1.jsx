import React, { useState } from "react";

const subjects = [
    "Physics",
    "Maths-1",
    "Electrical",
    "PPS",
    "EVS",
    "Physics Lab",
    "Electrical Lab",
    "PPS Lab",
    "Graphics",
];
const subjects2 = [
    "Chemistry",
    "Maths-2",
    "Electronics",
    "Mechanical",
    "Soft Skills",
    "Chemistry Lab",
    "Electronics Lab",
    "English Lab",
    "Workshop",
];

const credits = [4, 4, 3, 3, 3, 1, 1, 1, 2]; // Credit values for each subject

function calculateGrade(totalMarks) {
    if (totalMarks >= 90) return 10;
    if (totalMarks >= 80) return 9;
    if (totalMarks >= 70) return 8;
    if (totalMarks >= 60) return 7;
    if (totalMarks >= 50) return 6;
    if (totalMarks >= 45) return 5;
    if (totalMarks >= 40) return 4;
    return 0;
}

function Year1() {
    const [marks, setMarks] = useState(
        subjects.map(() => ({ internal: "", theory: "" }))
    );
    const [sgpa, setSGPA] = useState(0);
    const [marks2, setMarks2] = useState(
        subjects2.map(() => ({ internal: "", theory: "" }))
    );
    const [sgpa2, setSGPA2] = useState(0);
    const [YGPA, setYGPA] = useState(0);

    const handleInputChange = (index, type, value) => {
        const newMarks = [...marks];
        newMarks[index] = { ...newMarks[index], [type]: parseInt(value) || 0 };
        setMarks(newMarks);
    };

    const calculateSGPA = () => {
        let totalCreditPoints = 0;
        let totalCredits = 0;

        marks.forEach((mark, index) => {
            const total = mark.internal + mark.theory;
            const grade = calculateGrade(total);
            const credit = credits[index];
            const creditPoints = grade * credit;

            totalCreditPoints += creditPoints;
            totalCredits += credit;
        });

        const sgpa = totalCreditPoints / totalCredits;
        setSGPA(sgpa.toFixed(2));
    };

    const handleInputChange2 = (index2, type2, value2) => {
        const newMarks2 = [...marks2];
        newMarks2[index2] = {
            ...newMarks2[index2],
            [type2]: parseInt(value2) || 0,
        };
        setMarks2(newMarks2);
    };

    const calculateSGPA2 = () => {
        let totalCreditPoints = 0;
        let totalCredits = 0;

        marks2.forEach((mark2, index) => {
            const total2 = mark2.internal + mark2.theory;
            const grade2 = calculateGrade(total2);
            const credit2 = credits[index];
            const creditPoints2 = grade2 * credit2;

            totalCreditPoints += creditPoints2;
            totalCredits += credit2;
        });

        const sgpa2 = totalCreditPoints / totalCredits;
        setSGPA2(sgpa2.toFixed(2));
    };

    const calculateYGPA = () => {
        const final = (parseFloat(sgpa) * 22 + parseFloat(sgpa2) * 22) / (22 + 22);
        setYGPA(final.toFixed(2));
    };

    return (
        <>
            <div id="container" className="flex flex-wrap gap-4 sm:gap-8 justify-center max-w-7xl mx-auto">
                <div id="box2" className="bg-white p-2 sm:p-4 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <span className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-lg">1</span>
                        Semester 1
                    </h2>
                    <table className="w-full mb-6">
                        <thead className="bg-[#3c66f3]">
                            <tr>
                                <th className="text-left py-3 px-4 text-white rounded-l-lg">Subject</th>
                                <th className="text-left py-3 px-4 text-white">Internal Marks</th>
                                <th className="text-left py-3 px-4 text-white rounded-r-lg">External Marks</th>
                            </tr>
                        </thead>
                        <tbody className="px-3">
                            {subjects.map((subject, index) => (
                                <tr key={index} className="border-b border-gray-50">
                                    <td className="py-3 text-gray-800 font-medium">{subject}</td>
                                    <td className="py-3">
                                        <input
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="00"
                                            min="1"
                                            max="100"
                                            type="number"
                                            value={marks[index].internal}
                                            onChange={(e) =>
                                                handleInputChange(index, "internal", e.target.value)
                                            }
                                        />
                                    </td>
                                    <td className="py-3">
                                        <input
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="00"
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={marks[index].theory}
                                            onChange={(e) =>
                                                handleInputChange(index, "theory", e.target.value)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <p >Total Credits: {credits.reduce((partialSum, a) => partialSum + a, 0)}</p>

                    <div className="flex items-center justify-between mt-2">
                        <button
                            onClick={calculateSGPA}
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium rounded-xl text-sm px-6 py-3 transition-colors duration-200"
                        >
                            Calculate SGPA
                        </button>
                        <div className="text-2xl font-bold text-gray-800">
                            SGPA: <span className="text-blue-600">{sgpa}</span>
                        </div>
                    </div>
                </div>

                <div id="box3" className="bg-white p-2 sm:p-4 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <span className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-lg">2</span>
                        Semester 2
                    </h2>
                    <table className="w-full mb-6">
                        <thead className="bg-[#3c66f3]">
                            <tr>
                                <th className="text-left py-3 px-4 text-white rounded-l-lg">Subject</th>
                                <th className="text-left py-3 px-4 text-white">Internal Marks</th>
                                <th className="text-left py-3 px-4 text-white rounded-r-lg">External Marks</th>
                            </tr>
                        </thead>
                        <tbody className="px-3">
                            {subjects2.map((subject2, index2) => (
                                <tr key={index2} className="border-b border-gray-50">
                                    <td className="py-3 text-gray-800 font-medium">{subject2}</td>
                                    <td className="py-3">
                                        <input
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="00"
                                            min="1"
                                            max="100"
                                            type="number"
                                            value={marks2[index2].internal}
                                            onChange={(e) =>
                                                handleInputChange2(index2, "internal", e.target.value)
                                            }
                                        />
                                    </td>
                                    <td className="py-3">
                                        <input
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="00"
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={marks2[index2].theory}
                                            onChange={(e) =>
                                                handleInputChange2(index2, "theory", e.target.value)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <p >Total Credits: {credits.reduce((partialSum, a) => partialSum + a, 0)}</p>

                    <div className="flex items-center justify-between mt-2">
                        <button
                            onClick={calculateSGPA2}
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium rounded-xl text-sm px-6 py-3 transition-colors duration-200"
                        >
                            Calculate SGPA
                        </button>
                        <div className="text-2xl font-bold text-gray-800">
                            SGPA: <span className="text-blue-600">{sgpa2}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div id="box4" className="flex flex-col justify-center items-center mt-8 sm:mt-12 w-full">
                <button
                    onClick={calculateYGPA}
                    className="w-full sm:w-auto text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium rounded-xl text-lg px-8 py-4 transition-all duration-200 transform hover:scale-105 mb-6 shadow-lg"
                >
                    Calculate YGPA
                </button>
                <div className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-3">
                    YGPA: <span className="text-red-600 bg-red-50 px-4 py-2 rounded-xl">{YGPA}</span>
                </div>
            </div>
        </>
    );
}

export default Year1;

import React, { useState } from "react";
import { YEAR_1, calculateGrade } from '../constants/data';
import SemesterTable from './SemesterTable';

function Year1() {
    const [marks1, setMarks1] = useState(
        YEAR_1.semester1.subjects.map(() => ({ internal: "", theory: "" }))
    );
    const [marks2, setMarks2] = useState(
        YEAR_1.semester2.subjects.map(() => ({ internal: "", theory: "" }))
    );
    const [sgpa1, setSgpa1] = useState(0);
    const [sgpa2, setSgpa2] = useState(0);
    const [ygpa, setYgpa] = useState(0);

    const handleInputChange = (index, type, value) => {
        const newMarks = [...marks1];
        newMarks[index] = { ...newMarks[index], [type]: parseInt(value) || 0 };
        setMarks1(newMarks);
    };

    const calculateSGPA = () => {
        let totalCreditPoints = 0;
        let totalCredits = 0;

        marks1.forEach((mark, index) => {
            const total = mark.internal + mark.theory;
            const grade = calculateGrade(total);
            const credit = YEAR_1.semester1.credits[index];
            const creditPoints = grade * credit;

            totalCreditPoints += creditPoints;
            totalCredits += credit;
        });

        const sgpa = totalCreditPoints / totalCredits;
        setSgpa1(sgpa.toFixed(2));
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
            const credit2 = YEAR_1.semester2.credits[index];
            const creditPoints2 = grade2 * credit2;

            totalCreditPoints += creditPoints2;
            totalCredits += credit2;
        });

        const sgpa2 = totalCreditPoints / totalCredits;
        setSgpa2(sgpa2.toFixed(2));
    };

    const calculateYGPA = () => {
        const final = (parseFloat(sgpa1) * 22 + parseFloat(sgpa2) * 22) / (22 + 22);
        setYgpa(final.toFixed(2));
    };

    return (
        <>
            <div className="flex flex-wrap gap-4 sm:gap-8 justify-center max-w-7xl mx-auto">
                <SemesterTable
                    semesterNumber={1}
                    subjects={YEAR_1.semester1.subjects}
                    marks={marks1}
                    handleInputChange={handleInputChange}
                    totalCredits={YEAR_1.semester1.credits.reduce((a, b) => a + b, 0)}
                    sgpa={sgpa1}
                    calculateSGPA={calculateSGPA}
                />
                <SemesterTable
                    semesterNumber={2}
                    subjects={YEAR_1.semester2.subjects}
                    marks={marks2}
                    handleInputChange={handleInputChange2}
                    totalCredits={YEAR_1.semester2.credits.reduce((a, b) => a + b, 0)}
                    sgpa={sgpa2}
                    calculateSGPA={calculateSGPA2}
                />
            </div>

            <div id="box4" className="flex flex-col justify-center items-center mt-8 sm:mt-12 w-full">
                <button
                    onClick={calculateYGPA}
                    className="w-full sm:w-auto text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium rounded-xl text-lg px-8 py-4 transition-all duration-200 transform hover:scale-105 mb-6 shadow-lg"
                >
                    Calculate YGPA
                </button>
                <div className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-3">
                    YGPA: <span className="text-red-600 bg-red-50 px-4 py-2 rounded-xl">{ygpa}</span>
                </div>
            </div>
        </>
    );
}

export default Year1;

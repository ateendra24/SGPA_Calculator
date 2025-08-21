import React, { useState, useEffect } from "react";
import { YEARS_DATA, calculateGrade } from '../constants/data';
import SemesterTable from './SemesterTable';

function YearComponent({ year }) {
    const yearData = YEARS_DATA[year];

    if (!yearData || !yearData.semester1 || !yearData.semester2) {
        return <div>Invalid year selected</div>;
    }

    // Validate data integrity
    if (yearData.semester1.subjects.length !== yearData.semester1.credits.length) {
        console.error(`Semester ${yearData.semester1.number}: subjects/credits length mismatch`,
            yearData.semester1.subjects.length, yearData.semester1.credits.length);
    }
    if (yearData.semester2.subjects.length !== yearData.semester2.credits.length) {
        console.error(`Semester ${yearData.semester2.number}: subjects/credits length mismatch`,
            yearData.semester2.subjects.length, yearData.semester2.credits.length);
    }


    // LocalStorage keys per year
    const storageKey = (field) => `sgpa_${year}_${field}`;

    // Load from localStorage or default
    const getInitial = (field, defaultValue) => {
        try {
            const val = localStorage.getItem(storageKey(field));
            if (val) return JSON.parse(val);
        } catch { }
        return defaultValue;
    };


    const [marks1, setMarks1] = useState(() => getInitial('marks1', yearData.semester1.subjects.map(() => ({ internal: "", theory: "" }))));
    const [marks2, setMarks2] = useState(() => getInitial('marks2', yearData.semester2.subjects.map(() => ({ internal: "", theory: "" }))));
    const [sgpa1, setSgpa1] = useState(() => getInitial('sgpa1', 0));
    const [sgpa2, setSgpa2] = useState(() => getInitial('sgpa2', 0));
    const [ygpa, setYgpa] = useState(() => getInitial('ygpa', 0));

    // Reset state when year changes
    useEffect(() => {
        setMarks1(getInitial('marks1', yearData.semester1.subjects.map(() => ({ internal: "", theory: "" }))));
        setMarks2(getInitial('marks2', yearData.semester2.subjects.map(() => ({ internal: "", theory: "" }))));
        setSgpa1(getInitial('sgpa1', 0));
        setSgpa2(getInitial('sgpa2', 0));
        setYgpa(getInitial('ygpa', 0));
    }, [year]);

    // Save to localStorage on change
    useEffect(() => { localStorage.setItem(storageKey('marks1'), JSON.stringify(marks1)); }, [marks1]);
    useEffect(() => { localStorage.setItem(storageKey('marks2'), JSON.stringify(marks2)); }, [marks2]);
    useEffect(() => { localStorage.setItem(storageKey('sgpa1'), JSON.stringify(sgpa1)); }, [sgpa1]);
    useEffect(() => { localStorage.setItem(storageKey('sgpa2'), JSON.stringify(sgpa2)); }, [sgpa2]);
    useEffect(() => { localStorage.setItem(storageKey('ygpa'), JSON.stringify(ygpa)); }, [ygpa]);

    const handleInputChange = (index, type, value) => {
        if (index < 0 || index >= marks1.length) return;
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
            const credit = yearData.semester1.credits[index] || 0;

            // Only include subjects with credits > 0 in SGPA calculation
            if (credit > 0) {
                const creditPoints = grade * credit;
                totalCreditPoints += creditPoints;
                totalCredits += credit;
            }
        });

        // Prevent division by zero
        const sgpa = totalCredits > 0 ? totalCreditPoints / totalCredits : 0;
        console.log(`Semester ${yearData.semester1.number}: totalCreditPoints=${totalCreditPoints}, totalCredits=${totalCredits}, SGPA=${sgpa}`);
        setSgpa1(sgpa.toFixed(2));
    };

    const handleInputChange2 = (index2, type2, value2) => {
        if (index2 < 0 || index2 >= marks2.length) return;
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
            const credit2 = yearData.semester2.credits[index] || 0;

            // Only include subjects with credits > 0 in SGPA calculation
            if (credit2 > 0) {
                const creditPoints2 = grade2 * credit2;
                totalCreditPoints += creditPoints2;
                totalCredits += credit2;
            }
        });

        // Prevent division by zero
        const sgpa2 = totalCredits > 0 ? totalCreditPoints / totalCredits : 0;
        console.log(`Semester ${yearData.semester2.number}: totalCreditPoints=${totalCreditPoints}, totalCredits=${totalCredits}, SGPA=${sgpa2}`);
        setSgpa2(sgpa2.toFixed(2));
    };

    const calculateYGPA = () => {
        // Calculate total credits for each semester (excluding zero credits)
        const semester1Credits = yearData.semester1.credits.filter(credit => credit > 0).reduce((a, b) => a + b, 0);
        const semester2Credits = yearData.semester2.credits.filter(credit => credit > 0).reduce((a, b) => a + b, 0);

        const totalCredits = semester1Credits + semester2Credits;

        // Prevent division by zero and ensure valid SGPA values
        if (totalCredits > 0 && !isNaN(parseFloat(sgpa1)) && !isNaN(parseFloat(sgpa2))) {
            const final = (parseFloat(sgpa1) * semester1Credits + parseFloat(sgpa2) * semester2Credits) / totalCredits;
            setYgpa(final.toFixed(2));
        } else {
            setYgpa("0.00");
        }
    }; return (
        <>
            <div className="flex flex-wrap gap-4 sm:gap-8 justify-center max-w-7xl mx-auto">
                <SemesterTable
                    semesterNumber={yearData.semester1.number}
                    subjects={yearData.semester1.subjects}
                    marks={marks1}
                    credits={yearData.semester1.credits}
                    handleInputChange={handleInputChange}
                    totalCredits={yearData.semester1.credits.filter(credit => credit > 0).reduce((a, b) => a + b, 0)}
                    sgpa={sgpa1}
                    calculateSGPA={calculateSGPA}
                />
                <SemesterTable
                    semesterNumber={yearData.semester2.number}
                    subjects={yearData.semester2.subjects}
                    marks={marks2}
                    credits={yearData.semester2.credits}
                    handleInputChange={handleInputChange2}
                    totalCredits={yearData.semester2.credits.filter(credit => credit > 0).reduce((a, b) => a + b, 0)}
                    sgpa={sgpa2}
                    calculateSGPA={calculateSGPA2}
                />
            </div>

            <div id="box4" className="flex flex-col justify-center items-center mt-8 sm:mt-12 w-full">
                <button
                    onClick={calculateYGPA}
                    className="w-[90%] sm:w-auto text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium rounded-xl text-lg px-8 py-4 transition-all duration-200 transform hover:scale-105 mb-6 shadow-lg"
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

export default YearComponent;

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { YEARS_DATA, calculateGrade } from "../constants/data";
import SemesterTable from "./SemesterTable";
import CgpaCalculator from "./CgpaCalculator";

// Helper to compute SGPA live from marks
const computeSGPA = (marks, semesterData) => {
    if (!marks || !semesterData || !semesterData.credits) return "0.00";
    let totalCreditPoints = 0;
    let totalCredits = 0;
    let hasMarks = false;

    marks.forEach((mark, index) => {
        if (!mark) return;
        const intVal = mark.internal;
        const thVal = mark.theory;
        if (intVal !== "" && intVal !== undefined && intVal !== null) hasMarks = true;
        if (thVal !== "" && thVal !== undefined && thVal !== null) hasMarks = true;

        const internal = parseInt(intVal) || 0;
        const theory = parseInt(thVal) || 0;
        const total = internal + theory;
        const subjectMax = semesterData.maxMarks?.[index] || 100;
        const normalizedTotal = (total / subjectMax) * 100;
        const grade = calculateGrade(normalizedTotal);
        const credit = semesterData.credits[index] || 0;

        if (credit > 0) {
            totalCreditPoints += grade * credit;
            totalCredits += credit;
        }
    });

    if (!hasMarks || totalCredits === 0) return "0.00";
    return (totalCreditPoints / totalCredits).toFixed(2);
};

// Helper to compute YGPA live from SGPA1 and SGPA2
const computeYGPA = (s1, s2, sem1Data, sem2Data) => {
    const s1Num = parseFloat(s1) || 0;
    const s2Num = parseFloat(s2) || 0;
    const sem1Credits = sem1Data.credits.filter((c) => c > 0).reduce((a, b) => a + b, 0);
    const sem2Credits = sem2Data.credits.filter((c) => c > 0).reduce((a, b) => a + b, 0);

    let totalPoints = 0;
    let totalCredits = 0;

    if (s1Num > 0) {
        totalPoints += s1Num * sem1Credits;
        totalCredits += sem1Credits;
    }
    if (s2Num > 0) {
        totalPoints += s2Num * sem2Credits;
        totalCredits += sem2Credits;
    }

    if (totalCredits === 0) return "0.00";
    return (totalPoints / totalCredits).toFixed(2);
};

function YearComponent({ year }) {
    const yearData = YEARS_DATA[year];

    if (!yearData || !yearData.semester1 || !yearData.semester2) {
        return <div>Invalid year selected</div>;
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

    const [marks1, setMarks1] = useState(() =>
        getInitial("marks1", yearData.semester1.subjects.map(() => ({ internal: "", theory: "" })))
    );
    const [marks2, setMarks2] = useState(() =>
        getInitial("marks2", yearData.semester2.subjects.map(() => ({ internal: "", theory: "" })))
    );

    const [sgpa1, setSgpa1] = useState(() => computeSGPA(marks1, yearData.semester1));
    const [sgpa2, setSgpa2] = useState(() => computeSGPA(marks2, yearData.semester2));
    const [ygpa, setYgpa] = useState(() =>
        computeYGPA(
            computeSGPA(marks1, yearData.semester1),
            computeSGPA(marks2, yearData.semester2),
            yearData.semester1,
            yearData.semester2
        )
    );

    const [cgpaInfo, setCgpaInfo] = useState("");
    const confettiFired = useRef({ s1: false, s2: false });

    // Handle year change
    useEffect(() => {
        const loadedMarks1 = getInitial(
            "marks1",
            yearData.semester1.subjects.map(() => ({ internal: "", theory: "" }))
        );
        const loadedMarks2 = getInitial(
            "marks2",
            yearData.semester2.subjects.map(() => ({ internal: "", theory: "" }))
        );
        const computedS1 = computeSGPA(loadedMarks1, yearData.semester1);
        const computedS2 = computeSGPA(loadedMarks2, yearData.semester2);

        setMarks1(loadedMarks1);
        setMarks2(loadedMarks2);
        setSgpa1(computedS1);
        setSgpa2(computedS2);
        setYgpa(computeYGPA(computedS1, computedS2, yearData.semester1, yearData.semester2));
        confettiFired.current = { s1: false, s2: false };
    }, [year]);

    // Live auto-calculate SGPA1 when marks1 change
    useEffect(() => {
        const s1 = computeSGPA(marks1, yearData.semester1);
        setSgpa1(s1);

        // Optional celebration when complete semester has high score
        const s1Num = parseFloat(s1) || 0;
        const allFilled = marks1.every((m) => m.internal !== "" && m.theory !== "");
        if (allFilled && s1Num >= 8.5 && !confettiFired.current.s1) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            confettiFired.current.s1 = true;
        } else if (s1Num < 8.5) {
            confettiFired.current.s1 = false;
        }
    }, [marks1, yearData.semester1]);

    // Live auto-calculate SGPA2 when marks2 change
    useEffect(() => {
        const s2 = computeSGPA(marks2, yearData.semester2);
        setSgpa2(s2);

        const s2Num = parseFloat(s2) || 0;
        const allFilled = marks2.every((m) => m.internal !== "" && m.theory !== "");
        if (allFilled && s2Num >= 8.5 && !confettiFired.current.s2) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            confettiFired.current.s2 = true;
        } else if (s2Num < 8.5) {
            confettiFired.current.s2 = false;
        }
    }, [marks2, yearData.semester2]);

    // Live auto-calculate YGPA when SGPA1 or SGPA2 change
    useEffect(() => {
        const y = computeYGPA(sgpa1, sgpa2, yearData.semester1, yearData.semester2);
        setYgpa(y);
    }, [sgpa1, sgpa2, yearData.semester1, yearData.semester2]);

    // Persist to localStorage on change
    useEffect(() => {
        localStorage.setItem(storageKey("marks1"), JSON.stringify(marks1));
    }, [marks1]);

    useEffect(() => {
        localStorage.setItem(storageKey("marks2"), JSON.stringify(marks2));
    }, [marks2]);

    useEffect(() => {
        localStorage.setItem(storageKey("sgpa1"), JSON.stringify(sgpa1));
    }, [sgpa1]);

    useEffect(() => {
        localStorage.setItem(storageKey("sgpa2"), JSON.stringify(sgpa2));
    }, [sgpa2]);

    useEffect(() => {
        localStorage.setItem(storageKey("ygpa"), JSON.stringify(ygpa));
    }, [ygpa]);

    const handleInputChange = (index, type, value) => {
        if (index < 0 || index >= marks1.length) return;
        const newMarks = [...marks1];
        const parsedVal = value === "" ? "" : parseInt(value) || 0;
        newMarks[index] = { ...newMarks[index], [type]: parsedVal };
        setMarks1(newMarks);
    };

    const handleInputChange2 = (index2, type2, value2) => {
        if (index2 < 0 || index2 >= marks2.length) return;
        const newMarks2 = [...marks2];
        const parsedVal = value2 === "" ? "" : parseInt(value2) || 0;
        newMarks2[index2] = { ...newMarks2[index2], [type2]: parsedVal };
        setMarks2(newMarks2);
    };

    // Reset handler for this year
    const handleReset = () => {
        localStorage.removeItem(storageKey("marks1"));
        localStorage.removeItem(storageKey("marks2"));
        localStorage.removeItem(storageKey("sgpa1"));
        localStorage.removeItem(storageKey("sgpa2"));
        localStorage.removeItem(storageKey("ygpa"));
        setMarks1(yearData.semester1.subjects.map(() => ({ internal: "", theory: "" })));
        setMarks2(yearData.semester2.subjects.map(() => ({ internal: "", theory: "" })));
        setSgpa1("0.00");
        setSgpa2("0.00");
        setYgpa("0.00");
        confettiFired.current = { s1: false, s2: false };
    };

    return (
        <>
            <div className="flex flex-col max-w-7xl mx-auto">
                <div className="flex justify-end mb-2">
                    <button
                        onClick={handleReset}
                        className="border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 font-medium rounded-lg text-sm px-4 py-2 transition-colors duration-200"
                        title="Reset all data for this year"
                    >
                        Reset All Data
                    </button>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-8 justify-center">
                    <SemesterTable
                        semesterNumber={yearData.semester1.number}
                        subjects={yearData.semester1.subjects}
                        marks={marks1}
                        credits={yearData.semester1.credits}
                        maxMarks={yearData.semester1.maxMarks || []}
                        handleInputChange={handleInputChange}
                        totalCredits={yearData.semester1.credits
                            .filter((credit) => credit > 0)
                            .reduce((a, b) => a + b, 0)}
                        sgpa={sgpa1}
                    />
                    <SemesterTable
                        semesterNumber={yearData.semester2.number}
                        subjects={yearData.semester2.subjects}
                        marks={marks2}
                        credits={yearData.semester2.credits}
                        maxMarks={yearData.semester2.maxMarks || []}
                        handleInputChange={handleInputChange2}
                        totalCredits={yearData.semester2.credits
                            .filter((credit) => credit > 0)
                            .reduce((a, b) => a + b, 0)}
                        sgpa={sgpa2}
                    />
                </div>
            </div>

            {/* Year-Specific Performance (Directly beneath the year's semester tables) */}
            {(() => {
                const marks1Total = marks1.reduce(
                    (acc, curr) => acc + (parseInt(curr.internal) || 0) + (parseInt(curr.theory) || 0),
                    0
                );
                const marks2Total = marks2.reduce(
                    (acc, curr) => acc + (parseInt(curr.internal) || 0) + (parseInt(curr.theory) || 0),
                    0
                );
                const totalObtained = marks1Total + marks2Total;
                const sem1Max = marks1.reduce(
                    (acc, _, i) => acc + (yearData.semester1.maxMarks?.[i] || 100),
                    0
                );
                const sem2Max = marks2.reduce(
                    (acc, _, i) => acc + (yearData.semester2.maxMarks?.[i] || 100),
                    0
                );
                const totalMax = sem1Max + sem2Max;
                const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";

                return (
                    <div className="flex flex-col items-center justify-center mt-5 w-full">
                        {/* Marks & Percentage Pill */}
                        <div className="flex gap-4 text-gray-700 bg-white/50 px-6 py-2.5 rounded-xl border border-white shadow-sm w-fit mx-auto text-sm sm:text-base">
                            <span className="font-medium">Year {year} Total: <span className="font-semibold text-gray-900">{totalObtained}/{totalMax}</span></span>
                            <span className="w-px bg-gray-300"></span>
                            <span className="font-semibold text-blue-600">{percentage}%</span>
                        </div>

                        {/* Year {year} YGPA */}
                        <div className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3 mt-3">
                            Year {year} YGPA: <span className="text-red-600 bg-red-50 px-4 py-1.5 rounded-xl border border-red-100 shadow-sm">{ygpa}</span>
                        </div>
                    </div>
                );
            })()}

            {/* Subtle Divider between Year Performance & Overall Degree CGPA */}
            <div className="w-80 h-0.5 bg-black/10 rounded-full my-4 md:my-6 mx-auto"></div>

            {/* Overall Program / B.Tech CGPA */}
            <div className="flex flex-col items-center justify-center mb-20 w-full">
                <CgpaCalculator
                    currentYear={year}
                    currentSgpa1={sgpa1}
                    currentSgpa2={sgpa2}
                    currentMarks1={marks1}
                    currentMarks2={marks2}
                    onInfoChange={setCgpaInfo}
                />
                {cgpaInfo && (
                    <p className="text-xs sm:text-sm text-gray-500 text-center">
                        Calculated for: <span className="font-medium text-gray-700">{cgpaInfo}</span>
                    </p>
                )}
            </div>
        </>
    );
}

export default YearComponent;

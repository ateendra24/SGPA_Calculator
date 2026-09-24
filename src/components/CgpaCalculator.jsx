import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { YEARS_DATA, calculateGrade } from "../constants/data";

// Helper to compute SGPA from marks if user entered marks but hadn't clicked calculate
function computeSgpaFromMarks(marks, semesterData) {
    if (!marks || !semesterData || !semesterData.credits) return 0;
    let totalCreditPoints = 0;
    let totalCredits = 0;
    let hasEnteredMarks = false;

    marks.forEach((mark, index) => {
        if (!mark) return;
        const internalStr = mark.internal;
        const theoryStr = mark.theory;
        if (internalStr !== "" && internalStr !== undefined && internalStr !== null) hasEnteredMarks = true;
        if (theoryStr !== "" && theoryStr !== undefined && theoryStr !== null) hasEnteredMarks = true;

        const internal = parseInt(internalStr) || 0;
        const theory = parseInt(theoryStr) || 0;
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

    if (!hasEnteredMarks || totalCredits === 0) return 0;
    return parseFloat((totalCreditPoints / totalCredits).toFixed(2));
}

// Retrieve semester details and check if filled
function getSemesterData(targetYear, semKey, currentYear, currentSgpa, currentMarks) {
    const semData = semKey === 1 ? YEARS_DATA[targetYear].semester1 : YEARS_DATA[targetYear].semester2;
    const totalCredits = semData.credits.filter((c) => c > 0).reduce((a, b) => a + b, 0);
    const semNumber = semData.number;

    let sgpa = 0;

    // Check if it's the currently active year being viewed
    if (targetYear === currentYear) {
        const val = parseFloat(currentSgpa);
        if (!isNaN(val) && val > 0) {
            sgpa = val;
        } else if (currentMarks && Array.isArray(currentMarks)) {
            sgpa = computeSgpaFromMarks(currentMarks, semData);
        }
    }

    // If not found in current props, check localStorage for calculated SGPA
    if (sgpa === 0) {
        try {
            const storedVal = localStorage.getItem(`sgpa_${targetYear}_sgpa${semKey}`);
            if (storedVal) {
                const parsed = parseFloat(JSON.parse(storedVal));
                if (!isNaN(parsed) && parsed > 0) {
                    sgpa = parsed;
                }
            }
        } catch { }
    }

    // If still 0, check saved marks in localStorage
    if (sgpa === 0) {
        try {
            const storedMarks = localStorage.getItem(`sgpa_${targetYear}_marks${semKey}`);
            if (storedMarks) {
                const parsedMarks = JSON.parse(storedMarks);
                if (Array.isArray(parsedMarks)) {
                    sgpa = computeSgpaFromMarks(parsedMarks, semData);
                }
            }
        } catch { }
    }

    return {
        semNumber,
        year: targetYear,
        totalCredits,
        sgpa,
        isFilled: sgpa > 0,
    };
}

export default function CgpaCalculator({
    currentYear,
    currentSgpa1,
    currentSgpa2,
    currentMarks1,
    currentMarks2,
}) {
    const [cgpa, setCgpa] = useState(() => {
        try {
            const saved = localStorage.getItem("sgpa_overall_cgpa");
            return saved ? JSON.parse(saved) : "0.00";
        } catch {
            return "0.00";
        }
    });

    const [includedInfo, setIncludedInfo] = useState(() => {
        try {
            const savedInfo = localStorage.getItem("sgpa_overall_cgpa_info");
            return savedInfo ? JSON.parse(savedInfo) : null;
        } catch {
            return null;
        }
    });

    const calculateCGPA = () => {
        const allSemesters = [
            getSemesterData(1, 1, currentYear, currentSgpa1, currentMarks1),
            getSemesterData(1, 2, currentYear, currentSgpa2, currentMarks2),
            getSemesterData(2, 1, currentYear, currentSgpa1, currentMarks1),
            getSemesterData(2, 2, currentYear, currentSgpa2, currentMarks2),
            getSemesterData(3, 1, currentYear, currentSgpa1, currentMarks1),
            getSemesterData(3, 2, currentYear, currentSgpa2, currentMarks2),
            getSemesterData(4, 1, currentYear, currentSgpa1, currentMarks1),
            getSemesterData(4, 2, currentYear, currentSgpa2, currentMarks2),
        ];

        // Filter only semesters that have data filled (SGPA > 0)
        const filledSemesters = allSemesters.filter((s) => s.isFilled);

        if (filledSemesters.length === 0) {
            setCgpa("0.00");
            const emptyInfo = { count: 0, semesters: [], credits: 0 };
            setIncludedInfo(emptyInfo);
            localStorage.setItem("sgpa_overall_cgpa", JSON.stringify("0.00"));
            localStorage.setItem("sgpa_overall_cgpa_info", JSON.stringify(emptyInfo));
            return;
        }

        let totalWeightedPoints = 0;
        let totalCredits = 0;

        filledSemesters.forEach((s) => {
            totalWeightedPoints += s.sgpa * s.totalCredits;
            totalCredits += s.totalCredits;
        });

        if (totalCredits > 0) {
            const finalVal = totalWeightedPoints / totalCredits;
            const finalStr = finalVal.toFixed(2);
            setCgpa(finalStr);

            const info = {
                count: filledSemesters.length,
                semesters: filledSemesters.map((s) => `Sem ${s.semNumber}`),
                credits: totalCredits,
            };
            setIncludedInfo(info);

            localStorage.setItem("sgpa_overall_cgpa", JSON.stringify(finalStr));
            localStorage.setItem("sgpa_overall_cgpa_info", JSON.stringify(info));

            if (finalVal >= 8.5) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                });
            }
        } else {
            setCgpa("0.00");
            const emptyInfo = { count: 0, semesters: [], credits: 0 };
            setIncludedInfo(emptyInfo);
            localStorage.setItem("sgpa_overall_cgpa", JSON.stringify("0.00"));
            localStorage.setItem("sgpa_overall_cgpa_info", JSON.stringify(emptyInfo));
        }
    };

    return (
        <div id="box5" className="flex flex-col justify-center items-center mt-2 sm:mt-4 w-full">
            <button
                onClick={calculateCGPA}
                className="w-[90%] sm:w-auto text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 font-medium rounded-xl text-lg px-8 py-4 transition-all duration-200 transform hover:scale-105 mb-3 shadow-lg cursor-pointer"
            >
                Calculate CGPA
            </button>
            <div className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-3 mb-2">
                CGPA: <span className="text-purple-600 bg-purple-50 px-4 py-2 rounded-xl">{cgpa}</span>
            </div>
            {includedInfo && includedInfo.count > 0 && (
                <p className="text-xs sm:text-sm text-gray-500 text-center mb-6">
                    Calculated for: <span className="font-semibold text-gray-700">{includedInfo.semesters.join(", ")}</span> ({includedInfo.credits} total credits)
                </p>
            )}
        </div>
    );
}

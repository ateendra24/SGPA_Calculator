import React, { useMemo, useEffect } from "react";
import { YEARS_DATA, calculateGrade } from "../constants/data";

// Helper to compute SGPA from marks array
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

// Retrieve semester data across all years
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

    // Check localStorage for calculated SGPA
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

    // Check stored marks in localStorage
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
    onInfoChange,
}) {
    // Automatically recalculate overall CGPA in real-time
    const { cgpa, info } = useMemo(() => {
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

        const filled = allSemesters.filter((s) => s.isFilled);

        if (filled.length === 0) {
            return { cgpa: "0.00", info: "" };
        }

        let totalWeightedPoints = 0;
        let totalCredits = 0;

        filled.forEach((s) => {
            totalWeightedPoints += s.sgpa * s.totalCredits;
            totalCredits += s.totalCredits;
        });

        if (totalCredits === 0) {
            return { cgpa: "0.00", info: "" };
        }

        const calculatedCgpa = (totalWeightedPoints / totalCredits).toFixed(2);
        const infoText = `${filled.map((s) => `Sem ${s.semNumber}`).join(", ")} (${totalCredits} credits)`;

        // Persist to localStorage
        try {
            localStorage.setItem("sgpa_overall_cgpa", JSON.stringify(calculatedCgpa));
        } catch { }

        return {
            cgpa: calculatedCgpa,
            info: infoText,
        };
    }, [currentYear, currentSgpa1, currentSgpa2, currentMarks1, currentMarks2]);

    useEffect(() => {
        if (onInfoChange) {
            onInfoChange(info);
        }
    }, [info, onInfoChange]);

    return (
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
            Overall B.Tech CGPA: <span className="text-purple-600 bg-purple-50 px-5 py-2 rounded-2xl border border-purple-100 shadow-sm">{cgpa}</span>
        </div>
    );
}

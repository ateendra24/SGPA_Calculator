export const YEAR_1 = {
    semester1: {
        subjects: [
            "Physics",
            "Maths-1",
            "Electrical",
            "PPS",
            "EVS",
            "Physics Lab",
            "Electrical Lab",
            "PPS Lab",
            "Graphics",
        ],
        credits: [4, 4, 3, 3, 3, 1, 1, 1, 2],
    },
    semester2: {
        subjects: [
            "Chemistry",
            "Maths-2",
            "Electronics",
            "Mechanical",
            "Soft Skills",
            "Chemistry Lab",
            "Electronics Lab",
            "English Lab",
            "Workshop",
        ],
        credits: [4, 4, 3, 3, 3, 1, 1, 1, 2],
    }
};

export const YEAR_2 = {
    semester3: {
        subjects: [
            "OE",
            "Technical Communication",
            "Data Structures",
            "COA",
            "DSTL",
            "DSA Lab",
            "COA Lab",
            "Web Designing Workshop",
            "Cyber Security",
            "Mini Project",
        ],
        credits: [4, 3, 4, 4, 3, 1, 1, 1, 2, 2],
    },
    semester4: {
        subjects: [
            "Maths-4",
            "UHV",
            "Operating Systems",
            "Theory of Automata",
            "JAVA",
            "Operating System Lab",
            "JAVA Lab",
            "Cyber Security Workshop",
            "Python Programming",
            "Yoga-2"
        ],
        credits: [4, 3, 4, 4, 3, 1, 1, 1, 2, 0],
    }
};

export const calculateGrade = (totalMarks) => {
    if (totalMarks >= 90) return 10;
    if (totalMarks >= 80) return 9;
    if (totalMarks >= 70) return 8;
    if (totalMarks >= 60) return 7;
    if (totalMarks >= 50) return 6;
    if (totalMarks >= 45) return 5;
    if (totalMarks >= 40) return 4;
    return 0;
}; 
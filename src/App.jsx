import React, { useState } from "react";
import "./App.css";
import Year1 from "./components/Year1";
import Year2 from "./components/Year2";

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

function App() {
  const [selectedYear, setSelectedYear] = useState("1");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-8 px-4 sm:pt-12 sm:px-8">
      <div id="box1" className="flex flex-col justify-center items-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-3 text-center px-2">
          SGPA Calculator
        </h2>
        <div className="h-1 w-24 bg-blue-600 rounded mb-4"></div>
        <p className="text-sm text-gray-600 text-center">
          For AKTU <br /> made by{" "}
          <a
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
            href="https://github.com/ateendra24"
            target="_blank"
            rel="noopener noreferrer"
          >
            @ateendra
          </a>
        </p>

        <div className="mt-6">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 font-medium cursor-pointer hover:border-gray-400 transition-colors"
          >
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
      </div>

      {selectedYear === "1" && <Year1 />}
      {selectedYear === "2" && <Year2 />}
      {selectedYear === "3" && (
        <div className="text-center text-gray-600 text-lg">
          Coming Soon...
        </div>
      )}
      {selectedYear === "4" && (
        <div className="text-center text-gray-600 text-lg">
          Coming Soon...
        </div>
      )}

      <div className="text-center text-gray-600 text-base mt-10 mb-2">
        Appreciate the effort and time taken to make this website. By giving a star to this repository. <a href="https://github.com/ateendra24/React_Calculator" className="underline">Click here</a> to give a star.
      </div>


    </div>
  );
}

export default App;

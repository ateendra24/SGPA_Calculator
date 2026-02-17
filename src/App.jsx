import React, { useState, useEffect } from "react";
import "./App.css";
import YearComponent from "./components/YearComponent";
import GithubStar from "./components/GithubStar";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [selectedYear, setSelectedYear] = useState("1");
  const [showSaveToast, setShowSaveToast] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault(); // Prevent browser save dialog
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 3000); // Hide after 3 seconds
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-200 pt-8 px-4 sm:pt-12 sm:px-8">
      <div id="box1" className="flex flex-col justify-center items-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-3 text-center px-2">
          SGPA Calculator
        </h2>
        <div className="h-1 w-24 bg-blue-600 rounded mb-4"></div>
        <p className="text-sm text-gray-600 text-center">
          For AKTU Students <br /> made by{" "}
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

      {selectedYear && <YearComponent year={parseInt(selectedYear)} />}

      <div className="text-center text-gray-600 text-base mt-10">
        Appreciate the effort and time taken to make this website. By giving a star to this repository. <a href="https://github.com/ateendra24/SGPA_Calculator" className="underline">Click here</a> to give a star.
      </div>

      <GithubStar />

      {/* Save Notification Popup */}
      <div
        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${showSaveToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
      >
        <div className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-gray-700">
          <div className="bg-green-500 rounded-full p-1">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-medium text-sm sm:text-base">Data saved into Local Storage.</span>
        </div>
      </div>

      <Analytics />
    </div>
  );
}

export default App;

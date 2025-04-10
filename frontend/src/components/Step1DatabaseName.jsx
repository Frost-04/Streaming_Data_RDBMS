// src/components/Step1DatabaseName.jsx
import React from "react";

const Step1DatabaseName = ({ databaseName, setDatabaseName, onNext }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Step 1: Database Info</h2>

        <label className="block font-semibold">Database Name</label>
        <input
          type="text"
          value={databaseName}
          onChange={(e) => setDatabaseName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-1 mb-4"
          placeholder="Enter your database name"
        />

        <button
          onClick={onNext}
          disabled={!databaseName.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Step1DatabaseName;

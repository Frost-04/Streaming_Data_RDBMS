import { useState } from "react";

const Database = ({ dbInfo, updateDbInfo, nextStep }) => {
  const [dbName, setDbName] = useState(dbInfo.dbName || "");
  const [numTables, setNumTables] = useState(dbInfo.numTables || 1);

  const handleNext = () => {
    const tables = Array.from({ length: numTables }, () => ({ name: "", columns: [] }));
    updateDbInfo({ dbName, numTables, tables });
    nextStep();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Step 1: Database Details</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Database Name</label>
        <input
          type="text"
          value={dbName}
          onChange={(e) => setDbName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Number of Tables</label>
        <input
          type="number"
          value={numTables}
          min="1"
          onChange={(e) => setNumTables(parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleNext}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Next
      </button>
    </div>
  );
};

export default Database;

import React from "react";

const Step3DataSource = ({ dataSource, setDataSource, onBack, onNext }) => {
  const handleTypeChange = (e) => {
    setDataSource({ ...dataSource, type: e.target.value, value: "" });
  };

  const handleValueChange = (e) => {
    setDataSource({ ...dataSource, value: e.target.value });
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Step 3: Data Source</h2>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Source Type:</label>
        <select
          value={dataSource.type}
          onChange={handleTypeChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Select Type --</option>
          <option value="url">URL</option>
          <option value="folder">Folder</option>
        </select>
      </div>

      {dataSource.type && (
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            {dataSource.type === "url" ? "Enter URL:" : "Enter Folder Path:"}
          </label>
          <input
            type="text"
            value={dataSource.value}
            onChange={handleValueChange}
            className="w-full border rounded px-3 py-2"
            placeholder={
              dataSource.type === "url"
                ? "https://example.com/data"
                : "/path/to/your/folder"
            }
          />
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step3DataSource;

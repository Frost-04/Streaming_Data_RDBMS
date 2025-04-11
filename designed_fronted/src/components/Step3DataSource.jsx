import React, { useRef } from "react";

const Step3DataSource = ({ dataSource, setDataSource, onBack, onNext }) => {
  const fileInputRef = useRef();

  const handleTypeChange = (e) => {
    setDataSource({ ...dataSource, type: e.target.value, value: "" });
  };

  const handleValueChange = (e) => {
    setDataSource({ ...dataSource, value: e.target.value });
  };

  const handleBrowseFolder = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      // Get the folder path from the first file's path
      const fullPath = files[0].webkitRelativePath;
      const folderPath = fullPath.split("/")[0];
      setDataSource({ ...dataSource, value: folderPath });
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        position: "relative",
      }}
    >
      {/* Status bar */}
      <div className="position-absolute top-0 start-0 w-100 p-3 bg-white shadow-sm">
        <div className="d-flex justify-content-center gap-4">
          <span className="text-muted">Step 1</span>
          <span className="text-muted">Step 2</span>
          <span className="fw-bold text-primary">Step 3</span>
          <span className="text-muted">Step 4</span>
        </div>
      </div>

      {/* Center Card */}
      <div className="bg-white p-4 rounded shadow" style={{ width: "500px", minHeight: "300px" }}>
        <h2 className="text-primary mb-4 text-center">Step 3: Data Source</h2>

        <div className="mb-3">
          <label className="form-label fw-bold">Select Source Type:</label>
          <select
            value={dataSource.type}
            onChange={handleTypeChange}
            className="form-select"
          >
            <option value="">-- Select Type --</option>
            <option value="url">URL</option>
            <option value="folder">Folder</option>
          </select>
        </div>

        {dataSource.type && (
          <div className="mb-3">
            <label className="form-label fw-bold">
              {dataSource.type === "url" ? "Enter URL:" : "Enter Folder Path:"}
            </label>
            {dataSource.type === "url" ? (
              <input
                type="text"
                value={dataSource.value}
                onChange={handleValueChange}
                className="form-control"
                placeholder="https://example.com/data"
              />
            ) : (
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  value={dataSource.value}
                  onChange={handleValueChange}
                  placeholder="/path/to/your/folder"
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => fileInputRef.current.click()}
                >
                  Browse
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  webkitdirectory="true"
                  directory=""
                  multiple
                  style={{ display: "none" }}
                  onChange={handleBrowseFolder}
                />
              </div>
            )}
          </div>
        )}

        <div className="d-flex justify-content-between mt-4">
          <button
            onClick={onBack}
            className="btn btn-secondary"
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            className="btn btn-primary"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3DataSource;

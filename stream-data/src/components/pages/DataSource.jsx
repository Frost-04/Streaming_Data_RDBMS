import React, { useState } from "react";
import "../presentation/DataSource.css";

const DataSource = () => {
  const [selectedPath, setSelectedPath] = useState("");


  const handleFileSelection = async () => {
    if (window.showDirectoryPicker) {
      try {
        const dirHandle = await window.showDirectoryPicker();
        setSelectedPath(dirHandle.name); 
      } catch (error) {
        console.error("Error selecting folder:", error);
      }
    } else {
      document.getElementById("fileInput").click();
    }
  };

  const handleFileFallback = (event) => {
    if (event.target.files.length > 0) {
      setSelectedPath(event.target.files[0].webkitRelativePath || event.target.files[0].name);
    }
  };

  const handleInputChange = (event) => {
    setSelectedPath(event.target.value);
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Select a Data Source</h2>
        <div className="input-container">
          <input
            type="text"
            value={selectedPath}
            onChange={handleInputChange}
            placeholder="Click to select a folder..."
            readOnly
            className="folder-input"
            onClick={handleFileSelection}
          />
          <button onClick={handleFileSelection} className="browse-button">Browse</button>
        </div>

    
        <input type="file" id="fileInput" webkitdirectory directory onChange={handleFileFallback} style={{ display: "none" }} />

        {selectedPath && <p className="selected-path">Selected: {selectedPath}</p>}
      </div>
    </div>
  );
};

export default DataSource;


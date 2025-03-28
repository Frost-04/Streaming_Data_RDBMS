import React, { useState } from "react";
import "../presentation/DataStructure.css";

const DataStructure = () => {
  const [name, setName] = useState("");
  const [size, setSize] = useState(0);
  const [columns, setColumns] = useState([]);

  const handleSizeChange = (e) => {
    let newSize = parseInt(e.target.value, 10) || 0;
    if (isNaN(newSize) || newSize < 0) newSize = 0; 
    setSize(newSize);
    setColumns(Array(newSize).fill({ name: "", key: "", datatype: "" }));
  };

  const handleColumnChange = (index, field, value) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setColumns(newColumns);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, size, columns }); 
    alert("Data Source Submitted! Check console for details.");
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
         
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          
          <label>
            Size:
            <input type="number" value={size} onChange={handleSizeChange} min="0" required />
          </label>

          
          {columns.length > 0 && <h3>Columns</h3>}
          {columns.map((col, index) => (
            <div key={index} className="column-container">
             
              <label>
                Column {index + 1} Name:
                <input
                  type="text"
                  value={col.name}
                  onChange={(e) => handleColumnChange(index, "name", e.target.value)}
                  required
                />
              </label>

              
              <label>
                Key:
                <input
                  type="text"
                  value={col.key}
                  onChange={(e) => handleColumnChange(index, "key", e.target.value)}
                  required
                />
              </label>

              
              <label>
                Datatype:
                <input
                  type="text"
                  value={col.datatype}
                  onChange={(e) => handleColumnChange(index, "datatype", e.target.value)}
                  required
                />
              </label>
            </div>
          ))}

         
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default DataStructure;

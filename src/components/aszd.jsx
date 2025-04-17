// import React, { useState } from "react"
// const Step3Aggregation = ({ streamId, columns }) => {
//     const [selectedColId, setSelectedColId] = useState("");
//     const [aggFunction, setAggFunction] = useState("");
  
//     const handleSubmit = async () => {
//       const payload = {
//         stream: { streamId },
//         streamCol: { streamColId: Number(selectedColId) },
//         aggFunction
//       };
  
//       await fetch("http://localhost:8081/ingestion/agg-rule", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
//     };
  
//     return (
//       <div>
//         <label>Select Column:</label>
//         <select value={selectedColId} onChange={(e) => setSelectedColId(e.target.value)}>
//           <option value="">--Select--</option>
//           {columns.map((col) => (
//             <option key={col.stream_col_id} value={col.stream_col_id}>
//               {col.column_name}
//             </option>
//           ))}
//         </select>
  
//         <label>Select Aggregation:</label>
//         <select value={aggFunction} onChange={(e) => setAggFunction(e.target.value)}>
//           <option value="">--Select--</option>
//           <option value="MINIMUM">Minimum</option>
//           <option value="MAXIMUM">Maximum</option>
//           <option value="SUM">Sum</option>
//           <option value="AVG">Average</option>
//         </select>
  
//         <button onClick={handleSubmit}>Submit Aggregation Rule</button>
//       </div>
//     );
//   };
  
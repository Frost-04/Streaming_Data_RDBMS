
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Table } from 'react-bootstrap';

// const WindowResults = ({ streamId }) => {
//   const [data, setData] = useState([]);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let intervalId;

//     const fetchData = async () => {
//       try {
//         const response = await axios.post("http://localhost:8083/api/output/summary", {
//           streamId: streamId,
//         });

//         console.log("Calling API with streamId:", streamId);
//         setData(response.data);
//         setLastUpdated(new Date().toLocaleTimeString());
//         setError(null);
//         console.log("API response data:", response.data);
//       } catch (err) {
//         setError("Error fetching data: " + err.message);
//       }
//     };

//     // Fetch initially and then every 5 seconds
//     console.log("streamId:", streamId);
//     if (streamId) {
//       fetchData(); // initial call
//       intervalId = setInterval(fetchData, 5000); // every 5 seconds
//     }

//     // Cleanup on component unmount or streamId change
//     return () => clearInterval(intervalId);
//   }, [streamId]);

//   const columns = data.length > 0 ? Object.keys(data[0]) : [];

//   return (
//     <div className="container mt-5">
//       <h2>Summary Results</h2>

//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {lastUpdated && <p><strong>Last updated at:</strong> {lastUpdated}</p>}

//       {data.length > 0 ? (
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               {columns.map((col) => (
//                 <th key={col}>{col}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item, index) => (
//               <tr key={index}>
//                 {columns.map((col) => (
//                   <td key={col}>{item[col]}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       ) : (
//         <p>No data available yet.</p>
//       )}
//     </div>
//   );
// };

// export default WindowResults;


import React, { useState, useEffect } from "react";
import { Tab, Nav, Table, TabContainer } from "react-bootstrap";
import axios from "axios";

const SummaryResults = ({ streamId, aggregatedcolumns }) => {
  const [activeKey, setActiveKey] = useState(null);
  const [data, setData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  // Fetch data for the selected aggregation column
  useEffect(() => {
    const fetchData = async (colId) => {
      try {
        const response = await axios.post("http://localhost:8083/api/output/columnsummary", {
          streamId: streamId,
          colId: colId,
        });

        setData(response.data);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
      } catch (err) {
        setError("Error fetching data: " + err.message);
      }
    };

    if (activeKey) {
      const [colName, aggType] = activeKey.split("-");
      const colId = aggregatedcolumns.find(
        (col) => col.columnName === colName && col.aggregationType === aggType
      )?.columnId;

      if (colId) {
        fetchData(colId);
      }
    }
  }, [activeKey, streamId, aggregatedcolumns]);

  // Render tabs based on aggregatedColumns
  const renderTabs = () => {
    return aggregatedcolumns.map((column) => {
      const tabKey = `${column.columnName}-${column.aggregationType}`;
      return (
        <Nav.Item key={tabKey}>
          <Nav.Link eventKey={tabKey}>
            {`${column.columnName}-${column.aggregationType}`}
          </Nav.Link>
        </Nav.Item>
      );
    });
  };

  const renderTabContent = () => {
    return aggregatedcolumns.map((column) => {
      const tabKey = `${column.columnName}-${column.aggregationType}`;
      return (
        <Tab.Pane eventKey={tabKey} key={tabKey}>
          <div className="container mt-5">
            {error && <p style={{ color: "red" }}>{error}</p>}
            {lastUpdated && <p><strong>Last updated at:</strong> {lastUpdated}</p>}

            {data.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      {Object.keys(data[0]).map((col) => (
                        <td key={col}>{item[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No data available yet.</p>
            )}
          </div>
        </Tab.Pane>
      );
    });
  };

  return (
    <div className="container mt-5">
      <h2>Summary Results</h2>
      <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
        <Nav variant="tabs" className="mb-3">
          {renderTabs()}
        </Nav>
        <Tab.Content>{renderTabContent()}</Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default SummaryResults;

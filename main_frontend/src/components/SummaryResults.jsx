
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

const WindowResults = ({ streamId }) => {
  const [data, setData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:8083/api/output/summary", {
          streamId: streamId,
        });

        console.log("Calling API with streamId:", streamId);
        setData(response.data);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
        console.log("API response data:", response.data);
      } catch (err) {
        setError("Error fetching data: " + err.message);
      }
    };

    // Fetch initially and then every 5 seconds
    console.log("streamId:", streamId);
    if (streamId) {
      fetchData(); // initial call
      intervalId = setInterval(fetchData, 5000); // every 5 seconds
    }

    // Cleanup on component unmount or streamId change
    return () => clearInterval(intervalId);
  }, [streamId]);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="container mt-5">
      <h2>Summary Results</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {lastUpdated && <p><strong>Last updated at:</strong> {lastUpdated}</p>}

      {data.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {columns.map((col) => (
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
  );
};

export default WindowResults;

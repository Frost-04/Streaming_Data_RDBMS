import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Navbar, Container } from 'react-bootstrap';


const WindowResults = ({ streamId }) => {
  const [data, setData] = useState([]); // Store fetched data
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For handling errors
  
  console.log("Initial streamId:", streamId);

  // Fetch data when streamId changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post("http://localhost:8083/api/output/summary", {
          streamId: 100,
        });


        console.log("Calling API with streamId:", streamId);
        console.log(loading);

        setData(response.data); // Store the response data

        console.log("Received data:", response.data);

      } catch (err) {
        setError("Error fetching data: " + err.message); // Handle error
      } finally {
        setLoading(false); // Stop loading after request finishes
      }
    };

      fetchData();
    
  }, [streamId]);

  // Extract the columns dynamically from the data if it's not empty
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div>
      <div className="container mt-5">
        <h2>Window Results</h2>

        {/* Show error message */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Show table if data is fetched */}
        {data.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                {/* Render table headers dynamically */}
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {/* Render table rows dynamically */}
                  {columns.map((col) => (
                    <td key={col}>{item[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        )}

      </div>
    </div>
  );
};

export default WindowResults;

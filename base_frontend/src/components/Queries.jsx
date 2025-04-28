import React, { useState } from 'react';
import { Button, Form, Tabs, Tab } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';

const availableColumns = ['column1', 'column2', 'column3', 'column4'];

const Queries = () => {
  const [key, setKey] = useState('querySelection');
  const [selectCols, setSelectCols] = useState([]);
  const [groupByCols, setGroupByCols] = useState([]);
  const [orderByCols, setOrderByCols] = useState([]);
  const [whereClause, setWhereClause] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const [havingClause, setHavingClause] = useState('');
  const [showAggregationDropdown, setShowAggregationDropdown] = useState(false);
  const [aggregation, setAggregation] = useState('None');

  const [showSelectDropdown, setShowSelectDropdown] = useState(false);

  const [freeformQuery, setFreeformQuery] = useState('');
  const [freeformResult, setFreeformResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  console.log(error);
  const addSelectColumn = (col) => {
    if (!selectCols.includes(col)) setSelectCols([...selectCols, col]);
  };

  const removeSelectColumn = (col) => {
    setSelectCols(selectCols.filter((c) => c !== col));
    setGroupByCols(groupByCols.filter((g) => g !== col));
    setOrderByCols(orderByCols.filter((o) => o.col !== col));
  };

  const handleGroupBy = (col) => {
    if (!groupByCols.includes(col)) setGroupByCols([...groupByCols, col]);
  };

  const handleOrderBy = (col, order) => {
    const updated = orderByCols.filter((o) => o.col !== col);
    setOrderByCols([...updated, { col, order }]);
  };

  const handleExecute = () => {
    const queryJSON = {
      SELECT: selectCols,
      GROUP_BY: groupByCols.map((col, index) => ({ col, priority: index + 1 })),
      AGGREGATION: aggregation !== 'None' ? aggregation : null,
      HAVING: aggregation !== 'None' && havingClause.trim() !== '' ? havingClause : null,
      ORDER_BY: orderByCols,
      WHERE: whereClause,
    };
    setQueryResult(JSON.stringify(queryJSON, null, 2));
    console.log('Query Selection JSON:', queryJSON);
  };

  const resetQuery = () => {
    setSelectCols([]);
    setGroupByCols([]);
    setOrderByCols([]);
    setWhereClause('');
    setQueryResult('');
  };


  // const renderTable = (data) => {
  //   if (!data || data.length === 0) return <p>No data available.</p>;

  //   // Get headers (keys of the first object)
  //   const headers = Object.keys(data[0]);

  //   return (
  //     <table className="table table-bordered">
  //       <thead>
  //         <tr>
  //           {headers.map((header, index) => (
  //             <th key={index}>{header}</th>
  //           ))}
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {data.map((row, rowIndex) => (
  //           <tr key={rowIndex}>
  //             {headers.map((header, colIndex) => (
  //               <td key={colIndex}>{row[header]}</td>
  //             ))}
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   );
  // };


  const executeFreeform = async() => {
    setError('');
    console.log("loading: " + loading);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8083/api/execute-query', {
        raw_query: freeformQuery,
        timestamp: new Date().toISOString(),
      });
      console.log("Received Response:", response.data);  // 🛑 Log here
      // Handle the API response
      if (response.data && Array.isArray(response.data.data)) {
        setFreeformResult(response.data.data);  // Set as array
      } else {
        setFreeformResult([]);  // Empty array if no valid data
        setError('No valid data received.');
      }
    } catch (err) {
      console.error('Error executing query:', err);
      setError('Failed to execute the query. Please try again.');
    }
  };

  // const renderTable = (response) => {
  //   try {
  //     // Parse the response if it's a string
  //     const parsedData = response?.data || [];  
  //     // Ensure data is in the expected format
  //     if (!Array.isArray(parsedData) || parsedData.length === 0) {
  //       return <div>No data available.</div>;
  //     }
  
  //     // Dynamically generate table headers
  //     const headers = Object.keys(parsedData[0]);
  
  //     return (
  //       <table className="table table-bordered">
  //         <thead>
  //           <tr>
  //             {headers.map((header) => (
  //               <th key={header}>{header.charAt(0).toUpperCase() + header.slice(1)}</th>
  //             ))}
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {parsedData.map((row, index) => (
  //             <tr key={index}>
  //               {headers.map((header) => (
  //                 <td key={header}>
  //                   {row[header] !== null && row[header] !== undefined ? row[header] : 'N/A'}
  //                 </td>
  //               ))}
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     );
  //   } catch (error) {
  //     console.error('Error parsing data:', error);
  //     return <div>Invalid data format.</div>;
  //   }
  // };
  const renderTable = (data) => {
    if (!Array.isArray(data) || data.length === 0) {     
       return <div>No data available.</div>;
    }
  
    const columns = Object.keys(data[0]);
  
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            {columns.map((column, idx) => (
              <th key={idx}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((column, colIdx) => (
                <td key={colIdx}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  

  return (
    <div>
      <h4 className="mb-4">Queries</h4>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-4">
        <Tab eventKey="querySelection" title="Query Selection">
          {/* SELECT */}
          <h5>SELECT</h5>
          <hr />
          {selectCols.map((col) => (
            <div key={col} className="d-flex align-items-center mb-2">
              <Button variant="danger" size="sm" className="me-2" onClick={() => removeSelectColumn(col)}>
                <FaMinus />
              </Button>
              <Form.Control value={col} readOnly />
            </div>
          ))}
          {!showSelectDropdown && selectCols.length < availableColumns.length && (
            <Button variant="primary" size="sm" className="mb-3" onClick={() => setShowSelectDropdown(true)}>
              <FaPlus className="me-2" /> Add Column
            </Button>
          )}
          {showSelectDropdown && (
            <Form.Group className="d-flex align-items-center mb-3">
              <Button variant="secondary" size="sm" disabled className="me-2"><FaPlus /></Button>
              <Form.Select
                onChange={(e) => {
                  if (e.target.value !== "") {
                    addSelectColumn(e.target.value);
                    setShowSelectDropdown(false);
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Select column</option>
                {availableColumns.filter((col) => !selectCols.includes(col)).map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
          <div className="d-flex gap-2 mb-4">
            <Button variant="success" size="sm" onClick={() => setSelectCols([...availableColumns])}>Add All Columns</Button>
            <Button variant="danger" size="sm" onClick={resetQuery}>Delete All</Button>
          </div>

{/* GROUP BY */}
<h5>GROUP BY</h5>
<hr />

{!showAggregationDropdown && (
  <Button
    variant="outline-primary"
    size="sm"
    className="mb-3"
    onClick={() => setShowAggregationDropdown(true)}
  >
    <FaPlus className="me-1" /> Add Aggregation
  </Button>
)}

{showAggregationDropdown && (
  <Form.Group className="mb-3">
    <Form.Label>Aggregation</Form.Label>
    <Form.Select
      value={aggregation}
      onChange={(e) => {
        const value = e.target.value;
        setAggregation(value);
        if (value === 'None') {
          setGroupByCols([]);
          setHavingClause('');
        }
      }}
    >
      <option>None</option>
      <option>SUM</option>
      <option>AVG</option>
      <option>MAX</option>
      <option>MIN</option>
      <option>COUNT</option>
    </Form.Select>
  </Form.Group>
)}

{/* Only show if aggregation is selected and not 'None' */}
{aggregation !== 'None' && (
  <>
    {groupByCols.map((col, index) => (
      <div key={col} className="d-flex align-items-center mb-2">
        <Button
          variant="danger"
          size="sm"
          className="me-2"
          onClick={() =>
            setGroupByCols(groupByCols.filter((g) => g !== col))
          }
        >
          <FaMinus />
        </Button>
        <Form.Control value={col} readOnly className="me-2" />
        <Form.Text muted>Priority {index + 1}</Form.Text>
      </div>
    ))}

    {selectCols
      .filter((col) => !groupByCols.includes(col))
      .map((col) => (
        <Button
          key={col}
          variant="outline-secondary"
          size="sm"
          className="me-2 mb-2"
          onClick={() => handleGroupBy(col)}
        >
          <FaPlus className="me-1" /> {col}
        </Button>
      ))}

    {/* HAVING only if aggregation is applied */}
    <Form.Group className="mt-3">
      <Form.Label>Having</Form.Label>
      <Form.Control
        type="text"
        placeholder="e.g. SUM(column1) > 100"
        value={havingClause}
        onChange={(e) => setHavingClause(e.target.value)}
      />
    </Form.Group>
    <Button
      variant="secondary"
      size="sm"
      className="mt-2 mb-4"
      onClick={() => setHavingClause('')}
    >
      Clear
    </Button>
  </>
)}
          {/* ORDER BY */}
          <h5>ORDER BY</h5>
          <hr />
          {orderByCols.map(({ col, order }) => (
            <div key={col} className="d-flex align-items-center mb-2">
              <Button variant="danger" size="sm" className="me-2" onClick={() => setOrderByCols(orderByCols.filter((o) => o.col !== col))}>
                <FaMinus />
              </Button>
              <Form.Control value={col} readOnly className="me-2" />
              <Form.Select
                value={order}
                onChange={(e) => handleOrderBy(col, e.target.value)}
                className="w-auto"
              >
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
              </Form.Select>
            </div>
          ))}
          {selectCols
            .filter((col) => !orderByCols.some((o) => o.col === col))
            .map((col) => (
              <Button key={col} variant="outline-secondary" size="sm" className="me-2 mb-2" onClick={() => handleOrderBy(col, 'ASC')}>
                <FaPlus className="me-1" /> {col}
              </Button>
            ))}

          {/* WHERE */}
          <h5>WHERE</h5>
          <hr />
          <Form.Control
            type="text"
            className="mb-2"
            value={whereClause}
            onChange={(e) => setWhereClause(e.target.value)}
          />
          <Button variant="secondary" size="sm" className="mb-4" onClick={() => setWhereClause('')}>Clear</Button>

          {/* ACTION BUTTONS */}
          <div className="mt-4 mb-4">
            <Button variant="primary" className="me-2" onClick={handleExecute}>Execute</Button>
            <Button variant="warning" onClick={resetQuery}>New Query</Button>
          </div>

          {/* OUTPUT */}
          <h5>Output</h5>
          <Form.Control as="textarea" rows={6} value={queryResult} readOnly className="mb-5" />
        </Tab>

        <Tab eventKey="freeform" title="Freeform">
  <div className="p-3">
    <h5 className="mb-3">Freeform Query</h5>
    <Form.Group className="mb-3">
      <Form.Label>Write your query</Form.Label>
      <Form.Control
        as="textarea"
        rows={5}
        value={freeformQuery}
        onChange={(e) => setFreeformQuery(e.target.value)}
        placeholder="Enter your custom SQL query here..."
      />
      <Form.Text className="text-muted">
        Note: The table name is stored as <code>sdb_"Stream Name"</code>.
      </Form.Text>
    </Form.Group>

    <div className="d-flex gap-2 mb-4">
      <Button variant="primary" onClick={executeFreeform}>
        Execute Query
      </Button>
      <Button
        variant="warning"
        onClick={() => {
          setFreeformQuery('');
          setFreeformResult('');
        }}
      >
        Clear
      </Button>
    </div>

    <h5 className="mb-3">Query Output</h5>
    
    <div className="overflow-auto">
      {freeformResult && !freeformResult.includes('Failed') ? (
        <div>{renderTable(freeformResult)}</div> 
              ) : (
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={typeof freeformResult === 'string' ? freeformResult : JSON.stringify(freeformResult, null, 2)}                  
                  readOnly
                />
              )}
            </div>
          </div>
</Tab>

      </Tabs>
    </div>
  );
};

export default Queries;

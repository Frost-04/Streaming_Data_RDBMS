import React, { useState } from 'react';
import { Button, Form, Tabs, Tab } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';

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

  const executeFreeform = () => {
    const freeformJSON = {
      raw_query: freeformQuery,
      timestamp: new Date().toISOString(),
    };
    setFreeformResult(JSON.stringify(freeformJSON, null, 2));
    console.log('Freeform Query JSON:', freeformJSON);
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
          <h5>Type your query</h5>
          <hr />
          <Form.Control
            as="textarea"
            rows={4}
            className="mb-3"
            value={freeformQuery}
            onChange={(e) => setFreeformQuery(e.target.value)}
            placeholder="Enter your query here..."
          />
          <Button variant="primary" onClick={executeFreeform}>Execute</Button>

          {/* OUTPUT */}
          <h5 className="mt-4">Output</h5>
          <Form.Control as="textarea" rows={6} value={freeformResult} readOnly className="mb-5" />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Queries;

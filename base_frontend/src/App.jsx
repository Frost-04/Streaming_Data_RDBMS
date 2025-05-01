import React, { useState,useEffect } from "react";
import { Routes, Route, useNavigate} from "react-router-dom";
import Step1DatabaseName from "./components/Step1DatabaseName";
import Step2AddColumns from "./components/Step2AddColumns";
import Step3Aggregation from "./components/Step3Aggregation";
import Dashboard from "./components/Dashboard";
import InputMonitor from "./components/InputMonitor";
import StreamHome from "./components/StreamHome";

const App = () => {
  const [streamName, setStreamname] = useState("");
  const [windowType, setWindowtype] = useState("");
  const [windowSize, setWindowsize] = useState(0);
  const [windowVelocity, setWindowvelocity] = useState(0);
  const [dataSourceType, setDataSourceType] = useState(""); // new
  const [dataSourcePath, setDataSourcePath] = useState("");
  const [streams, setStreams] = useState([]);
  const [columns, setColumns] = useState([]);
  const [streamId, setStreamId] = useState(null); // New state to store streamId
  //const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const [aggregatedColumns, setAggregatedColumns] = useState([]);

  useEffect(() => {
    console.log("Updated aggregatedColumns:", aggregatedColumns);
  }, [aggregatedColumns]);
  
  
 // const location = useLocation();

  const handleNextStep1 = async () => {
    if (
      streamName &&
      windowType &&
      windowSize &&
      windowVelocity &&
      dataSourceType &&
      dataSourcePath
    ) {
      const payload = {
        streamName,
        windowType,
        windowSize,
        windowVelocity,
        dataSourceType,
        dataSourcePath,
      };

      try {
        const response = await fetch(
          "http://localhost:8081/ingestion/stream-master",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        console.log("Payload to be sent:", payload);
        if (!response.ok) {
          throw new Error("Failed to submit stream info.");
        }

        const result = await response.json();
        setStreams(result);
        if (result && result.streamId) {
          setStreamId(result.streamId); // Ensure streamId is set correctly
        }
        // setCurrentStep(2); // Transition to Step 2
        navigate("/step2");
      } catch (error) {
        console.error("Error submitting:", error);
        alert("Error submitting data to backend.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleNextStep2 = (selectedColumns) => {
    setColumns(selectedColumns);
    // setCurrentStep(3); // Transition to Step 3 after Step 2
    navigate("/step3");
  };


  const handleNextStep3 = (streamId, streamName, aggregatedColumns) => {
    // Update the state with the new aggregated columns
    setAggregatedColumns(aggregatedColumns);
    console.log("Received aggregatedColumns in App.jsx:", aggregatedColumns);
  
    // Continue with the logic for your API request
    createTableAndNavigate(streamId, aggregatedColumns);
  };
  
  const createTableAndNavigate = async (streamId, aggregatedColumns) => {
    try {
      const response1 = await fetch(
        `http://localhost:8081/api/tables/create-table/${streamId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response1.ok) {
        throw new Error("Failed to create table.");
      }
  
      // If successful
      alert("Table created successfully!");
      navigate("/input-monitor", {
        state: {
          streamId,
          streamName,
          columns,
          aggregatedColumns,
        }
      });    } catch (error) {
      console.error("Error creating table:", error);
      alert("Error creating table.");
    }
  };
  


  console.log(streams);
  //console.log(isMonitorReady);

  const handleBack = () => {
    // Navigate to the previous page
    navigate(-1);
  };

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <StreamHome
              setStreamId={setStreamId}
              setStreamname={setStreamname}
              setColumns={setColumns}
              //setCurrentStep={() => navigate("/step1")}
            />
          }
        />
        <Route
          path="/step1"
          element={
            <Step1DatabaseName
              streamName={streamName}
              setStreamname={setStreamname}
              windowType={windowType}
              setWindowtype={setWindowtype}
              windowSize={windowSize}
              setWindowsize={setWindowsize}
              windowVelocity={windowVelocity}
              setWindowvelocity={setWindowvelocity}
              dataSourceType={dataSourceType}
              setDataSourceType={setDataSourceType}
              dataSourcePath={dataSourcePath}
              setDataSourcePath={setDataSourcePath}
              onNext={handleNextStep1}
              onBack={handleBack}
            />
          }
        />
        <Route
          path="/step2"
          element={
            <Step2AddColumns
              streamId={streamId}
              onNext={handleNextStep2}
              onBack={handleBack}
            />
          }
        />
        <Route
          path="/step3"
          element={
            <Step3Aggregation
              columns={columns}
              onNext={handleNextStep3}
              //setAggregatedColumns={setAggregatedColumns} 
              onBack={handleBack}
            />
          }
        />
        <Route
          path="/input-monitor"
          element={
            <InputMonitor
              streamId={streamId}
              onReady={() => navigate("/dashboard")}
              onBack={handleBack}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              // streamId={streamId}
              // streamName={streamName}
              // columns={columns}
              // aggregatedColumns={aggregatedColumns}
              onBack={handleBack}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;

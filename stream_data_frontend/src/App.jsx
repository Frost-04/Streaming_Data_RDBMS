import React, { useState,useEffect } from "react";
import Step1DatabaseName from "./components/Step1DatabaseName";
import Step2AddColumns from "./components/Step2AddColumns";
import Step3Aggregation from "./components/Step3Aggregation";
import Home from "./components/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import LoadingPage from "./components/LoadingPage";
//import InputMonitor from "./components/InputMonitor";


const App = () => {
  const [streamName, setStreamname] = useState("");
  const [windowType, setWindowtype] = useState("");
  const [windowSize, setWindowsize] = useState(0);
  const [windowVelocity, setWindowvelocity] = useState(0);
  const [dataSourceType, setDataSourceType] = useState(""); // new
  const [dataSourcePath, setDataSourcePath] = useState("");
  const [streams, setStreams] = useState([]);
  const [columns, setColumns] = useState([]);
  const [streamId, setStreamId] = useState(null);  // New state to store streamId
  const [currentStep, setCurrentStep] = useState(0);
  const [isMonitorReady, setIsMonitorReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    if (currentStep === 4) {
      const timer = setTimeout(() => {
        setCurrentStep(5);
      }, 3000);
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [currentStep]);

const handleNewUser = () => {
  setCurrentStep(1); // Go to Step 1 for new user
};

const handleReturningUserLogin = () => {
  setCurrentStep(5); // Go to Dashboard (Step 5) if login is successful
};


  const handleNextStep1 = async () => {
    if (streamName && windowType && windowSize && windowVelocity && dataSourceType && dataSourcePath) {
      const payload = {
        streamName,
        windowType,
        windowSize,
        windowVelocity,
        dataSourceType,
        dataSourcePath,
      };

      try {
        const response = await fetch("http://localhost:8081/ingestion/stream-master", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        console.log("Payload to be sent:", payload);
        if (!response.ok) {
          throw new Error("Failed to submit stream info.");
        }

        const result = await response.json();
        setStreams(result);
        if (result && result.streamId) {
          setStreamId(result.streamId); // Ensure streamId is set correctly
        }
        setCurrentStep(2); // Transition to Step 2
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
    setCurrentStep(3); // Transition to Step 3 after Step 2
  };

  const handleNextStep3 = async () => {
    try {
      // Hit the create-table API on Step 3
      const response1 = await fetch(`http://localhost:8081/api/tables/create-table/${streamId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!response1.ok) {
        throw new Error("Failed to create table.");
      }
      alert("Table created successfully!");
      setCurrentStep(4); // You can optionally reset state or redirect after creation
    } catch (error) {
      console.error("Error creating table:", error);
      alert("Error creating table.");
    }
  };

  console.log(streams);
  console.log(isMonitorReady);
  return (
    <div>
      {currentStep === 0 && (
        <Home onNewUser={handleNewUser} onReturningUser={() => setCurrentStep(6)} />
      )}
      {currentStep === 6 && (
        <Login onLogin={handleReturningUserLogin} />
      )}
      {currentStep === 1 && (
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
        />
      )}
      {currentStep === 2 && (
        <Step2AddColumns
          streamId={streamId}
          onNext={handleNextStep2}
        />
      )}
      {currentStep === 3 && (
  <Step3Aggregation
  columns={columns}
  onNext={handleNextStep3} // Call the handleNextStep3 when "Next" is clicked
  />
)}
     {currentStep === 4 && (
  <LoadingPage
  />
)}

{currentStep === 5 && (
  <Dashboard streamId={streamId} streamName={streamName} />
)}

    </div>
  );
 
};

export default App;

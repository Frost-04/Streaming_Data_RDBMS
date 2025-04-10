
import React, { useState } from "react";
import Step1DatabaseName from "./components/Step1DatabaseName";
import Step2SchemaDesign from "./components/Step2SchemaDesign";
import Step3DataSource from "./components/Step3DataSource";
import Step4WindowSpec from "./components/Step4WindowSpec";

const App = () => {
  const [step, setStep] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [databaseName, setDatabaseName] = useState("");
  const [tables, setTables] = useState([]);
  const [dataSource, setDataSource] = useState({
    type: "",
    value: "",
  });
  const [windowSpec, setWindowSpec] = useState({
    type: "",
    measure: "",
    value: "",
    velocity: "",
  });


  const handleFinish = () => {
    console.log("Final Schema:", {
      databaseName,
      tables,
      dataSource,
      windowSpec,
    });
    alert("Schema Created Successfully!");
    setIsFinished(true);
  };

  const validateStep = () => {
    if (step === 1) {
      return databaseName.trim() !== "";
    }

    if (step === 2) {
      return tables.length > 0 && tables.every(table =>
        table.name.trim() &&
        table.columns.length > 0 &&
        table.columns.every(col =>
          col.name.trim() && col.datatype && col.key
        )
      );
    }

    if (step === 3) {
      return dataSource.type && dataSource.value.trim();
    }

    if (step === 4) {
      const { type, value, measure, velocity } = windowSpec;
      if (!type || !value || !velocity) return false;
      if (type === "time" && !measure) return false;
      return true;
    }

    return false;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    } else {
      alert("Please fill all required fields before continuing.");
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <>
      {step === 1 && (
        <Step1DatabaseName
          databaseName={databaseName}
          setDatabaseName={setDatabaseName}
          onNext={handleNext}
        />
      )}
      {step === 2 && (
        <Step2SchemaDesign
          tables={tables}
          setTables={setTables}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
      {step === 3 && (
        <Step3DataSource
          dataSource={dataSource}
          setDataSource={setDataSource}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
      {step === 4 && (
        <Step4WindowSpec
          windowSpec={windowSpec}
          setWindowSpec={setWindowSpec}
          onBack={handleBack}
          onNext={handleFinish} // Only this step has the "Finish" button
        />
      )}
      {isFinished && (
        <div className="bg-gray-100 mt-8 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">
            Final JSON Schema
          </h2>
          <pre className="whitespace-pre-wrap bg-white p-4 rounded border text-sm overflow-auto text-gray-800">
            {JSON.stringify(
              { databaseName, tables, dataSource, windowSpec },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </>
  );
  
};

export default App;

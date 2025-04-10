import { useState } from "react";
import Database from "./database";
import Schema from "./schema";

const Wizard = () => {
  const [step, setStep] = useState(1);
  const [dbInfo, setDbInfo] = useState({
    dbName: "",
    numTables: 1,
    tables: [],
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateDbInfo = (data) => setDbInfo(data);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        {step === 1 && (
          <Database dbInfo={dbInfo} updateDbInfo={updateDbInfo} nextStep={nextStep} />
        )}
        {step === 2 && (
          <Schema dbInfo={dbInfo} updateDbInfo={updateDbInfo} prevStep={prevStep} />
        )}
      </div>
    </div>
  );
};

export default Wizard;



// function Wizard() {
//     return (
//       <div className="p-10">
//         <h2 className="text-2xl font-semibold">Wizard Page</h2>
//         <p>This is your multi-step form page.</p>
//       </div>
//     );
//   }
  
//   export default Wizard;
  
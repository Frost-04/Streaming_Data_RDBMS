import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/wizard'); // redirect to wizard
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Stream Data Management System</h1>
      <button
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleStart}
      >
        Start
      </button>
    </div>
  );
}

export default Home;

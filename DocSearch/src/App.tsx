import { useState } from 'react';
import './App.css';
import InputForm from './components/InputForm';
import Results from './components/Results';

interface result {
    score: number;
    searchText: string;
}

function App() {
  const [results, setResults] = useState<result[]>([]);

  const handleSearch = (searchResults: result[]) => {
    setResults(searchResults);
  };

  return (
    <div className="app-container flex bg-green-100">
      <div className="w-1/2 mx-auto p-6 ">
        <h1 className="text-2xl font-bold mb-4">DocSearch</h1>
        <InputForm onSearch={handleSearch} />
      </div>
      <div className="w-1/2 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Search Results</h1>
        <Results results={results} />
      </div>
    </div>
  );
}

export default App;
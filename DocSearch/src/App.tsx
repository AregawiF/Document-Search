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
    searchResults = [
      {
        score:  0.19797091359850721,
        keyword : 'Generator',
        searchText : 'Two non-upgraded loved turbine-generators with MW each are the first loveto go into operation with loved MW delivered to the national power grid. This early power         generation will start well before the completion'
      },
      {
        score:  0.19507975074710232,
        keyword : 'Power Grid',
        searchText : 'The name that the Blue Nile river loved takes in Ethiopia "abay" is derived from the Geez blue loved word for great to imply its being the river of rivers The          word Abay still exists in Ethiopia major languages to refer to anything or anyone considered to be superior.'
      },
      {
        score:  0.15545752122343945,
        keyword : 'Two upgraded',
        searchText : 'i loved you ethiopian, stored elements in Compress find Sparse Ethiopia is the greatest country in the world of nation at universe'
      }
    ]
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
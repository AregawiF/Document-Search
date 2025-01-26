import React, { useState } from 'react';
import { FaLink, FaSearch } from 'react-icons/fa';

const InputForm = ({ onSearch }) => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [textInput, setTextInput] = useState('');
  const [query, setQuery] = useState('');
  const [outputCount, setOutputCount] = useState(1);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const searchResults = []; // Placeholder for actual search results
//     onSearch(searchResults);
//   };

    const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let combinedSources: string[] = [];

    // Process file input
    if (file) {
      try {
        const fileContent = await readFileContent(file);
        combinedSources.push(fileContent);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }

    // Process URL input
    if (url.trim() !== '') {
      combinedSources.push(`URL: ${url}`); // Add URL as a string (you can fetch content from the URL if needed)
    }

    // Process text input
    if (textInput.trim() !== '') {
      combinedSources.push(textInput);
    }

    // Ensure there's at least one source
    if (combinedSources.length === 0) {
      alert('Please provide at least one input source (File, URL, or Text).');
      return;
    }

    // Pass the combined sources and query to your model
    const searchResults = []; // Replace with actual call to your model
    onSearch(searchResults.slice(0, outputCount)); // Pass the desired number of results to onSearch
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 space-y-6 w-full max-w-3xl"
      >

        {/* File Upload */}
        <div className="flex items-center border border-gray-300 rounded-lg p-3 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400">
          <input
            type="file"
            accept=".txt,.docx,.pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="flex-1 text-gray-700 text-sm outline-none"
          />
        </div>

        {/* URL Input */}
        <div className="flex items-center border border-gray-300 rounded-lg p-3 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400">
          <FaLink className="text-gray-500" />
          <input
            type="url"
            placeholder="Enter website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 ml-3 text-gray-700 text-sm outline-none"
          />
        </div>

        {/* Text Area */}
        <textarea
          placeholder="Enter text..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="border border-gray-300 rounded-lg w-full h-80 p-4 text-sm text-gray-700 outline-none resize-none hover:border-blue-400 focus:ring-2 focus:ring-blue-400"
        />

        {/* Query Input */}
        <div className="flex items-center border border-gray-300 rounded-lg p-3 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Enter query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 ml-3 text-gray-700 text-sm outline-none"
          />
        </div>

        {/* Output Count */}
        <div className="flex items-center space-x-3">
            <span className="text-gray-700 text-sm">Number of outputs:</span>
          <button
            type="button"
            onClick={() => setOutputCount(Math.max(1, outputCount - 1))}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            -
          </button>
          <input
            type="number"
            value={outputCount}
            readOnly
            className="border border-gray-300 text-center w-16 p-2 rounded-lg"
          />
          <button
            type="button"
            onClick={() => setOutputCount(outputCount + 1)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            +
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default InputForm;

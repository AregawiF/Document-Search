import React, { useState } from 'react';
import { FaLink, FaSearch } from 'react-icons/fa';
import { pdfjs } from 'react-pdf';


pdfjs.GlobalWorkerOptions.workerSrc = `pdf.worker.min.mjs`;


interface InputFormProps {
  onSearch: (searchResults: any[]) => void;  // Define the onSearch prop type
}

const InputForm = ({ onSearch } : InputFormProps) => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [textInput, setTextInput] = useState('');
  const [query, setQuery] = useState('');
  const [outputCount, setOutputCount] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state

    const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const extractTextFromPDF = async (file: File): Promise<string[]> => {
  return new Promise<string[]>(async (resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const loadingTask = pdfjs.getDocument(e.target?.result as string);
        const pdf = await loadingTask.promise;

        let allText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Join all text items from the page
          const pageText = textContent.items.map((item) => (item as any).str).join(' ');
          allText += pageText + '\n'; // Separate pages with a newline
        }

        // Process and split the combined text into paragraphs
        const paragraphs = allText
          .split('\n') // Split by lines first
          .map((line) => line.trim()) // Remove extra spaces
          .filter((line) => line.length > 0); // Remove empty lines

        // Combine lines into paragraphs based on capitalization, numbers, or bullet points
        const groupedParagraphs = paragraphs.reduce((acc, line) => {
          const startsWithNumberOrBullet = /^\d+\.|\•|\-/.test(line);
          const startsWithCapital = /^[A-Z]/.test(line);

          if (startsWithNumberOrBullet || startsWithCapital) {
            acc.push(line);
          } else if (acc.length > 0) {
            acc[acc.length - 1] += ' ' + line; // Append to the previous paragraph
          } else {
            acc.push(line);
          }

          return acc;
        }, [] as string[]);

        resolve(groupedParagraphs);
      } catch (error) {
        reject(error);
        console.error('Failed to extract text from PDF:', error);
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let combinedSources: string[] = [];

    // Process file input
    if (file) {
      try {

        let fileContent: string[] | string = '';

        if(file.type === 'application/pdf'){
              fileContent = await extractTextFromPDF(file);
              const cleanedPdfContent = (fileContent as string[]).map((str) => str.replace(/[^\x20-\x7E\n\\]/g, "").trim()).filter(str => str.length > 0);

              combinedSources.push(...cleanedPdfContent); 
              console.log('PDF content:', fileContent);
              console.log('PDF content strings:', cleanedPdfContent);

        } else {
        const fileContent = await readFileContent(file);
        const fileContentStrings = fileContent.split('\n'); // Split content by paragraphs
        const cleanedFileContent = fileContentStrings.map((str) => str.replace(/[^\x20-\x7E\n\\]/g, "").trim()).filter(str => str.length > 0);


        combinedSources.push(...cleanedFileContent); // Add each paragraph as a separate string
        console.log('File content:', fileContent);
        console.log('File content strings:', cleanedFileContent);
      }
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }

    
    // Process text input
    if (textInput.trim() !== '') {
        const textInputStrings = textInput.split('\n'); // Split content by paragraphs
        
        // Clean up each text input string to avoid any invalid characters
        
        const cleanedInputStrings = textInputStrings.map((str) => str.replace(/[^\x20-\x7E\n\\]/g, "").trim()).filter(str => str.length > 0);

        console.log('Text input strings:', cleanedInputStrings);
        
        combinedSources.push(...cleanedInputStrings); // Add each cleaned paragraph as a separate string
        }
    
    // Ensure there's at least one source
    if (combinedSources.length === 0 && url.trim() === '') {
      alert('Please provide at least one input source (File, URL, or Text).');
      return;
    }
    
    if (query.trim() === '') {
      alert('Please provide a query.');
      return;
    }

    const requestBody = {
      query: query,
      docs: combinedSources,
      url: url,
      outputCount: outputCount,
    };

    setLoading(true);

    try {
      const response = await fetch('https://document-search-r3wt.onrender.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody), // Send data to API
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Search results:', data.results);
        onSearch(data.results.slice(0, outputCount)); // Pass search results to parent component
      } else {
        console.error('Failed to fetch search results:', response.statusText);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
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
            className="flex-1 text-gray-700 text-lg outline-none"
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
            className="flex-1 ml-3 text-gray-700 text-lg outline-none"
          />
        </div>

        {/* Text Area */}
        <textarea
          placeholder="Enter text..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="border border-gray-300 rounded-lg w-full h-80 p-4 text-lg text-gray-700 outline-none resize-none hover:border-blue-400 focus:ring-2 focus:ring-blue-400"
        />

        {/* Query Input */}
        <div className="flex items-center border border-gray-300 rounded-lg p-3 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Enter query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 ml-3 text-gray-700 text-lg outline-none"
          />
        </div>

        {/* Output Count */}
        <div className="flex items-center space-x-3">
            <span className="text-gray-700 text-lg">Number of outputs:</span>
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

        {/* Loading Indicator */}
        {loading && (
            <div className="flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
        )}

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

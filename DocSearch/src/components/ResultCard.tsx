interface Result {
  similarityScore: number;
  searchText: string;
}

// const ResultCard = ({ result }: { result: Result }) => {
//   return (
//     <div className="result-card border border-gray-300 p-4 rounded shadow-md hover:shadow-lg transition">
//       <h3 className="font-bold text-lg">Similaritas score: {result.similarityScore}</h3>
//       <p className="text-gray-700">KeyWord: {result.keyword}</p>
//       <p className="text-gray-600">SearchText: {result.searchText}</p>
//     </div>
//   );
// };

// export default ResultCard;

const ResultCard = ({ result }: { result: Result }) => {
  return (
    <div className="result-card bg-white border border-gray-300 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out w-full">
      <h3 className="font-bold text-lg text-blue-600">
        Similarity Score: <span className="text-gray-800">{result.similarityScore}</span>
      </h3>
      <p className="text-gray-600 mt-2">
        <span className="font-semibold text-blue-500">Search Text:</span> {result.searchText}
      </p>
    </div>
  );
};

export default ResultCard;

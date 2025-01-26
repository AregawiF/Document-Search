const ResultCard = ({ result }: { result: any }) => {
  return (
    <div className="result-card bg-white border border-gray-300 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out w-full">
      <h3 className="font-bold text-lg text-blue-600">
        Similarity Score: <span className="text-gray-800">{result[1]}</span>
      </h3>
      <p className="text-gray-600 mt-2 line-clamp-2">
        <span className="font-semibold text-blue-500">Search Text:</span> {result[0]}
      </p>
    </div>
  );
};

export default ResultCard;

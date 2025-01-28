import ResultCard from "./ResultCard";

interface Result {
  similarityScore: number;
  searchText: string;
}

const Results = ({ results }: { results: Result[] }) => {
  return (
    <div className="results-container grid grid-cols-1  gap-6">
      {results.map((result, index) => (
        <ResultCard key={index} result={result} />
      ))}
    </div>
  );
};

export default Results;

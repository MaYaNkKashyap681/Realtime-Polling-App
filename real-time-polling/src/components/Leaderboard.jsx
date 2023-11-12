import React from 'react';

const Leaderboard = ({ scores, userName }) => {
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  const downloadJson = () => {
    const jsonContent = JSON.stringify(sortedScores, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leaderboard.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8">
      <div>Your Score {scores[userName]}</div>
      <h2 className="text-3xl font-bold mb-4 text-center">Leaderboard</h2>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={downloadJson}
      >
        Download Leaderboard (JSON)
      </button>
      <table className="min-w-full bg-white border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-3 px-6 text-center border-b">Name</th>
            <th className="py-3 px-6 text-center border-b">Points</th>
          </tr>
        </thead>
        <tbody>
          {sortedScores.map(([name, points], index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
              <td className="py-3 px-6 border-b">{name}</td>
              <td className="py-3 px-6 border-b">{points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

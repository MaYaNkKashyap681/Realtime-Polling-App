import React, { useState, useEffect } from 'react';
import socket from '../socket';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const PollPage = ({ userName, roomId }) => {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [timeRem, setTimeRem] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [participants, setParticipants] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [scores, setScores] = useState(null);

  useEffect(() => {
    async function socketCode() {
      socket.on('question', ({ question }) => {
        setQuestion(question);
        setSelected(null);
      });

      socket.on('timer', ({ time }) => {
        setTimeRem(time);
      });

      socket.on('answerResult', ({ result }) => {
        if (result === 'correct') {
          toast.success('You Got It Correct');
          setIsCorrect(true);
        } else {
          toast.error('You Got It Wrong');
          setIsCorrect(false);
        }
      });

      socket.on('ended', () => {
        setIsEnded(true);
        socket.emit('finalscores', {
          roomId: roomId,
        });

        socket.on('scores', ({ scores }) => {
          setScores(scores);
        });
      });

      socket.on('newusercount', ({ clientsNumber }) => {
        setParticipants(clientsNumber);
      });
    }

    socketCode();

    return () => {
      // Cleanup if needed
    };
  }, [roomId]);

  const handleOptionSelect = (index) => {
    if (selected) {
      toast.error('Cannot select more than Once');
      return;
    }
    setSelected(index);
    socket.emit('optionMark', {
      option: index,
      roomId: roomId,
      userName: userName,
    });
  };

  const renderLeaderboard = () => {
    if (scores) {
      const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

      return (
        <div className="mt-8">
          <div>Your Score {scores[userName]}</div>
          <h2 className="text-3xl font-bold mb-4 text-center">Leaderboard</h2>
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-3 px-6 text-center border-b ">Name</th>
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
    }

    return null;
  };

  return (
    <div className="text-center w-[80%] mx-auto">
      {isEnded ? (
        <>
          <div className="text-2xl font-bold mb-4">Quiz Ended</div>
          {renderLeaderboard()}
        </>
      ) : (
        <>
          <div className="mb-4">
            <span className="font-bold">Total Participants:</span> {participants}
          </div>
          {question ? (
            <div>
              <h4 className="font-bold text-xl">{question.description}?</h4>

              <div>{question.image.file && <img src={question.image.url} alt="Question" />}</div>

              <div className="flex gap-4 w-full mt-4">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`text-lg p-2 ${
                      selected === index
                        ? isCorrect
                          ? 'bg-green-400'
                          : 'bg-red-400'
                        : 'bg-gray-200'
                    } w-full rounded-lg cursor-pointer hover:bg-gray-400`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xl">Question Upcoming...</p>
          )}
          <div>{timeRem && <span>Time Remaining (Sec.) {timeRem}</span>}</div>
        </>
      )}
    </div>
  );
};

export default PollPage;

import React, { useState, useEffect } from 'react';
import socket from '../socket';
import toast from 'react-hot-toast';

const PollPage = ({ userName, roomId }) => {

  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [timeRem, setTimeRem] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    async function socketCode() {
      socket.on('question', ({ question }) => {
        setQuestion(question)
        // alert('Question Recieved')
        setSelected(null);
      })
      socket.on('timer', ({ time }) => {
        setTimeRem(time)
      })

      socket.on('answerResult', ({ result }) => {
        if (result === 'correct') {
          toast.success('You Got It Correct')
          setIsCorrect(true)
        } else {
          toast.error('You Got It Wrong')
          setIsCorrect(false)
        }
      })

      socket.on('ended', ({ ends }) => {
        window.location.href = "/qended"
      })
    }
    socketCode();
    return () => {

    }
  }, [])

  const handleOptionSelect = (index) => {
    if (selected) {
      toast.error('Cannot select more than Once')
      return;
    }
    setSelected(index);
    socket.emit('optionMark', {
      option: index,
      roomId: roomId,
      userName: userName
    })
  }

  return (
    <div className="text-center w-[80%] mx-auto">
      {question ? (
        <div>
          <h4 className='font-bold text-xl'>{question.description}?</h4>

          <div>
            {
              question.image.file && <img src={question.image.url} />
            }
          </div>

          <div className='flex gap-4 w-full mt-4'>
            {
              question.options.map((option, index) => (
                <div key={index} className={`text-lg p-2 ${selected === index
                  ? isCorrect
                    ? 'bg-green-400' // Selected and Correct
                    : 'bg-red-400'   // Selected but Incorrect
                  : 'bg-gray-200'      // Not Selected
                  } w-full rounded-lg cursor-pointer hover:bg-gray-400`}
                  onClick={() => handleOptionSelect(index)}>
                  {
                    option
                  }
                </div>
              ))
            }
          </div>
        </div>
      ) : (
        <p className="text-xl">Question Upcoming...</p>
      )}
      <div>
        {
          timeRem && <span>Time Remaining (Sec.) {timeRem}</span>
        }
      </div>
    </div>
  );
};

export default PollPage;

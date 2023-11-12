// Question.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setQuestionDescription,
  setAudioFile,
  setImageFile,
  setOptions,
  resetQuestionState,
  selectQuestion,
  setCorrectOption
} from './../store/question.js';
import socket from '../socket.js';

const Question = () => {

  const roomId = localStorage.getItem('room')
  const dispatch = useDispatch();
  const questionDescription = useSelector(selectQuestion);

  const handleQuestionDescriptionChange = (e) => {
    dispatch(setQuestionDescription(e.target.value));
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    const name = file.name;
    const url = URL.createObjectURL(file);

    if (type === 'audio') {
      dispatch(setAudioFile(file));
    } else if (type === 'image') {
      dispatch(setImageFile({ file, name, url }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionDescription.question.options];
    newOptions[index] = value;
    dispatch(setOptions(newOptions));
  };

  const handleAddToPoll = () => {
    try {
      // if (!questionDescription.question.description || questionDescription.question.options.any('')) return
      socket.emit('createquestion', {
        "roomId": roomId,
        "question": questionDescription,
        "adminName": "Mayank"
      })
    }
    catch (err) {

    }
  };


  const handleCorrectOptionChange = (e) => {
    dispatch(setCorrectOption(e.target.value - 1))
  }

  const handleEndPoll = () => {
    socket.emit('quizend', {
      "roomId": roomId
    })
  }

  useEffect(() => {
    async function socketCode() {
      socket.on('cumulativeScores', ({ scores }) => {
        console.log(scores)
      })
    }
    socketCode();
    return () => {

    }
  }, [])

  return (
    <section className='w-[80%] mx-auto mt-[2rem]'>
      <div>
        <h2 className="text-3xl font-bold ">Create Question</h2>
      </div>

      <div className="mt-[1rem]">
        <div>
          <span>Question Description</span>
          <textarea
            value={questionDescription.question.description}
            onChange={handleQuestionDescriptionChange}
            className="h-[10rem] w-full p-3 border-[2px] border-gray-500 border-dotted rounded-lg resize-none focus:outline-none"
          ></textarea>
        </div>
        <div className="mt-4 gap-3">
          {questionDescription.question.image.file === null && (
            <>
              <label htmlFor="imageInput" className='bg-blue-200 flex items-center justify-center p-1 w-[12rem]'>
                Select Image
              </label>
              <input
                type="file"
                id="imageInput"
                className='hidden'
                onChange={(e) => handleFileChange(e, 'image')}
              />
            </>
          )}
          {questionDescription.question.image.file && (
            <div className='bg-red-400 p-1 flex items-center justify-center text-white w-[12rem] cursor-pointer' onClick={() => dispatch(setImageFile({ file: null, name: '', url: '' }))}>
              Remove File
            </div>
          )}
          {questionDescription.question.image.file && (
            <img
              src={questionDescription.question.image.url}
              alt="Preview"
              className="mt-2 max-w-full h-auto"
            />
          )}
        </div>
        <div className="mt-4">
          <span>Options</span>
          {questionDescription.question.options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="block w-full p-3 border-[2px] border-gray-500 border-dotted rounded-lg mt-2"
              placeholder={`Option ${index + 1}`}
            />
          ))}
        </div>

        <div className=''>
          <input type="text" className='block w-full p-3 border-[2px] border-gray-500 border-dotted rounded-lg mt-2' placeholder='Enter Option 1 - 4 which is Correct' onChange={handleCorrectOptionChange}></input>

        </div>
        <div className='bg-green-400 text-white flex items-center justify-center p-2 mt-[1rem] cursor-pointer hover:bg-green-500' onClick={handleAddToPoll}>
          Add to Poll
        </div>
      </div>

      <div className='bg-red-400 w-fit text-white flex items-center justify-center p-2 mt-[1rem] cursor-pointer hover:bg-green-500 text-xs' onClick={handleEndPoll}>
        End Quiz
      </div>
    </section>
  );
};

export default Question;

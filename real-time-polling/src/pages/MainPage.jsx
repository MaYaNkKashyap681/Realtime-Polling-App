import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import QuestionPage from './QuestionPage';
import PollPage from '../components/PollPage';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectQuestion } from '../store/question';
import socket from '../socket';

const MainPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { state } = location;
  const { user, hasGenerated } = state || {};
  const { roomId } = useParams();
  const totalUsers = useSelector((state) => state.totalUsers);
  const question = useSelector(selectQuestion);

    useEffect(() => {
        async function socketCode() {
            
            socket.emit('joinroom', {
                roomId,
                userName: location.state?.user,
            })
            socket.on('newusercount', ({ clientsNumber }) => {
                setTotalUsers(clientsNumber)
            })
        }
        socketCode();
        return () => {
        }
    }, [])

    
    return (
        <div>

            <div className='bg-red-500 text-white flex items-center justify-center'>{totalUsers}</div>
            {hasGenerated ? (
                // Render Question page if hasGenerated is true
                <QuestionPage/>
            ) : (
                // Render Polling page if hasGenerated is false
                <PollPage userName = {location.state?.user} roomId = {roomId}/>
            )}
        </div>
    );
};

export default MainPage;

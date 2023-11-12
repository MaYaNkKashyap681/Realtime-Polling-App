import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import socket from '../socket';

const EndQuiz = () => {

    const { roomId } = useParams();
    const [scores, setScores] = useState(null)

    function handleViewScore() {
        console.log('Clicked')
        socket.emit('finalscores', {
            roomId: roomId
        })
        socket.on('scores', ({ scores }) => {
            console.log("Getting Scores")
            setScores(scores);
        })
    }
    return (
        <>
            <div className='flex items-center justify-center text-3xl font-bold'>
                Thanks For Partcipating

            </div>
            <div className='w-full text-center flex items-center justify-center'>
                {
                    !scores && <><h4 className='text-sm p-2 mt-4 bg-blue-400 w-fit' onClick={handleViewScore}>View Score</h4></>
                }
                {
                    scores && <h4>Scores ...</h4>
                }
            </div>
        </>
    )
}

export default EndQuiz
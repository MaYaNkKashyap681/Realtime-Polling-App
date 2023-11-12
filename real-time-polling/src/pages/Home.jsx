import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidV4 } from 'uuid';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'qrcode.react';

const Homepage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [roomId, setRoomId] = useState('');
  const [user, setUser] = useState('');
  const [qrShow, setQrShow] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomIdParam = params.get('room_id');

    if (roomIdParam) {
      // If room_id param exists, set it in the state
      setRoomId(roomIdParam);
    }
  }, [location.search]);

  const handleGenerate = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);

    // Generate and set a session token for the creator
    const sessionToken = uuidV4();
    sessionStorage.setItem('sessionToken', sessionToken);

    // Set hasGenerated to true
    setHasGenerated(true);

    toast.success('Created a new room');
  };

  const handleJoin = () => {
    if (!roomId || !user) {
      toast.error('Fields cannot be Empty');
      return;
    }

    navigate(`/poll/${roomId}`, {
      state: {
        user: user,
        hasGenerated: hasGenerated, // Pass hasGenerated state
      },
    });
    localStorage.setItem('room', roomId);
  };

  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
      handleJoin();
    }
  };

  const handleQrShow = () => {
    if (roomId.length === 0) {
      toast.error('Enter Room Id');
      return;
    }
    setQrShow(true);
  };

  const handleDownloadQRCode = () => {
    const canvas = document.getElementById('qrcode-canvas');
    const dataUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = `room_${roomId}_qrcode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleCopyLink = () => {
    const link = `http://localhost:5173?room_id=${roomId}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className='h-[100vh] w-full flex justify-center items-center bg-gray-800'>
      <div className={`w-[40rem] h-full flex p-4 bg-cover bg-center  container mx-auto justify-center`}>
        <div className='w-full'>
          <h3 className='text-5xl text-white font-extralight'>
            <span className='font-allura text-yellow-400'>PollMate</span>
          </h3>
          <div className='w-full mt-[2rem]'>
            <form className='w-full flex flex-col gap-4'>
              <div className='flex flex-col '>
                <span className='text-xs text-white bg-green-700 p-2'>Room Id* :</span>
                <input
                  type='text'
                  placeholder='Example: 2323242'
                  className='focus:outline-none text-sm px-1 py-2 rounded-sm bg-gray-900 text-white'
                  value={roomId}
                  name='roomid'
                  onChange={(e) => setRoomId(e.target.value)}
                  onKeyUp={handleInputEnter}
                />
              </div>
              <div className='flex flex-col'>
                <span className='text-xs text-white bg-green-700 p-2'>Username* :</span>
                <input
                  type='text'
                  placeholder='Example: Mayank Kashyap'
                  className='focus:outline-none text-sm px-1 py-2 rounded-sm bg-gray-900 text-white'
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  onKeyUp={handleInputEnter}
                />
              </div>
            </form>
            <div className='mt-[1rem] flex justify-between items-center'>
              <button className='text-white shadow-lg bg-green-600 text-sm px-5 py-1 rounded-sm' onClick={handleJoin}>
                Join
              </button>
              <button
                className='text-white shadow-lg bg-blue-600 text-sm px-5 py-1 rounded-sm'
                onClick={handleQrShow}
              >
                Show QR Code
              </button>
            </div>
            <p className='text-white text-[12px]'>
              Want to Create a new room ?
              <span
                className='text-[10px] text-green-900 ml-[0.4rem] cursor-pointer bg-yellow-200 p-[0.2rem]'
                onClick={handleGenerate}
              >
                Generate
              </span>
            </p>
          </div>
          {qrShow && (
            <div className='mt-4'>
              <p className='text-white text-[12px]'>QR Code for Room ID:</p>
              <QRCode id='qrcode-canvas' value={`http://localhost:5173?room_id=${roomId}`} size={128} />
              <button
                className='text-white shadow-lg bg-blue-600 text-sm px-5 py-1 rounded-sm mt-2'
                onClick={handleDownloadQRCode}
              >
                Download QR Code
              </button>
              <button
                className='text-white shadow-lg bg-yellow-500 text-sm px-5 py-1 rounded-sm mt-2'
                onClick={handleCopyLink}
              >
                Copy Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;

import { io } from 'socket.io-client';

const options = {
    'force new connection': true,
    reconnectionAttempt: 'Infinity',
    timeout: 10000,
    transports: ['websocket'],
};

const socket = io('https://realtime-polling-app.vercel.app/', options);

export default socket;

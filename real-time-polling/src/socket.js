import { io } from 'socket.io-client';

const options = {
    'force new connection': true,
    reconnectionAttempt: 'Infinity',
    timeout: 10000,
    transports: ['websocket'],
};

const socket = io('https://polling-service-o08j.onrender.com/', options);

export default socket;

const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);

// Map to store user information
const idUserMap = {};

// Map to store polling questions
const roomQuestionMap = {};

// Map to store timers
const roomTimerMap = {};

const correctAnswer = {};

const responsesTable = {};

// Function to get all clients in a room
function getAllClientsInRoom(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            userName: idUserMap[socketId],
        };
    });
}

function clientsExceptAdmin(clientArray, adminName) {
    return clientArray.filter((client) => client.userName !== adminName);
}

// Connection event
io.on('connection', (socket) => {
    // Join room event
    socket.on('joinroom', ({ roomId, userName }, err) => {
        idUserMap[socket.id] = userName;
        socket.join(roomId);
        const clientsInRoom = getAllClientsInRoom(roomId);

        // Emit new user join event to every user in the room
        clientsInRoom.forEach(({ socketId }) => {
            io.to(socketId).emit('newusercount', {
                clientsNumber: clientsInRoom.length,
            });
        });

        // If there is a question for the room, send it to the new user
        if (roomQuestionMap[roomId]) {
            io.to(socket.id).emit('question', roomQuestionMap[roomId]);
        }

        // If there is a timer for the room, send it to the new user
        if (roomTimerMap[roomId]) {
            io.to(socket.id).emit('timer', roomTimerMap[roomId]);
        }
    });

    // Create question event
    socket.on('createquestion', ({ roomId, question, adminName }) => {
        const ques = question.question;
        console.log(question);
        roomQuestionMap[roomId] = ques;
        correctAnswer[roomId] = question.correctOption;

        responsesTable[roomId] = {};

        // Emit the question to all users in the room
        const clientsInRoom = getAllClientsInRoom(roomId);
        clientsExceptAdmin(clientsInRoom, adminName).forEach(({ socketId }) => {
            io.to(socketId).emit('question', question);
        });

        // Set timer for the room (e.g., 60 seconds)
        roomTimerMap[roomId] = 10;

        // Update the timer every second and emit it to all users in the room
        const timerInterval = setInterval(() => {
            roomTimerMap[roomId]--;
            if (roomTimerMap[roomId] > 0) {
                clientsExceptAdmin(clientsInRoom, adminName).forEach(({ socketId }) => {
                    io.to(socketId).emit('timer', {
                        "time": roomTimerMap[roomId],
                    });
                });
            } else {
                clearInterval(timerInterval);
                roomQuestionMap[roomId] = null;
                roomTimerMap[roomId] = null;

                // Emit cumulative scores to all users in the room
                io.to(roomId).emit('cumulativeScores', {
                    "scores": responsesTable[roomId],
                });

                // Reset user scores for the room
                responsesTable[roomId] = {};

                clientsExceptAdmin(clientsInRoom, adminName).forEach(({ socketId }) => {
                    io.to(socketId).emit('question', {
                        "question": null,
                    });
                    io.to(socketId).emit('timer', {
                        "time": null,
                    });
                });
            }
        }, 1000);
    });

    socket.on('optionMark', ({ option, roomId }) => {
        const correctOption = correctAnswer[roomId];
        let isCorrect = false;
        if (option == correctOption) {
            isCorrect = true;
            // If the selected option is correct, emit a 'correct' event to the user
            io.to(socket.id).emit('answerResult', {
                result: 'correct',
            });
        } else {
            // If the selected option is incorrect, emit a 'wrong' event to the user
            io.to(socket.id).emit('answerResult', {
                result: 'wrong',
            });
        }

        if (!responsesTable[roomId][idUserMap[socket.id]]) {
            responsesTable[roomId][idUserMap[socket.id]] = 0;
        }

        responsesTable[roomId][idUserMap[socket.id]] += isCorrect ? 1 : 0;
    });


    socket.on('quizend', ({ roomId }) => {
        clientsExceptAdmin(getAllClientsInRoom(roomId)).forEach(({ socketId }) => {
            io.to(socketId).emit("ended", {
                "ends": true
            })
        })
    })

    // Disconnecting event
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit('leftroom', {
                socketId: socket.id,
                userName: idUserMap[socket.id],
            });
        });
        delete idUserMap[socket.id];
        socket.leave();
    });
});

// Starting the Server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

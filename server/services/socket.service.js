import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [
                'http://localhost:5173',
                'http://localhost:5000',
                process.env.FRONTEND_URL,
                process.env.RENDER_EXTERNAL_URL
            ].filter(Boolean),
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('join', (userId) => {
            if (userId) {
                socket.join(userId.toString());
                console.log(`User ${userId} joined their notification room`);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

export const emitNotification = (userId, type, data) => {
    if (io) {
        io.to(userId.toString()).emit('notification', {
            type,
            data,
            createdAt: new Date()
        });
        console.log(`Notification emitted to user ${userId}:`, type);
    }
};

require('dotenv').config();
const http = require('http');
const app = require('./app');
const setupSocketIO = require('./socket/socket-setup');

const server = http.createServer(app);

// Initialize Socket.IO with the server
setupSocketIO(server);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

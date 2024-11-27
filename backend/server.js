// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv=require('dotenv')
dotenv.config();

const app = express();
const server = http.createServer(app);

const cors=require('cors')
app.use(cors())
/**
 * 
 * http.createServer(): This method from the http module in Node.js creates an HTTP server.
app: This is the instance of your Express application. When you pass app as an argument to http.createServer(), it means the HTTP server will use the Express app to handle incoming HTTP requests.

Why Do We Use http.createServer(app)?
Normally, when you create an Express app, you can run it directly using:
javascript
Copy code
app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});
However, when you want to use Socket.io with the same server, you need to create an HTTP server explicitly to use it for both HTTP requests and real-time WebSocket communication.
The Role of server:
The server created by http.createServer(app) is now an HTTP server that:
Handles regular HTTP requests through the Express app (e.g., routes like GET /).
Supports Socket.io for real-time, bi-directional communication with clients.
In Context:
When you create the server like this:
javascript
Copy code
const server = http.createServer(app);
You can pass this server to Socket.io:
javascript
Copy code
const io = new Server(server);
This setup enables both HTTP handling (e.g., for REST APIs) and WebSocket communication through the same server.
Why Not Just Use app.listen()?
app.listen() internally calls http.createServer(app) under the hood. However, you don’t get direct access to the server instance when using app.listen(), which is required when integrating Socket.io.
By creating server manually, you can pass it to the Socket.io server and listen for both HTTP and WebSocket requests on the same port.
 */
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow requests from React dev server
        methods: ['GET', 'POST'],
    },
    /**Server: This is the part of Socket.io that helps set up a way for users (clients) and the server to talk to each other in real-time (like everyone shouting at the party and being heard immediately).
server: This is your HTTP server created earlier using http.createServer(app). It lets Socket.io use the same server that handles normal web requests. */
});

/**
 * 
 * This line sets up Socket.io on the server to allow real-time communication. Let's break down each part:

const io = new Server(server, { ... }):

Server: This is the part of Socket.io that helps set up a way for users (clients) and the server to talk to each other in real-time (like everyone shouting at the party and being heard immediately).
server: This is your HTTP server created earlier using http.createServer(app). It lets Socket.io use the same server that handles normal web requests.
 * 
 */

app.get('/', (req, res) => {
    res.send('Socket.io server is running');
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
   

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Broadcast to all connected users
    });
   

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
/**io.on('connection', (socket) => { ... }):

This line means, “When a user connects to the server, run this function.”
io.on('connection') sets up an event listener that waits for new users to connect.
socket represents the connection with the individual user.
console.log('A user connected:', socket.id):

This logs a message in the server’s console whenever a new user connects.
socket.id is a unique ID assigned to each user who connects, like a name tag at a party.
socket.on('chat message', (msg) => { ... }):

This means, “When this user sends a message called 'chat message', run this function.”
socket.on() listens for specific events from that user. In this case, we are listening for messages named 'chat message'.
io.emit('chat message', msg):

This sends the message (msg) to all connected users.
It’s like someone shouting a message in a room, and everyone in the room hears it.
socket.on('disconnect', () => { ... }):

This runs when a user disconnects from the server (closes their browser or loses connection).
The code logs, “User disconnected,” along with the user’s socket.id. */

server.listen(process.env.PORT, () => {
    console.log('Server running on http://localhost:4000');
});

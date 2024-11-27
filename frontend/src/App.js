// src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Connect to the backend server
//io is imported from socket.io-client to establish a WebSocket connection to the backend server.
//This line initializes a connection to the backend server running at http://localhost:4000 using Socket.io.


function App() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    //message: Holds the current value of the input field.
    //messages: An array to store all received chat messages.

    useEffect(() => {
        // Listen for incoming chat messages
        socket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        // Clean up the effect
        return () => socket.off('chat message');
    }, []);

    /**What Each Part Does:
socket.on('chat message', (msg) => { ... }):

This is like saying, “Hey, when you hear someone say 'chat message', do this:”
The msg is the new message that your app receives from the server.
setMessages((prevMessages) => [...prevMessages, msg]): This updates your messages list by adding the new msg to the end of it. It’s like pinning a new note on the message board.
return () => socket.off('chat message'):

This line is like saying, “When you’re done listening, stop listening.”
socket.off('chat message') tells your app to stop listening for new messages when the component is no longer shown or if the app cleans up (like when you close the chat app or go to another page). This prevents memory leaks or listening for messages when the component isn’t visible.
The [] at the end:

This empty array means the useEffect only runs once when the component is first shown on the screen. It’s like saying, “Set up this listener when the app starts, and clean it up when it ends.”
Putting It All Together:
What happens when your app starts: It sets up the listener socket.on('chat message') so that it can hear messages from the server.
What happens when a message comes in: The function setMessages is called, and it adds the new msg to the messages list.
What happens when your app is done: The return function socket.off('chat message') is run to stop listening for new messages. */

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit('chat message', message);
            setMessage('');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2>React Chat App</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {messages.map((msg, index) => (
                    <li key={index} style={{ padding: '5px 0', borderBottom: '1px solid #ccc' }}>
                        {msg}
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ width: '80%', padding: '10px', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '10px' }}>Send</button>
            </form>
        </div>
    );
}

export default App;

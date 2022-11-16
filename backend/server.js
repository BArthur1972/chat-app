const express = require('express');
const app = express();
const User = require('./models/User');
const Message = require('./models/Message');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const channels = ['general', 'tech', 'finance', 'crypto'];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);
require('./connection');

const server = require('http').createServer(app);
const PORT = 5001;
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

app.get('/', (req, res) => {
    res.send("Welcome to the Chat App");
});

server.listen(PORT, () => {
    console.log('listening to port', PORT)
});
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes')
const User = require('./models/User');
const Message = require('./models/Message')
const channels = ['General', 'Announcements', 'Career Opportunities', 'DSA for Technical Interviews', 'Interview Resources'];
const cors = require('cors');

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

async function getLastMessagesFromChannel(channel) {
	let channelMessages = await Message.aggregate([
		{ $match: { to: channel } },
		{ $group: { _id: '$date', messagesByDate: { $push: '$$ROOT' } } }
	]);
	return channelMessages;
}

// Sort messages by most recent.
function sortChannelMessagesByDate(messages) {
	return messages.sort(function (a, b) {
		let date1 = a._id.split('/');
		let date2 = b._id.split('/');

		date1 = date1[2] + date1[0] + date1[1];
		date2 = date2[2] + date2[0] + date2[1];

		return date1 < date2 ? -1 : 1;
	});
}

// socket connection
io.on('connection', (socket) => {

	socket.on('new-user', async () => {
		const members = await User.find();
		io.emit('new-user', members);
	});

	socket.on('join-channel', async (newChannel, previousChannel) => {
		socket.join(newChannel);
		socket.leave(previousChannel);
		let channelMessages = await getLastMessagesFromChannel(newChannel);
		channelMessages = sortChannelMessagesByDate(channelMessages);
		socket.emit('channel-messages', channelMessages);
	});

	// Post new message
	// We need to use the socket to notify other users that there is a new message.
	socket.on('message-channel', async (channel, content, sender, time, date) => {
		const newMessage = await Message.create({ content, from: sender, time, date, to: channel });
		let channelMessages = await getLastMessagesFromChannel(channel);
		channelMessages = sortChannelMessagesByDate(channelMessages);
		// sending a message to a channel
		io.to(channel).emit('channel-messages', channelMessages);
		socket.broadcast.emit('notifications', channel);
	});

	// Log a user out of the app
	app.delete('/logout', async (req, res) => {
		try {
			const { _id, newMessages } = req.body;
			const user = await User.findById(_id);
			user.status = "offline";
			user.newMessages = newMessages;
			await user.save();
			const members = await User.find();
			socket.broadcast.emit('new-user', members);
			res.status(200).send();
		} catch (e) {
			console.log(e);
			res.status(400).send();
		}
	});

	// Delete a users account
	app.delete('/deleteUser', async (req, res) => {
		const id = req.body._id;
		const name = req.body.name;
		try {
			await User.findByIdAndDelete(id);

			console.log(`User ${name} has been deleted`);
			res.status(200).send();
		} catch (e) {
			console.log(e);
			console.log(`Failed to delete user ${name}`);
			res.status(400).send();
		}
	});
});

// Get request for all channels
app.get('/channels', (req, res) => {
	res.json(channels);
});

// Get request for all messages
app.get("/messages", async (req, res) => {
	try {
		let messages = await Message.find();
		res.status(200).json(messages);
	} catch(e) {
		res.status(500).send("Request failed");
		console.log(e);
	}
});

app.get("/", (req, res) => {
	res.send("Welcome to the Chat App");
});

server.listen(PORT, () => {
	console.log('listening to port', PORT);
});

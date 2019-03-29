const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static middleware
app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('views', path.join(__dirname, '../views'))
app.get('/', (req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'index.html'));
});
app.get('/controller', (req, res, next) => {
	res.sendFile(path.join(__dirname, '../views/', 'controller.html'));
});

app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send(err.message || 'Internal server error');
});

const gameState = {
	players: {}
  }


io.on('connection', (socket) => {
	console.log('a user connected:', socket.id);

	socket.on('disconnect', function() {
		delete gameState.players[socket.id]
		console.log('user disconnected');
	});

	socket.on('newPlayer', (data) => {
		gameState.players[socket.id] = {
		  x: 250,
		  y: 250,
		  width: 25,
		  height: 25,
		  name: data
		}
	  });

	  socket.on('playerMovement', (playerMovement) => {
		const player = gameState.players[socket.id]
		const canvasWidth = 480
		const canvasHeight = 320
		
		if (playerMovement.left && player.x > 0) {
		  player.x -= 4
		}
		if (playerMovement.right && player.x < canvasWidth - player.width) {
		player.x += 4
	  }
		
		if (playerMovement.up && player.y > 0) {
		  player.y -= 4
		}
		if (playerMovement.down && player.y < canvasHeight - player.height) {
		  player.y += 4
		}
	  });
});

setInterval(() => {
	io.sockets.emit('state', gameState);
  }, 1000 / 60);

server.listen(PORT, () => {
	console.log('Server is live on PORT:', PORT);
});


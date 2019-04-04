const express = require('express');
const createError = require('http-errors');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const http = require('http');
const mongoose = require('mongoose');
const server = http.createServer(app);
const io = require('socket.io')(server);

/**
//Change this to match your db dumbass!d
mongoose.connect('mongodb://localhost/test');

//connect to mongo
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to mongoDB");
});
*/
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static middleware
app.use(express.static(path.join(__dirname,"..", '')));
// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');


const webRouter = require('../routes/web_routes/pages');
const apiGamesRouter = require('../routes/api/games');

app.use('/', webRouter);
app.use('/api/game', apiGamesRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});

global.games = {};


const gameState = {
	players: {},
	projectiles: []
  }

	var myInt = setInterval(function () {
    for(var i = 0; i < gameState.projectiles.length; i++){
			var proj = gameState.projectiles[i];
			//console.log(proj.x + " " + proj.y);
			proj.x += proj.dirx*6;
			proj.y += proj.diry*6;
			if(proj.x > 480 || proj.x < 0 || proj.y > 320 || proj.y < 0)
			{
				gameState.projectiles.splice(i,1);
			}
			for (let player in gameState.players) {
				var p = gameState.players[player];
				if(proj.x >= p.x && proj.x <= p.x + p.width && proj.shooter != player){
					if(proj.y >= p.y && proj.y <= p.y + p.height){
						gameState.players[player].dead = true;
						gameState.players[player].x = -10; 
							gameState.players[player].y = -10; 
						gameState.players[proj.shooter].kills++;
						gameState.projectiles.splice(i,1);
						setTimeout(function(){ 
							gameState.players[player].x = 250; 
							gameState.players[player].y = 250; 
							gameState.players[player].dead = false;
						}, 3000);
					}
				}
			}
			//console.log(proj.x + " " + proj.y);
		}
}, 1000 / 60);

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
			dead: false,
			name: data,
			kills: 0,
			
		}
	  });

	  socket.on('playerMovement', (playerMovement) => {
		var player = gameState.players[socket.id]
		const canvasWidth = 480
		const canvasHeight = 320
		
		
		if (playerMovement.left && player.x > 0) {
			player.x -= 4
			if(playerMovement.projectile){
				gameState.projectiles.push({shooter: socket.id, dirx: -1, diry: 0, x: player.x, y: player.y});
			}
		}
		else if (playerMovement.right && player.x < canvasWidth - player.width) {
		player.x += 4
		if(playerMovement.projectile){
			gameState.projectiles.push({shooter: socket.id, dirx: 1, diry: 0, x: player.x, y: player.y});
		}
	  }
		
		else if (playerMovement.up && player.y > 0) {
			player.y -= 4
			if(playerMovement.projectile){
				gameState.projectiles.push({shooter: socket.id, dirx: 0, diry: -1, x: player.x, y: player.y});
			}
		}
		else if (playerMovement.down && player.y < canvasHeight - player.height) {
			player.y += 4
			if(playerMovement.projectile){
				gameState.projectiles.push({shooter: socket.id, dirx: 0, diry: 1, x: player.x, y: player.y});
			}
		}
		else{
			
				if(playerMovement.projectile){
					gameState.projectiles.push({shooter: socket.id, dirx: 0, diry: -1, x: player.x, y: player.y});
				}
			
		}

	  });
});

setInterval(() => {
	io.sockets.emit('state', gameState);
  }, 1000 / 60);

server.listen(process.env.PORT || PORT, () => {
	console.log('Server is live on PORT:', PORT);
});


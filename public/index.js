const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const height = canvas.height;
const width = canvas.width;
const socket = io();
function join(){
  var name = document.getElementById("name").value;
  if(name == null || name == undefined || name.trim() == ""){
    name = "I'm a fuckface";
  }
  socket.emit('newPlayer', name);
  setInterval(() => {
    socket.emit('playerMovement', playerMovement);
  }, 1000 / 60);
}


const drawPlayer = (player) => {
    
    ctx.beginPath();
    ctx.rect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
    ctx.font = "15px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(player.name, player.x + 12, player.y -5); 
  };

  socket.on('state', (gameState) => {
    ctx.clearRect(0, 0, width, height)
    for (let player in gameState.players) {
      drawPlayer(gameState.players[player])
    }
  });

  const playerMovement = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  const keyDownHandler = (e) => {
    if (e.keyCode == 39) {
     playerMovement.right = true;
    } else if (e.keyCode == 37) {
      playerMovement.left = true;
    } else if (e.keyCode == 38) {
      playerMovement.up = true;
    } else if (e.keyCode == 40) {
      playerMovement.down = true;
    }
  };
  const keyUpHandler = (e) => {
    if (e.keyCode == 39) {
      playerMovement.right = false;
    } else if (e.keyCode == 37) {
      playerMovement.left = false;
    } else if (e.keyCode == 38) {
      playerMovement.up = false;
    } else if (e.keyCode == 40) {
      playerMovement.down = false;
    }
  };

  
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);
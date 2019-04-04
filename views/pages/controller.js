
const socket = io();
function join(){
  var name = document.getElementById("name").value;
  if(name == null || name == undefined || name.trim() == ""){
    name = "I'm a fuckface";
  }
  socket.emit('newPlayer', name);
  document.getElementById("name-entry").remove();
  document.getElementById("dpad").style.display = "block";
}

  const playerMovement = {
    up: false,
    down: false,
    left: false,
    right: false,
    projectile: false
  };

  function moveup() {
    playerMovement.up = true;
  }
  
  function movedown() {
    playerMovement.down = true;
  }
  
  function moveleft() {
    playerMovement.left = true;
  }
  
  function moveright() {
    playerMovement.right = true;
  }

  function stopMove() {
    playerMovement.up = false;
    playerMovement.down = false;
    playerMovement.left = false;
    playerMovement.right = false;
  }

  function shoot(){
    playerMovement.projectile = true;
  }

  function stopshoot(){
    playerMovement.projectile = false;
  }
  
  setInterval(() => {
    socket.emit('playerMovement', playerMovement);
  }, 1000 / 60);
  document.addEventListener('touchend', stopMove, false);
  document.addEventListener('mouseup', stopMove, false);
  
 
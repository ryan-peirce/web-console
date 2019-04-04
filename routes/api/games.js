var express = require('express');
var router = express.Router();
var Game = require('../../schemas/game');

/* GET games listing. */
router.get('/', function(req, res, next) {
    
});

/* POST add game */
router.post('/', function(req, res, next) {
    console.log("create game attempt: " + req.body);
    /**
    if (req.body.name && req.body.owner) {
        Game.addGame(req.body.name, req.body.owner, function(err, game){
            if(err || game == undefined){
                res.status(401);
                res.send(err);
              }
              else{
                console.log("Game created: " + game);
              }
        });
    }
    */
   global.games[req.body.game_name] = {
     name: req.body.game_name,
     owner: "admin",
     players: 0,
     game_type: "default",
     player_list: {}
   }
   console.log(global.games);
   res.send(req.body);
    
});

router.post('/join', function(req, res, next) {
 global.games[req.body.game_name].player_list[req.body.player_name] = {
   name: req.body.player_name
 }
 global.games[req.body.game_name].players = Object.keys(global.games[req.body.game_name].player_list).length;
 console.log(global.games);
 res.send(req.body);
  
});

module.exports = router;
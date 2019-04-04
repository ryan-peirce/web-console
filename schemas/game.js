var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  owner: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  players: [{
    name: String,
    id: Number
  }]
});


GameSchema.statics.addGame = function (name, owner, callback) {
  Game.findOne({ name: name })
    .exec(function (err, game) {
      if (err) {
        console.log(err);
      } else if (!game) {
        //use schema.create to insert device into the db
        Game.create({name: name, owner: owner}, function (err, game) {
          if (err) {
            console.log("Error creating game: " + err);
          } else {
            console.log("game registered");
            return callback(null, game);
          }
        });
      } else{
        console.log("The game name is taken");
      }
   
    });
}


var Game = mongoose.model('Game', GameSchema);
module.exports = Game;
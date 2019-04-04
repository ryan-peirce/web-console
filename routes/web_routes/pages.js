var express = require('express');
var router = express.Router();
const path = require('path');

router.get('/', (req, res, next) => {
	res.render('pages/index', {games: global.games});
});
router.get('/lobby', (req, res, next) => {
	res.render('pages/lobby', {game: global.games[req.query.game]});
});
router.get('/controller', (req, res, next) => {
	res.sendFile(path.join(__dirname, '../../views/pages/', 'controller.html'));
});
router.get('/game', (req, res, next) => {
	res.sendFile(path.join(__dirname, '../../views/pages/', 'testgame.html'));
});

module.exports = router;

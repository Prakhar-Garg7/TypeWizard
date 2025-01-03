const express = require('express');
const { getLeaderBoard } = require('../Controllers/leaderBoardController');

const router = express.Router();

router.get('/getLeaderBoard/:id', getLeaderBoard);

module.exports = router;
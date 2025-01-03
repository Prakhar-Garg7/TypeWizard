const express = require('express');
const { setSpeed } = require('../Controllers/speedControllers');

const router = express.Router();

router.put('/setSpeed', setSpeed);

module.exports = router;
const express = require('express');
const { getProfile } = require('../Controllers/profileControllers');

const router = express.Router();

router.put('/getProfile/:id', getProfile);

module.exports = router;
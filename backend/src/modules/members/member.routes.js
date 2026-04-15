// Declares member API routes for listing board members.
const express = require('express');
const memberController = require('./member.controller');

const router = express.Router();

router.get('/members', memberController.getMembers);

module.exports = router;

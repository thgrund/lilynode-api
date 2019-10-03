/**
 * Express Router configuration
 */
const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer();

/* Load controller */
const Controller = require('./controller');
const controller = new Controller();

/**
 * Song Entity routes
 */
router.post('/ly-converter', function (req, res) {
  controller.lyConverter(req, res);
});

router.post('/midi-converter', upload.single('midi'), function (req, res) {
  controller.midiConverter(req, res);
});

module.exports = router;

// routes/logRoutes.js
const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { authenticate } = require('../middlewares/authMiddleware');
const { Log } = require('../models'); // Assuming you have a Log model
const { Parser } = require('json2csv'); // Library to convert JSON to CSV

// Protected routes for logs
router.get('/search', authenticate, logController.searchLogs);
router.get('/export', logController.exportLogs);
router.get('/export-and-delete', authenticate, logController.exportAndDeleteLogs); // Nouvelle route
router.get('/:type/:value?', authenticate, logController.getLogs);



module.exports = router;

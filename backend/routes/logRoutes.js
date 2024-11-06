// routes/logRoutes.js
const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { authenticate } = require('../middlewares/authMiddleware');

// Protected routes for logs
router.get('/:type/:value?', authenticate, logController.getLogs);
router.get('/search', authenticate, logController.searchLogs);

module.exports = router;

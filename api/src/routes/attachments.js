/**
 * Attachments Routes
 * Маршруты для управления вложениями (polls, quizzes, surveys, lists)
 */

const express = require('express');
const router = express.Router();
const pollsController = require('../controllers/polls.controller');
const { authenticate } = require('../middleware/auth');

// Все роуты требуют аутентификации
router.use(authenticate);

// Голосования
router.post('/polls', pollsController.createPoll);
router.get('/polls/:pollId', pollsController.getPoll);
router.post('/polls/:pollId/vote', pollsController.vote);

// TODO: Добавить роуты для quizzes, surveys, lists

module.exports = router;

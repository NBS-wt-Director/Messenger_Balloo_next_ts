/**
 * Attachments Routes
 * Маршруты для управления вложениями (polls, quizzes, surveys, lists)
 */

const express = require('express');
const router = express.Router();
const pollsController = require('../controllers/polls.controller');
const quizzesController = require('../controllers/quizzes.controller');
const surveysController = require('../controllers/surveys.controller');
const listsController = require('../controllers/lists.controller');
const { authenticate } = require('../middleware/auth');

// Все роуты требуют аутентификации
router.use(authenticate);

// Голосования
router.post('/polls', pollsController.createPoll);
router.get('/polls/:pollId', pollsController.getPoll);
router.post('/polls/:pollId/vote', pollsController.vote);

// Тесты
router.post('/quizzes', quizzesController.createQuiz);
router.get('/quizzes/:quizId', quizzesController.getQuiz);
router.post('/quizzes/:quizId/submit', quizzesController.submitQuiz);
router.get('/quizzes/:quizId/results/:userId', quizzesController.getQuizResults);
router.get('/quizzes/:quizId/stats', quizzesController.getQuizStats);
router.delete('/quizzes/:quizId', quizzesController.deleteQuiz);

// Опросы
router.post('/surveys', surveysController.createSurvey);
router.get('/surveys/:surveyId', surveysController.getSurvey);
router.post('/surveys/:surveyId/submit', surveysController.submitSurvey);
router.get('/surveys/:surveyId/results/:userId', surveysController.getSurveyResults);
router.get('/surveys/:surveyId/aggregated', surveysController.getAggregatedResults);
router.delete('/surveys/:surveyId', surveysController.deleteSurvey);

// Списки
router.post('/lists', listsController.createList);
router.get('/lists/:listId', listsController.getList);
router.post('/lists/:listId/items', listsController.addListItem);
router.put('/lists/:listId/items/:itemId', listsController.updateListItem);
router.delete('/lists/:listId/items/:itemId', listsController.deleteListItem);
router.get('/lists/:listId/stats', listsController.getListStats);
router.delete('/lists/:listId', listsController.deleteList);

module.exports = router;

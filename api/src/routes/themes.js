/**
 * Themes Routes
 * Маршруты для управления темами
 */

const express = require('express');
const router = express.Router();
const themesController = require('../controllers/themes.controller');
const subscriptionsController = require('../controllers/theme-subscriptions.controller');
const { authenticate } = require('../middleware/auth');

// Все роуты требуют аутентификации
router.use(authenticate);

// Темы
router.get('/', themesController.getThemes);
router.post('/', themesController.createUserTheme);
router.delete('/:id', themesController.deleteUserTheme);
router.post('/favorites', themesController.addToFavorites);
router.delete('/favorites/:id', themesController.removeFromFavorites);

// Подписки
router.get('/subscriptions', subscriptionsController.getStatus);
router.post('/subscriptions', subscriptionsController.activate);
router.delete('/subscriptions', subscriptionsController.cancel);

module.exports = router;

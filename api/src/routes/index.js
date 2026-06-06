/**
 * API Routes
 * Подключение всех маршрутов
 */

const express = require('express');
const router = express.Router();

// Middleware
const { authenticate, optionalAuth, requireAdmin } = require('../middleware/auth');

// Controllers
const authController = require('../controllers/auth.controller');
const usersController = require('../controllers/users.controller');
const yandexAuthController = require('../controllers/yandex-auth.controller');
const yandexDiskController = require('../controllers/yandex-disk.controller');
const chatsController = require('../controllers/chats.controller');
const messagesController = require('../controllers/messages.controller');
const contactsController = require('../controllers/contacts.controller');
const notificationsController = require('../controllers/notification.controller');
const invitationsController = require('../controllers/invitations.controller');
const groupsController = require('../controllers/groups.controller');
const adminController = require('../controllers/admin.controller');
const reportsController = require('../controllers/reports.controller');
const statusesController = require('../controllers/statuses.controller');
const searchController = require('../controllers/search.controller');
const syncController = require('../controllers/sync.controller');
const webrtcController = require('../controllers/webrtc.controller');
const callsController = require('../controllers/calls.controller');
const pagesController = require('../controllers/pages.controller');
const featuresController = require('../controllers/features.controller');
const bansController = require('../controllers/bans.controller');
const notificationController = require('../controllers/notification.controller');

// Multer для загрузки файлов
const multer = require('multer');
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024 // 50MB
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Detailed health check
const { healthCheck, detailedHealthCheck, readinessCheck, livenessCheck } = require('../middleware/healthCheck');
router.get('/health/detailed', detailedHealthCheck);
router.get('/health/live', livenessCheck);
router.get('/health/ready', readinessCheck);

// Metrics endpoint
const { getMetrics, getPrometheusMetrics } = require('../middleware/metrics');
router.get('/metrics', (req, res) => {
  const accept = req.headers.accept;
  if (accept && accept.includes('text/plain')) {
    res.set('Content-Type', 'text/plain');
    res.send(getPrometheusMetrics());
  } else {
    res.json(getMetrics());
  }
});

// Root
router.get('/', (req, res) => {
  res.json({
    name: 'App Balloo API',
    version: '1.0.0',
    docs: '/api/docs'
  });
});

// ============================================
// PAGES ROUTES (Public)
// ============================================
const pagesPublicRouter = express.Router();
pagesPublicRouter.get('/', pagesController.getPages);
pagesPublicRouter.get('/:slug', pagesController.getPage);
router.use('/pages', pagesPublicRouter);

// ============================================
// FEATURES ROUTES (Public)
// ============================================
const featuresPublicRouter = express.Router();
featuresPublicRouter.use(authenticate);
featuresPublicRouter.get('/', featuresController.getFeatures);
featuresPublicRouter.get('/:id', featuresController.getFeature);
featuresPublicRouter.post('/', featuresController.createFeature);
featuresPublicRouter.post('/:id/vote', featuresController.voteFeature);
router.use('/features', featuresPublicRouter);

// ============================================
// BANS ROUTES (Public)
// ============================================
const bansPublicRouter = express.Router();
bansPublicRouter.use(authenticate);
bansPublicRouter.get('/user', bansController.getUserBans);
bansPublicRouter.get('/check/:userId', bansController.checkBan);
router.use('/bans', bansPublicRouter);

// ============================================
// AUTH ROUTES
// ============================================
const authRouter = express.Router();
const { authLimiter, smsLimiter, uploadLimiter } = require('../middleware/rateLimit');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');

authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/login', authLimiter, validate(loginSchema), authController.login);
authRouter.post('/logout', authenticate, authController.logout);
authRouter.post('/refresh', authController.refreshToken);
authRouter.post('/forgot-password', authLimiter, authController.forgotPassword);
authRouter.post('/verify-code', authController.verifyCode);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.get('/me', authenticate, authController.getMe);
authRouter.put('/change-password', authenticate, authController.changePassword);
authRouter.get('/sessions', authenticate, authController.getSessions);
authRouter.delete('/sessions/:sessionId', authenticate, authController.terminateSession);
authRouter.delete('/sessions', authenticate, authController.terminateAllSessions);

// 2FA Routes
authRouter.post('/2fa/enable', authenticate, authController.enable2FA);
authRouter.post('/2fa/confirm', authenticate, authController.confirm2FA);
authRouter.post('/2fa/disable', authenticate, authController.disable2FA);
authRouter.post('/2fa/verify', authenticate, authController.verify2FA);

// SMS 2FA Routes
authRouter.post('/sms-2fa/enable', authenticate, smsLimiter, authController.enableSMS2FA);
authRouter.post('/sms-2fa/confirm', authenticate, authController.confirmSMS2FA);
authRouter.post('/sms-2fa/disable', authenticate, smsLimiter, authController.disableSMS2FA);
authRouter.post('/sms-2fa/confirm-disable', authenticate, authController.confirmDisableSMS2FA);
authRouter.post('/sms-2fa/verify', authenticate, authController.verifySMS2FA);
authRouter.post('/sms-2fa/send-code', authenticate, smsLimiter, authController.sendLoginSMSCode);

// SMART 2FA Routes (Max SMS + Bot)
authRouter.post('/smart-2fa/send-code', authenticate, smsLimiter, authController.sendSmart2FACode);
authRouter.post('/smart-2fa/verify', authenticate, authController.verifySmart2FACode);
authRouter.get('/smart-2fa/status', authenticate, authController.get2FAMethodStatus);

router.use('/auth', authRouter);

// ============================================
// YANDEX AUTH ROUTES
// ============================================
const yandexAuthRouter = express.Router();

yandexAuthRouter.get('/authorize', yandexAuthController.getAuthUrl);
yandexAuthRouter.get('/callback', yandexAuthController.callback);
yandexAuthRouter.post('/link', authenticate, yandexAuthController.linkAccount);
yandexAuthRouter.post('/unlink', authenticate, yandexAuthController.unlinkAccount);
yandexAuthRouter.get('/status', authenticate, yandexAuthController.getStatus);

router.use('/auth/yandex', yandexAuthRouter);

// ============================================
// USERS ROUTES
// ============================================
const usersRouter = express.Router();

usersRouter.get('/search', authenticate, usersController.searchUsers);
usersRouter.get('/:userId', optionalAuth, usersController.getUserById);
usersRouter.put('/me', authenticate, usersController.updateMe);
usersRouter.put('/me/avatar', authenticate, upload.single('file'), usersController.updateAvatar);
usersRouter.put('/me/status', authenticate, usersController.updateStatus);
usersRouter.get('/me/contacts', authenticate, usersController.getContacts);
usersRouter.get('/me/devices', authenticate, usersController.getDevices);
usersRouter.put('/me/devices/:deviceId', authenticate, usersController.updateDevice);
usersRouter.delete('/me/devices/:deviceId', authenticate, usersController.deleteDevice);
usersRouter.delete('/me/account', authenticate, usersController.deleteAccount);

router.use('/users', usersRouter);

// ============================================
// CHATS ROUTES
// ============================================
const chatsRouter = express.Router();

chatsRouter.use(authenticate);

chatsRouter.get('/', chatsController.getChats);
chatsRouter.post('/', chatsController.createChat);
chatsRouter.get('/:chatId', chatsController.getChatById);
chatsRouter.put('/:chatId', chatsController.updateChat);
chatsRouter.delete('/:chatId', chatsController.deleteChat);
chatsRouter.put('/:chatId/favorite', chatsController.toggleFavorite);
chatsRouter.put('/:chatId/pin', chatsController.togglePin);
chatsRouter.put('/:chatId/mute', chatsController.toggleMute);
chatsRouter.put('/:chatId/read', chatsController.markAsRead);
chatsRouter.post('/:chatId/typing', chatsController.typing);
chatsRouter.post('/:chatId/leave', chatsController.leaveChat);

// Members
chatsRouter.get('/:chatId/members', chatsController.getMembers);
chatsRouter.post('/:chatId/members', chatsController.addMember);
chatsRouter.delete('/:chatId/members/:userId', chatsController.removeMember);
chatsRouter.put('/:chatId/members/:userId/role', chatsController.updateMemberRole);

router.use('/chats', chatsRouter);

// ============================================
// MESSAGES ROUTES
// ============================================
const messagesRouter = express.Router();

messagesRouter.use(authenticate);

messagesRouter.get('/chats/:chatId/messages', messagesController.getMessages);
messagesRouter.post('/chats/:chatId/messages', messagesController.sendMessage);
messagesRouter.put('/:messageId', messagesController.editMessage);
messagesRouter.delete('/:messageId', messagesController.deleteMessage);
messagesRouter.post('/:messageId/reactions', messagesController.addReaction);
messagesRouter.delete('/:messageId/reactions/:emoji', messagesController.removeReaction);
messagesRouter.put('/:messageId/read', messagesController.markAsRead);
messagesRouter.post('/:messageId/forward', messagesController.forwardMessage);

router.use('/messages', messagesRouter);

// ============================================
// CONTACTS ROUTES
// ============================================
const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', contactsController.getContacts);
contactsRouter.post('/', contactsController.addContact);
contactsRouter.delete('/:userId', contactsController.removeContact);
contactsRouter.put('/:userId/favorite', contactsController.toggleFavorite);
contactsRouter.put('/:userId/block', contactsController.toggleBlock);
contactsRouter.get('/requests', contactsController.getRequests);
contactsRouter.post('/requests', contactsController.sendRequest);
contactsRouter.put('/requests/:requestId', contactsController.handleRequest);

router.use('/contacts', contactsRouter);

// ============================================
// NOTIFICATIONS ROUTES
// ============================================
const notificationsRouter = express.Router();

notificationsRouter.use(authenticate);

notificationsRouter.get('/', notificationsController.getNotifications);
notificationsRouter.put('/:notificationId/read', notificationsController.markAsRead);
notificationsRouter.put('/read-all', notificationsController.markAllAsRead);
notificationsRouter.delete('/:notificationId', notificationsController.deleteNotification);
notificationsRouter.post('/subscribe', notificationsController.subscribe);
notificationsRouter.post('/send', notificationsController.sendNotification);
notificationsRouter.post('/email', notificationsController.sendEmail);

// Публичные маршруты для VAPID ключа
const publicNotificationsRouter = express.Router();
publicNotificationsRouter.get('/vapid-key', notificationsController.getVapidKey);

router.use('/notifications', notificationsRouter);
router.use('/notifications', publicNotificationsRouter);

// ============================================
// INVITATIONS ROUTES
// ============================================
const invitationsRouter = express.Router();

invitationsRouter.use(authenticate);

invitationsRouter.get('/', invitationsController.getInvitations);
invitationsRouter.post('/', invitationsController.createInvitation);
invitationsRouter.delete('/:invitationId', invitationsController.deleteInvitation);
invitationsRouter.put('/:invitationId/revoke', invitationsController.revokeInvitation);

// Публичный доступ для информации о приглашении
const publicInvitationsRouter = express.Router();
publicInvitationsRouter.get('/:code', invitationsController.getInvitationInfo);
publicInvitationsRouter.post('/:code/accept', authenticate, invitationsController.acceptInvitation);

router.use('/invitations', invitationsRouter);
router.use('/invite', publicInvitationsRouter);

// ============================================
// YANDEX DISK ROUTES
// ============================================
const yandexDiskRouter = express.Router();

yandexDiskRouter.use(authenticate);

yandexDiskRouter.get('/files', yandexDiskController.listFiles);
yandexDiskRouter.post('/files', upload.single('file'), yandexDiskController.uploadFile);
yandexDiskRouter.get('/files/:fileId/download', yandexDiskController.downloadFile);
yandexDiskRouter.delete('/files/:fileId', yandexDiskController.deleteFile);
yandexDiskRouter.post('/files/:fileId/share', yandexDiskController.getPublicUrl);
yandexDiskRouter.get('/files/:fileId', yandexDiskController.getFileInfo);
yandexDiskRouter.get('/quota', yandexDiskController.getQuota);

router.use('/disk', yandexDiskRouter);

// ============================================
// GROUPS ROUTES
// ============================================
const groupsRouter = express.Router();

groupsRouter.use(authenticate);

groupsRouter.post('/', groupsController.createGroup);
groupsRouter.get('/:groupId', groupsController.getGroup);
groupsRouter.put('/:groupId', groupsController.updateGroup);
groupsRouter.delete('/:groupId', groupsController.deleteGroup);
groupsRouter.put('/:groupId/settings', groupsController.updateSettings);
groupsRouter.get('/:groupId/permissions', groupsController.getPermissions);
groupsRouter.put('/:groupId/permissions/:userId', groupsController.updatePermissions);
groupsRouter.post('/:groupId/transfer-ownership', groupsController.transferOwnership);

router.use('/groups', groupsRouter);

// ============================================
// ADMIN ROUTES
// ============================================
const adminRouter = express.Router();

adminRouter.use(authenticate);
adminRouter.use(requireAdmin); // Требуются права администратора

// Пользователи
adminRouter.get('/users', adminController.getUsers);
adminRouter.get('/users/:userId', adminController.getUser);
adminRouter.put('/users/:userId/role', adminController.updateUserRole);
adminRouter.delete('/users/:userId', adminController.blockUser);
adminRouter.post('/users/:userId/reset-password', adminController.resetUserPassword);
adminRouter.get('/users/:userId/sessions', adminController.getUserSessions);
adminRouter.delete('/users/:userId/sessions/:sessionId', adminController.terminateSession);
adminRouter.delete('/users/:userId/sessions', adminController.terminateAllSessions);
adminRouter.get('/users/:userId/devices', adminController.getUserDevices);
adminRouter.delete('/users/:userId/devices/:deviceId', adminController.deleteUserDevice);
adminRouter.get('/users/:userId/e2e-keys', adminController.getUserE2EKeys);
adminRouter.delete('/users/:userId/e2e-keys/:keyId', adminController.deleteUserE2EKey);
adminRouter.get('/users/stats', adminController.getUserStatsByPeriod);

// Чаты
adminRouter.get('/chats', adminController.getChats);
adminRouter.get('/chats/:chatId', adminController.getChatDetails);
adminRouter.delete('/chats/:chatId', adminController.deleteChatAdmin);

// Сообщения
adminRouter.get('/messages/search', adminController.searchMessages);
adminRouter.delete('/messages/:messageId', adminController.deleteMessage);

// Записи звонков
adminRouter.get('/recordings/info', adminController.getRecordingsInfo);
adminRouter.post('/recordings/cleanup', adminController.cleanupRecordings);

// Отчёты
adminRouter.get('/reports', reportsController.getReports);
adminRouter.put('/reports/:reportId', reportsController.processReport);

// Версии
adminRouter.get('/versions', adminController.getVersions);
adminRouter.post('/versions', adminController.addVersion);
adminRouter.put('/versions/:versionId', adminController.updateVersion);
adminRouter.delete('/versions/:versionId', adminController.deleteVersion);

// Аналитика и системная информация
adminRouter.get('/analytics', adminController.getAnalytics);
adminRouter.get('/system', adminController.getSystemInfo);

// Internal Chat (NBS w-t корпоративный чат)
adminRouter.get('/internal-chat/groups', adminController.getInternalChatGroups);
adminRouter.post('/internal-chat/groups', adminController.createInternalChatGroup);
adminRouter.post('/internal-chat/groups/:groupId/members', adminController.addInternalChatMembers);
adminRouter.delete('/internal-chat/groups/:groupId/members/:userId', adminController.removeInternalChatMember);

// Support System (Техподдержка)
adminRouter.get('/support/tickets', adminController.getSupportTickets);
adminRouter.get('/support/tickets/:ticketId', adminController.getSupportTicket);
adminRouter.post('/support/tickets', adminController.createSupportTicket);
adminRouter.put('/support/tickets/:ticketId', adminController.updateSupportTicket);
adminRouter.post('/support/tickets/:ticketId/messages', adminController.addSupportMessage);
adminRouter.get('/support/staff', adminController.getSupportStaff);

// Страницы (admin)
adminRouter.get('/pages', pagesController.getAllPages);
adminRouter.post('/pages', pagesController.createPage);
adminRouter.put('/pages/:pageId', pagesController.updatePage);
adminRouter.delete('/pages/:pageId', pagesController.deletePage);

// Фичи (admin)
adminRouter.get('/features', featuresController.getFeatures);
adminRouter.put('/features/:id/status', featuresController.updateFeatureStatus);
adminRouter.delete('/features/:id', featuresController.deleteFeature);

// Бан-лист (admin)
adminRouter.get('/bans', bansController.getBans);
adminRouter.post('/bans', bansController.banUser);
adminRouter.delete('/bans/:banId', bansController.unbanUser);

router.use('/admin', adminRouter);

// ============================================
// GLOBAL SEARCH ROUTES
// ============================================
const searchRouter = express.Router();
searchRouter.use(authenticate);
searchRouter.get('/', searchController.search);
router.use('/global-search', searchRouter);

// ============================================
// STATUSES (STORIES) ROUTES
// ============================================
const statusesRouter = express.Router();
statusesRouter.use(authenticate);
statusesRouter.get('/', statusesController.getStatuses);
statusesRouter.post('/', statusesController.upload.single('file'), statusesController.createStatus);
statusesRouter.get('/:statusId', statusesController.getStatus);
statusesRouter.post('/:statusId/view', statusesController.viewStatus);
statusesRouter.delete('/:statusId', statusesController.deleteStatus);
router.use('/statuses', statusesRouter);

// ============================================
// REPORTS ROUTES
// ============================================
const reportsRouter = express.Router();
reportsRouter.use(authenticate);
reportsRouter.post('/', reportsController.createReport);
router.use('/reports', reportsRouter);

// ============================================
// CALLS ROUTES
// ============================================
const callsRouter = express.Router();
callsRouter.use(authenticate);
callsRouter.post('/', callsController.createCall);
callsRouter.get('/history', callsController.getCallHistory);
callsRouter.get('/:callId', callsController.getCall);
callsRouter.put('/:callId', callsController.updateCall);
callsRouter.post('/:callId/end', callsController.endCall);
callsRouter.get('/:callId/recording', callsController.getCallRecording);
router.use('/calls', callsRouter);

// ============================================
// AUDIO ROUTES
// ============================================
const audioRouter = express.Router();
audioRouter.use(authenticate);
const audioController = require('../controllers/audio.controller');
audioRouter.post('/upload', upload.single('file'), audioController.uploadAudio);
audioRouter.get('/:audioId/play', audioController.getAudioUrl);
audioRouter.get('/:audioId', audioController.getAudioInfo);
audioRouter.delete('/:audioId', audioController.deleteAudio);
audioRouter.get('/chat/:chatId', audioController.getChatAudios);
router.use('/audio', audioRouter);

// ============================================
// SYNC ROUTES
// ============================================
const syncRouter = express.Router();
syncRouter.use(authenticate);
syncRouter.post('/keys', syncController.syncKeys);
syncRouter.get('/keys', syncController.getKeys);
router.use('/sync', syncRouter);

// ============================================
// WEBRTC ROUTES (Legacy/Alternative)
// ============================================
const webrtcRouter = express.Router();
webrtcRouter.use(authenticate);
webrtcRouter.post('/offer', webrtcController.createOffer);
webrtcRouter.post('/answer', webrtcController.createAnswer);
webrtcRouter.post('/ice-candidate', webrtcController.addIceCandidate);
router.use('/webrtc', webrtcRouter);

// ============================================
// THEMES ROUTES
// ============================================
const themesRouter = require('./themes');
router.use('/themes', themesRouter);

// ============================================
// ATTACHMENTS ROUTES
// ============================================
const attachmentsRouter = require('./attachments');
router.use('/attachments', attachmentsRouter);

module.exports = router;

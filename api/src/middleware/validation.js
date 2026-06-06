/**
 * Validation Middleware
 * Валидация входных данных с помощью zod
 */

const { z } = require('zod');

// ============================================
// SCHEMAS
// ============================================

// Email
const emailSchema = z.string().email('Неверный формат email');

// Password
const passwordSchema = z.string().min(8, 'Пароль должен быть минимум 8 символов');

// Phone number (РФ)
const phoneSchema = z.string().regex(/^\+7\d{10}$/, 'Неверный формат номера (требуется +7XXX)');

// 3-digit code
const code3Schema = z.string().regex(/^\d{3}$/, 'Код должен быть 3 цифр');

// 6-digit code
const code6Schema = z.string().regex(/^\d{6}$/, 'Код должен быть 6 цифр');

// UUID
const uuidSchema = z.string().uuid('Неверный формат UUID');

// ============================================
// AUTH VALIDATION
// ============================================

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z.string().min(1, 'displayName обязателен'),
  fullName: z.string().optional(),
  phone: phoneSchema.optional(),
  birthDate: z.string().optional(),
  publicKey: z.string().optional()
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  deviceInfo: z.object({
    platform: z.string().optional(),
    deviceId: z.string().optional(),
    pushToken: z.string().optional()
  }).optional()
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Старый пароль обязателен'),
  newPassword: passwordSchema
});

// ============================================
// 2FA VALIDATION
// ============================================

const verify2FASchema = z.object({
  code: code3Schema
});

// ============================================
// CHAT VALIDATION
// ============================================

const createChatSchema = z.object({
  participants: z.array(z.string().uuid()).min(1, 'Минимум 1 участник'),
  name: z.string().min(1, 'Название обязательно для групп').optional(),
  avatar: z.string().optional()
});

const updateChatSchema = z.object({
  name: z.string().min(1).optional(),
  avatar: z.string().optional(),
  description: z.string().optional(),
  isPrivate: z.boolean().optional()
});

// ============================================
// MESSAGE VALIDATION
// ============================================

const sendMessageSchema = z.object({
  chatId: uuidSchema,
  content: z.string().min(1, 'Сообщение не может быть пустым'),
  type: z.enum(['text', 'image', 'video', 'audio', 'file']).optional(),
  attachmentId: z.string().uuid().optional(),
  replyToId: z.string().uuid().optional()
});

// ============================================
// NOTIFICATION VALIDATION
// ============================================

const sendNotificationSchema = z.object({
  userId: uuidSchema,
  type: z.enum(['message', 'call', 'system', 'admin']),
  title: z.string().min(1),
  body: z.string().min(1),
  data: z.record(z.any()).optional()
});

// ============================================
// VALIDATION MIDDLEWARE
// ============================================

function validate(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Ошибка валидации',
            details: error.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message
            }))
          }
        });
      }
      next(error);
    }
  };
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Schemas
  registerSchema,
  loginSchema,
  changePasswordSchema,
  verify2FASchema,
  createChatSchema,
  updateChatSchema,
  sendMessageSchema,
  sendNotificationSchema,
  
  // Middleware
  validate
};

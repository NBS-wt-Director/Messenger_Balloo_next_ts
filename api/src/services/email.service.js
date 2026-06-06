/**
 * Email Service
 * Отправка email через Nodemailer
 */

const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Создаём транспортер
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.yandex.ru',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true для 465, false для других портов
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Проверка подключения
transporter.verify((error, success) => {
  if (error) {
    logger.error('Email transporter verification failed:', error);
  } else {
    logger.info('Email transporter ready');
  }
});

/**
 * Отправить код восстановления пароля
 */
async function sendPasswordResetCode(email, code) {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'App Balloo'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Сброс пароля - App Balloo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Сброс пароля</h2>
          <p>Здравствуйте!</p>
          <p>Вы (или кто-то) запросили сброс пароля для аккаунта <strong>${email}</strong>.</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #4CAF50; margin: 0; font-size: 36px;">${code}</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Ваш код подтверждения</p>
          </div>
          <p>Этот код действителен в течение <strong>10 минут</strong>.</p>
          <p>Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            Это письмо отправлено автоматически. Пожалуйста, не отвечайте на него.
            <br>© ${new Date().getFullYear()} App Balloo
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Password reset code sent to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Отправить код подтверждения регистрации
 */
async function sendVerificationCode(email, code) {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'App Balloo'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Подтверждение регистрации - App Balloo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Добро пожаловать в App Balloo!</h2>
          <p>Здравствуйте!</p>
          <p>Спасибо за регистрацию в App Balloo. Для завершения настройки аккаунта введите код:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #4CAF50; margin: 0; font-size: 36px;">${code}</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Ваш код подтверждения</p>
          </div>
          <p>Этот код действителен в течение <strong>10 минут</strong>.</p>
          <p style="color: #666;">
            После подтверждения вы сможете войти в приложение и начать общение.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            Это письмо отправлено автоматически. Пожалуйста, не отвечайте на него.
            <br>© ${new Date().getFullYear()} App Balloo
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Verification code sent to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Отправить уведомление о новом сообщении
 */
async function sendNewMessageNotification(email, fromUser, chatName, preview) {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'App Balloo'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Новое сообщение от ${fromUser}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Новое сообщение</h2>
          <p>У вас новое сообщение в <strong>${chatName || 'App Balloo'}</strong>:</p>
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4CAF50;">
            <p style="margin: 0; color: #333;"><strong>${fromUser}:</strong></p>
            <p style="margin: 10px 0 0 0; color: #666;">${preview}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'https://app.balloo.app'}/chats" 
               style="background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Перейти в чат
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            Это письмо отправлено автоматически.
            <br>© ${new Date().getFullYear()} App Balloo
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`New message notification sent to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending new message notification:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Отправить приглашение в чат
 */
async function sendInviteNotification(email, inviterName, chatName, inviteLink) {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'App Balloo'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${inviterName} приглашает вас в чат`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Приглашение в чат</h2>
          <p><strong>${inviterName}</strong> пригласил(а) вас в чат:</p>
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="margin: 0; color: #333;">${chatName}</h3>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" 
               style="background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Присоединиться к чату
            </a>
          </div>
          <p style="color: #666;">Или скопируйте ссылку и вставьте в браузер:</p>
          <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">
            ${inviteLink}
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            Это письмо отправлено автоматически.
            <br>© ${new Date().getFullYear()} App Balloo
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Invite notification sent to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending invite notification:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Отправить приветственное письмо
 */
async function sendWelcomeEmail(email, userName) {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'App Balloo'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Добро пожаловать в App Balloo!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Добро пожаловать, ${userName}!</h2>
          <p>Рады приветствовать вас в App Balloo!</p>
          <p>Вы успешно зарегистрировались и теперь можете:</p>
          <ul style="color: #666;">
            <li>Отправлять сообщения друзьям</li>
            <li>Создавать групповые чаты</li>
            <li>Делиться файлами и медиа</li>
            <li>Совершать аудио и видеозвонки</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'https://app.balloo.app'}/chats" 
               style="background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Перейти в приложение
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            Это письмо отправлено автоматически.
            <br>© ${new Date().getFullYear()} App Balloo
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendPasswordResetCode,
  sendVerificationCode,
  sendNewMessageNotification,
  sendInviteNotification,
  sendWelcomeEmail
};

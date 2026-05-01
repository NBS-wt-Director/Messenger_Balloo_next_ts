/**
 * Отправка email с кодом верификации
 */

const nodemailer = require('nodemailer');

let transporter = null;

/**
 * Инициализация SMTP транспортера
 */
function initTransporter() {
  if (transporter) return transporter;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn('[Email] SMTP credentials not configured, email sending disabled');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort, 10),
    secure: false, // TLS
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  return transporter;
}

/**
 * Отправка email с кодом верификации
 */
async function sendVerificationEmail(toEmail, code) {
  try {
    const t = initTransporter();
    
    if (!t) {
      console.log('[Email] Sending verification code to:', toEmail);
      console.log('[Email] CODE:', code);
      return true; // Для тестирования возвращаем true
    }

    const formattedCode = code.split('-').join(' ');
    const hint = code.split('-').slice(0, 3).join('-') + '...';

    const mailOptions = {
      from: '"Balloo Messenger" <robot@balloo.su>',
      to: toEmail,
      subject: 'Код подтверждения email - Balloo Messenger',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Добро пожаловать в Balloo!</h2>
          <p>Спасибо за регистрацию в Balloo Messenger.</p>
          <p>Для подтверждения вашего email адреса введите следующий код:</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="font-size: 24px; font-weight: bold; color: #1e293b; letter-spacing: 2px;">
              ${formattedCode}
            </p>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            <strong>Подсказка:</strong> Код начинается с: ${hint}
          </p>
          
          <p style="color: #64748b; font-size: 14px;">
            Код действителен в течение 15 минут.<br>
            Если вы не регистрировались в Balloo, просто игнорируйте это письмо.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #94a3b8; font-size: 12px;">
            © 2026 Balloo Messenger. Все права защищены.
          </p>
        </div>
      `,
      text: `Добро пожаловать в Balloo!\n\nКод подтверждения: ${formattedCode}\n\nПодсказка: Код начинается с: ${hint}\n\nКод действителен 15 минут.`,
    };

    const info = await t.sendMail(mailOptions);
    console.log('[Email] Verification email sent:', info.messageId);
    return true;

  } catch (error) {
    console.error('[Email] Error sending verification email:', error);
    return false;
  }
}

module.exports = {
  sendVerificationEmail,
  initTransporter
};

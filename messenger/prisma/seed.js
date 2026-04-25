  
  
  /**
 * Prisma Seed - Initial Database Data
 * Запускается после миграции базы данных
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ===== CREATE SUPER ADMIN =====
  const adminPassword = 'BallooAdmin2024!SecurePass#XyZ';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@balloo.ru' },
    update: {},
    create: {
      email: 'admin@balloo.ru',
      passwordHash,
      displayName: 'Администратор',
      fullName: 'Системный Администратор',
      isAdmin: true,
      isSuperAdmin: true,
      adminRoles: ['full_access'],
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // ===== CREATE TEST USER =====
  const testPassword = await bcrypt.hash('TestUser123!', 10);

  const testUser = await prisma.user.upsert({
    where: { email: 'test@balloo.ru' },
    update: {},
    create: {
      email: 'test@balloo.ru',
      passwordHash: testPassword,
      displayName: 'Тестовый Пользователь',
      fullName: 'Иван Тестов',
      adminRoles: [],
    },
  });

  console.log(`✅ Test user created: ${testUser.email}`);

  // ===== CREATE FEATURES =====
  const features = [
    {
      title: 'Сквозное шифрование',
      description: 'Все сообщения шифруются на устройстве отправителя и расшифровываются только на устройстве получателя',
      category: 'security',
      status: 'completed',
      votes: 100,
      createdBy: admin.id,
    },
    {
      title: 'Видеозвонки',
      description: 'Качественные видеозвонки с поддержкой групповых вызовов до 10 участников',
      category: 'general',
      status: 'planned',
      votes: 85,
      createdBy: admin.id,
    },
    {
      title: 'Тёмная тема',
      description: 'Удобная тёмная тема для комфортного использования в вечернее время',
      category: 'ui',
      status: 'completed',
      votes: 92,
      createdBy: admin.id,
    },
    {
      title: 'Мультиустройство',
      description: 'Используйте Balloo на нескольких устройствах одновременно с синхронизацией',
      category: 'general',
      status: 'in-progress',
      votes: 78,
      createdBy: admin.id,
    },
    {
      title: 'Обмен файлами',
      description: 'Отправляйте файлы любого типа до 2 ГБ с облачным хранением',
      category: 'general',
      status: 'completed',
      votes: 95,
      createdBy: admin.id,
    },
    {
      title: 'Аудиосообщения',
      description: 'Отправляйте голосовые сообщения с регулировкой скорости воспроизведения',
      category: 'general',
      status: 'completed',
      votes: 88,
      createdBy: admin.id,
    },
  ];

  for (const feature of features) {
    await prisma.feature.create({
      data: feature,
    });
    console.log(`✅ Feature created: ${feature.title}`);
  }

  // ===== CREATE PAGES =====
  const pages = [
    {
      title: 'Поддержка',
      content: 'Свяжитесь с нами для получения помощи',
      sections: JSON.stringify({
        payment: {
          title: 'Оплата',
          sbp: '8-912-202-30-35',
          description: 'Оплата через СБП',
        },
        contacts: {
          email: 'support@balloo.ru',
          telegram: '@balloo_support',
        },
      }),
      isActive: true,
      createdBy: admin.id,
    },
    {
      title: 'О компании',
      content: 'Разработчик Balloo Messenger',
      sections: JSON.stringify({
        developer: {
          name: 'Иван Оберюхтин',
          description: 'Full-stack разработчик, создатель Balloo Messenger',
          experience: 'Разработка веб-приложений и кроссплатформенных решений',
        },
        contacts: {
          telegram: '@ivan_oberyukhtin',
        },
      }),
      isActive: true,
      createdBy: admin.id,
    },
  ];

  for (const page of pages) {
    await prisma.page.create({
      data: page,
    });
    console.log(`✅ Page created: ${page.title}`);
  }

  // ===== CREATE INVITATION CODE =====
  await prisma.invitation.create({
    data: {
      code: 'BALLOO2024',
      createdBy: admin.id,
      expiresAt: new Date(Date.now() + 31536000000), // 1 year from now
      isPermanent: false,
      maxUses: 100,
      usedCount: 0,
      pointsReward: 10,
    },
  });

  console.log('✅ Invitation code created: BALLOO2024');

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\n📝 Test credentials:');
  console.log('   Admin: admin@balloo.ru / BallooAdmin2024!SecurePass#XyZ');
  console.log('   User:  test@balloo.ru / TestUser123!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

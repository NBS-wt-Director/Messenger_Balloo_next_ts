#!/usr/bin/env node
/**
 * pre-deploy-check.js
 * Скрипт для проверки проекта перед деплоем
 * 
 * Запуск: node scripts/pre-deploy-check.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${colors.cyan}▶ ${description}${colors.reset}`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log(`✅ ${description} - OK`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} - FAILED`, 'red');
    console.error(error.message);
    return false;
  }
}

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description} - EXISTS`, 'green');
    return true;
  } else {
    log(`⚠️  ${description} - NOT FOUND`, 'yellow');
    return false;
  }
}

function checkEnvVariable(envFile, variable, description) {
  if (!fs.existsSync(envFile)) {
    log(`❌ ${description} - FILE NOT FOUND`, 'red');
    return false;
  }

  const content = fs.readFileSync(envFile, 'utf8');
  const regex = new RegExp(`${variable}=(.+)`);
  const match = content.match(regex);

  if (match && match[1] && match[1].length > 10) {
    log(`✅ ${description} - SET`, 'green');
    return true;
  } else {
    log(`❌ ${description} - NOT SET OR TOO SHORT`, 'red');
    return false;
  }
}

async function main() {
  log('\n' + '='.repeat(50), 'cyan');
  log(' Balloo Messenger - Pre-Deploy Check', 'cyan');
  log('='.repeat(50) + '\n', 'cyan');

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
  };

  // 1. Проверка Node.js версии
  log('\n--- Системные требования ---', 'blue');
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion >= 20) {
    log(`✅ Node.js версия: ${nodeVersion}`, 'green');
    results.passed++;
  } else {
    log(`❌ Node.js версия: ${nodeVersion} (требуется >= 20)`, 'red');
    results.failed++;
  }

  // 2. Проверка критических файлов
  log('\n--- Критические файлы ---', 'blue');
  const criticalFiles = [
    ['messenger/package.json', 'messenger/package.json'],
    ['messenger/prisma/schema.prisma', 'Prisma schema'],
    ['shared/package.json', 'shared/package.json'],
    ['.gitignore', '.gitignore'],
  ];

  criticalFiles.forEach(([filePath, description]) => {
    if (checkFileExists(filePath, description)) {
      results.passed++;
    } else {
      results.failed++;
    }
  });

  // 3. Проверка переменных окружения
  log('\n--- Переменные окружения ---', 'blue');
  const envFile = 'messenger/.env.local';
  const criticalEnvVars = [
    ['JWT_SECRET', 'JWT_SECRET'],
    ['ENCRYPTION_KEY', 'ENCRYPTION_KEY'],
    ['DATABASE_URL', 'DATABASE_URL'],
  ];

  criticalEnvVars.forEach(([variable, description]) => {
    if (checkEnvVariable(envFile, variable, description)) {
      results.passed++;
    } else {
      results.failed++;
    }
  });

  // 4. Проверка безопасности
  log('\n--- Проверка безопасности ---', 'blue');
  
  // Проверка на слабые секреты
  if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, 'utf8');
    
    if (envContent.includes('change-this') || envContent.includes('your-')) {
      log('⚠️  Обнаружены тестовые значения в .env.local', 'yellow');
      results.warnings++;
    } else {
      log('✅ Секреты выглядят корректно', 'green');
      results.passed++;
    }

    // Проверка .gitignore
    if (fs.existsSync('.gitignore')) {
      const gitignore = fs.readFileSync('.gitignore', 'utf8');
      if (gitignore.includes('.env.local')) {
        log('✅ .env.local исключен из git', 'green');
        results.passed++;
      } else {
        log('⚠️  .env.local НЕ исключен из git', 'yellow');
        results.warnings++;
      }
    }
  }

  // 5. Проверка зависимостей
  log('\n--- Зависимости ---', 'blue');
  
  if (runCommand('cd messenger && npm ls --depth=0 2>&1 | head -20', 'messenger dependencies')) {
    results.passed++;
  } else {
    results.warnings++;
  }

  if (runCommand('cd shared && npm ls --depth=0 2>&1 | head -20', 'shared dependencies')) {
    results.passed++;
  } else {
    results.warnings++;
  }

  // 6. Проверка уязвимостей
  log('\n--- Проверка уязвимостей ---', 'blue');
  
  try {
    const auditOutput = execSync('cd messenger && npm audit --json', { encoding: 'utf8' });
    const auditResults = JSON.parse(auditOutput);
    const vulnerabilities = auditResults.metadata?.vulnerabilities || {};
    
    if (vulnerabilities.critical > 0 || vulnerabilities.high > 0) {
      log(`❌ Обнаружены уязвимости: critical=${vulnerabilities.critical}, high=${vulnerabilities.high}`, 'red');
      results.failed++;
    } else if (vulnerabilities.moderate > 0) {
      log(`⚠️  Обнаружены умеренные уязвимости: ${vulnerabilities.moderate}`, 'yellow');
      results.warnings++;
    } else {
      log('✅ Уязвимости не обнаружены', 'green');
      results.passed++;
    }
  } catch (error) {
    log('⚠️  Не удалось проверить уязвимости', 'yellow');
    results.warnings++;
  }

  // 7. Проверка TypeScript
  log('\n--- TypeScript проверка ---', 'blue');
  
  if (runCommand('cd messenger && npx tsc --noEmit', 'TypeScript check (messenger)')) {
    results.passed++;
  } else {
    results.failed++;
  }

  if (runCommand('cd shared && npx tsc --noEmit', 'TypeScript check (shared)')) {
    results.passed++;
  } else {
    results.failed++;
  }

  // 8. Проверка сборки
  log('\n--- Проверка сборки ---', 'blue');
  
  // Пропускаем полную сборку, только проверка возможности
  log('ℹ️  Сборка проекта будет проверена отдельно', 'blue');

  // Итоговый отчет
  log('\n' + '='.repeat(50), 'cyan');
  log(' ИТОГОВЫЙ ОТЧЕТ', 'cyan');
  log('='.repeat(50), 'cyan');
  log(`\n✅ Passed: ${results.passed}`, 'green');
  log(`⚠️  Warnings: ${results.warnings}`, 'yellow');
  log(`❌ Failed: ${results.failed}`, 'red');

  if (results.failed > 0) {
    log('\n❌ Критические ошибки обнаружены! Исправьте перед деплоем.', 'red');
    process.exit(1);
  } else if (results.warnings > 0) {
    log('\n⚠️  Обнаружены предупреждения. Проверьте перед деплоем.', 'yellow');
    process.exit(0);
  } else {
    log('\n✅ Все проверки пройдены успешно! Можно деплоить.', 'green');
    process.exit(0);
  }
}

main().catch(error => {
  log(`\n❌ Критическая ошибка: ${error.message}`, 'red');
  process.exit(1);
});

#!/usr/bin/env ts-node
/**
 * Скрипт для автоматического обновления статистики проекта
 * Запускается при каждом push в main через GitHub Actions
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface Statistics {
  totalFiles: number;
  totalLines: number;
  tsFiles: number;
  jsFiles: number;
  cssFiles: number;
  jsonFiles: number;
  repoSize: string;
  messengerFiles: number;
  messengerLines: number;
  componentsCount: number;
  apiEndpoints: number;
  pagesCount: number;
}

function countFiles(dir: string, extension: string): number {
  let count = 0;
  
  function walk(dir: string) {
    if (dir.includes('node_modules') || dir.includes('.next') || dir.includes('dist')) {
      return;
    }
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (file.endsWith(extension)) {
        count++;
      }
    }
  }
  
  walk(dir);
  return count;
}

function countLines(dir: string, extensions: string[]): number {
  let totalLines = 0;
  
  function walk(dir: string) {
    if (dir.includes('node_modules') || dir.includes('.next') || dir.includes('dist')) {
      return;
    }
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (extensions.some(ext => file.endsWith(ext))) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          totalLines += content.split('\n').length;
        } catch (e) {
          // Пропускаем бинарные файлы
        }
      }
    }
  }
  
  walk(dir);
  return totalLines;
}

function getRepoSize(): string {
  try {
    const output = execSync('git count-objects -vH', { encoding: 'utf8' });
    const sizeLine = output.split('\n').find(line => line.startsWith('size-pack:'));
    if (sizeLine) {
      return sizeLine.split(':')[1].trim();
    }
    return 'N/A';
  } catch {
    return 'N/A';
  }
}

function countApiEndpoints(): number {
  const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');
  let count = 0;
  
  if (fs.existsSync(apiDir)) {
    const routes = fs.readdirSync(apiDir, { recursive: true });
    for (const route of routes) {
      if (typeof route === 'string' && route.includes('route.ts')) {
        count++;
      }
    }
  }
  
  return count;
}

function countComponents(): number {
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  let count = 0;
  
  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (file.endsWith('.tsx') && file !== 'page.tsx') {
        count++;
      }
    }
  }
  
  walk(componentsDir);
  return count;
}

function countPages(): number {
  const appDir = path.join(__dirname, '..', 'src', 'app');
  let count = 0;
  
  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (file === 'page.tsx') {
        count++;
      }
    }
  }
  
  walk(appDir);
  return count;
}

function generateStatistics(): Statistics {
  const messengerDir = path.join(__dirname, '..');
  
  return {
    totalFiles: countFiles(messengerDir, '.ts') + countFiles(messengerDir, '.tsx') + 
                countFiles(messengerDir, '.js') + countFiles(messengerDir, '.css') + 
                countFiles(messengerDir, '.json'),
    totalLines: countLines(messengerDir, ['.ts', '.tsx', '.js', '.css']),
    tsFiles: countFiles(messengerDir, '.ts') + countFiles(messengerDir, '.tsx'),
    jsFiles: countFiles(messengerDir, '.js'),
    cssFiles: countFiles(messengerDir, '.css'),
    jsonFiles: countFiles(messengerDir, '.json'),
    repoSize: getRepoSize(),
    messengerFiles: countFiles(messengerDir, '.ts') + countFiles(messengerDir, '.tsx'),
    messengerLines: countLines(messengerDir, ['.ts', '.tsx']),
    componentsCount: countComponents(),
    apiEndpoints: countApiEndpoints(),
    pagesCount: countPages()
  };
}

function updateStatisticsFile(stats: Statistics) {
  const statsFile = path.join(__dirname, '..', '..', 'docs', 'STATISTICS.md');
  
  if (!fs.existsSync(statsFile)) {
    console.log('❌ STATISTICS.md не найден');
    return;
  }
  
  let content = fs.readFileSync(statsFile, 'utf8');
  
  // Заменяем плейсхолдеры
  const replacements: Record<string, string> = {
    '{{TOTAL_FILES}}': stats.totalFiles.toString(),
    '{{TOTAL_LINES}}': stats.totalLines.toString(),
    '{{TS_FILES}}': stats.tsFiles.toString(),
    '{{JS_FILES}}': stats.jsFiles.toString(),
    '{{CSS_FILES}}': stats.cssFiles.toString(),
    '{{JSON_FILES}}': stats.jsonFiles.toString(),
    '{{REPO_SIZE}}': stats.repoSize,
    '{{MESSENGER_FILES}}': stats.messengerFiles.toString(),
    '{{MESSENGER_LINES}}': stats.messengerLines.toString(),
    '{{COMPONENTS_COUNT}}': stats.componentsCount.toString(),
    '{{API_ENDPOINTS}}': stats.apiEndpoints.toString(),
    '{{PAGES_COUNT}}': stats.pagesCount.toString()
  };
  
  for (const [placeholder, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(placeholder, 'g'), value);
  }
  
  fs.writeFileSync(statsFile, content);
  console.log('✅ STATISTICS.md обновлён');
}

function updateSpecificationFile() {
  const specFile = path.join(__dirname, '..', '..', 'docs', 'SPECIFICATION.md');
  
  if (!fs.existsSync(specFile)) {
    console.log('❌ SPECIFICATION.md не найден');
    return;
  }
  
  let content = fs.readFileSync(specFile, 'utf8');
  
  // Обновляем дату последнего изменения
  const today = new Date().toISOString().split('T')[0];
  content = content.replace(
    /Last updated: \d{4}-\d{2}-\d{2}/i,
    `Last updated: ${today}`
  );
  
  fs.writeFileSync(specFile, content);
  console.log('✅ SPECIFICATION.md обновлён');
}

function main() {
  console.log('📊 Обновление статистики проекта...\n');
  
  const stats = generateStatistics();
  
  console.log('📈 Статистика:');
  console.log(`  Всего файлов: ${stats.totalFiles}`);
  console.log(`  Всего строк: ${stats.totalLines}`);
  console.log(`  TypeScript: ${stats.tsFiles}`);
  console.log(`  JavaScript: ${stats.jsFiles}`);
  console.log(`  CSS: ${stats.cssFiles}`);
  console.log(`  JSON: ${stats.jsonFiles}`);
  console.log(`  API endpoints: ${stats.apiEndpoints}`);
  console.log(`  Компоненты: ${stats.componentsCount}`);
  console.log(`  Страницы: ${stats.pagesCount}`);
  console.log(`  Размер репозитория: ${stats.repoSize}\n`);
  
  updateStatisticsFile(stats);
  updateSpecificationFile();
  
  console.log('\n✅ Готово!');
}

main().catch(console.error);

#!/usr/bin/env node

/**
 * Balloo Docs Auto-Update Script
 * Автоматически обновляет данные в SUMMARY_DOCS при изменениях в монорепо
 * 
 * Использование: npm run update-docs
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsDir = path.join(__dirname, '..');
const monorepoRoot = path.join(docsDir, '..');

interface UpdateReport {
  timestamp: string;
  files: Array<{
    name: string;
    status: 'updated' | 'created' | 'unchanged';
    changes?: string;
  }>;
  errors: string[];
}

const report: UpdateReport = {
  timestamp: new Date().toISOString(),
  files: [],
  errors: []
};

function copyFile(src: string, dest: string, name: string) {
  try {
    if (fs.existsSync(src)) {
      const srcContent = fs.readFileSync(src, 'utf8');
      const destContent = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : '';
      
      if (srcContent !== destContent) {
        fs.writeFileSync(dest, srcContent, 'utf8');
        report.files.push({ name, status: 'updated' });
        console.log(`✅ Updated: ${name}`);
      } else {
        report.files.push({ name, status: 'unchanged' });
        console.log(`⏭️  Unchanged: ${name}`);
      }
    } else {
      report.files.push({ name, status: 'unchanged', changes: 'Source not found' });
      console.log(`⚠️  Source not found: ${name}`);
    }
  } catch (error) {
    report.errors.push(`Error copying ${name}: ${error}`);
    console.error(`❌ Error: ${name}`);
  }
}

function updateFeaturys() {
  console.log('\n📦 Scanning for features...');
  // Здесь можно добавить логику поиска новых функций в коде
  report.files.push({ name: 'Featurys.md', status: 'unchanged', changes: 'Auto-scan not implemented' });
}

function updateReleasePlan() {
  console.log('\n📅 Updating release plan...');
  // Здесь можно добавить логику обновления плана релиза
  report.files.push({ name: 'Release_plan.md', status: 'unchanged', changes: 'Auto-update not implemented' });
}

function scanContracts() {
  console.log('\n📜 Scanning contracts...');
  const contractsDir = path.join(monorepoRoot, 'workdocs', 'contracts');
  const destContractsDir = path.join(docsDir, 'Contracts');
  
  if (fs.existsSync(contractsDir)) {
    const files = fs.readdirSync(contractsDir).filter(f => f.endsWith('.md'));
    files.forEach(file => {
      copyFile(
        path.join(contractsDir, file),
        path.join(destContractsDir, file),
        `Contracts/${file}`
      );
    });
  }
}

function saveReport() {
  const reportPath = path.join(docsDir, 'media', 'update-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log('\n📊 Report saved to media/update-report.json');
}

function main() {
  console.log('🚀 Starting Balloo Docs Auto-Update...\n');
  console.log(`Timestamp: ${report.timestamp}`);
  console.log(`Docs Dir: ${docsDir}`);
  console.log(`Monorepo Root: ${monorepoRoot}`);
  
  // Copy root MD files
  const rootFiles = [
    'To_clean.md',
    'Featurys.md',
    'Release_plan.md',
    'Realease_calendare.md',
    'TZ.md',
    'Errors.md',
    'Monorepo_structure.md',
    'Monorepo_readme.md'
  ];
  
  console.log('\n📄 Copying root files...');
  rootFiles.forEach(file => {
    copyFile(
      path.join(monorepoRoot, file),
      path.join(docsDir, file),
      file
    );
  });
  
  // Update specific sections
  updateFeaturys();
  updateReleasePlan();
  scanContracts();
  
  // Save report
  saveReport();
  
  console.log('\n✅ Auto-update complete!');
  console.log(`   Files updated: ${report.files.filter(f => f.status === 'updated').length}`);
  console.log(`   Errors: ${report.errors.length}`);
}

main();

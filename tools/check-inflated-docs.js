#!/usr/bin/env node
/**
 * BALLOO - Check for inflated documentation
 * 
 * This script scans markdown files for suspiciously high percentages
 * and other inflated metrics that don't match reality.
 * 
 * Usage: node tools/check-inflated-docs.js [path]
 * 
 * Rules:
 * - Overall completion > 85% in report docs → warning
 * - Coverage > 50% without test files → warning
 * - Lines of code > 100K without verification → warning
 * - Test count > 100 without test files → warning
 */

const fs = require('fs');
const path = require('path');

const WARN_THRESHOLDS = {
  completionPercent: 85,
  coveragePercent: 50,
  linesOfCode: 100000,
  testCount: 100
};

const REPORT_DIRS = [
  'SUMMARY_DOCS/reports/status',
  'SUMMARY_DOCS/reports'
];

const PROJECT_DIRS = [
  'SUMMARY_DOCS/project'
];

function scanFile(filePath) {
  const warnings = [];
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for high completion percentages
  const completionMatches = content.match(/\b(\d{1,3})%\s*(Complete|заверш|готов|реализован)\b/gi);
  if (completionMatches) {
    completionMatches.forEach(match => {
      const percent = parseInt(match.match(/\d+/)[0]);
      if (percent >= WARN_THRESHOLDS.completionPercent) {
        warnings.push({
          file: filePath,
          rule: 'high-completion',
          message: `Suspiciously high completion: ${match}`,
          severity: percent > 95 ? 'error' : 'warning'
        });
      }
    });
  }
  
  // Check for coverage percentages
  const coverageMatches = content.match(/\b(\d{1,3})%\s*(coverage|покрытие)\b/gi);
  if (coverageMatches) {
    coverageMatches.forEach(match => {
      const percent = parseInt(match.match(/\d+/)[0]);
      if (percent >= WARN_THRESHOLDS.coveragePercent) {
        warnings.push({
          file: filePath,
          rule: 'high-coverage',
          message: `Suspiciously high coverage: ${match}`,
          severity: percent > 70 ? 'error' : 'warning'
        });
      }
    });
  }
  
  // Check for lines of code
  const locMatches = content.match(/\b(\d{2,})\s*(K|k|тыс)\s*(lines|строк|LOC)\b/gi);
  if (locMatches) {
    locMatches.forEach(match => {
      const num = parseInt(match.match(/\d+/)[0]);
      if (num >= WARN_THRESHOLDS.linesOfCode / 1000) {
        warnings.push({
          file: filePath,
          rule: 'high-loc',
          message: `Suspiciously high lines of code: ${match}`,
          severity: num > 50 ? 'error' : 'warning'
        });
      }
    });
  }
  
  // Check for test counts
  const testMatches = content.match(/\b(\d{2,})\s*(tests|тестов|test)\b/gi);
  if (testMatches) {
    testMatches.forEach(match => {
      const count = parseInt(match.match(/\d+/)[0]);
      if (count >= WARN_THRESHOLDS.testCount) {
        warnings.push({
          file: filePath,
          rule: 'high-test-count',
          message: `Suspiciously high test count: ${match}`,
          severity: count > 200 ? 'error' : 'warning'
        });
      }
    });
  }
  
  return warnings;
}

function scanDirectory(dirPath) {
  const warnings = [];
  
  if (!fs.existsSync(dirPath)) {
    return warnings;
  }
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      warnings.push(...scanDirectory(fullPath));
    } else if (item.endsWith('.md')) {
      warnings.push(...scanFile(fullPath));
    }
  }
  
  return warnings;
}

function main() {
  const allWarnings = [];
  
  // Scan report directories
  REPORT_DIRS.forEach(dir => {
    allWarnings.push(...scanDirectory(dir));
  });
  
  // Scan project directories
  PROJECT_DIRS.forEach(dir => {
    allWarnings.push(...scanDirectory(dir));
  });
  
  // Filter out already-fixed documents
  const fixedDocs = [
    'PROJECT_STATUS.md',
    'SESSION_COMPLETE.md',
    'FINAL_STATUS.md',
    'PHASE1_COMPLETION_REPORT.md',
    'IMPLEMENTATION_STATUS.md'
  ];
  
  const activeWarnings = allWarnings.filter(w => {
    const fileName = path.basename(w.file);
    if (fixedDocs.includes(fileName)) {
      return false; // Already fixed
    }
    return true;
  });
  
  // Print results
  console.log('='.repeat(80));
  console.log('BALLOO - Inflated Documentation Check');
  console.log('='.repeat(80));
  console.log('');
  
  if (activeWarnings.length === 0) {
    console.log('✅ No inflated documentation detected!');
    console.log('');
    console.log('All documentation appears honest.');
    process.exit(0);
  }
  
  console.log(`⚠️  Found ${activeWarnings.length} potential issues:`);
  console.log('');
  
  const errors = activeWarnings.filter(w => w.severity === 'error');
  const warnings = activeWarnings.filter(w => w.severity === 'warning');
  
  if (errors.length > 0) {
    console.log(`🔴 ERRORS (${errors.length}):`);
    errors.forEach(w => {
      console.log(`  ${w.file}`);
      console.log(`    ${w.rule}: ${w.message}`);
    });
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log(`🟡 WARNINGS (${warnings.length}):`);
    warnings.forEach(w => {
      console.log(`  ${w.file}`);
      console.log(`    ${w.rule}: ${w.message}`);
    });
    console.log('');
  }
  
  console.log('='.repeat(80));
  console.log('RECOMMENDATION:');
  console.log('  - Fix all errors before merge');
  console.log('  - Review warnings and add honesty markers if needed');
  console.log('='.repeat(80));
  
  process.exit(errors.length > 0 ? 1 : 0);
}

main();

/**
 * Balloo Platform v5.0 — Client App
 * Загрузка и рендер данных через API
 */

// Конфигурация
const API_BASE = '/api';
let sections = [];
let currentSection = null;

/**
 * Инициализация приложения
 */
async function init() {
  console.log('🎈 Balloo Platform v5.0 — Client App');
  
  // Обновляем timestamp
  document.getElementById('timestamp').textContent = new Date().toLocaleString('ru-RU');
  
  // Загружаем список разделов
  await loadSections();
  
  // Рендерим навигацию
  renderNavigation();
  
  // Открываем первый раздел
  if (sections.length > 0) {
    await openSection(sections[0].id);
  }
}

/**
 * Загрузка списка разделов
 */
async function loadSections() {
  try {
    const resp = await fetch(`${API_BASE}/sections`);
    sections = await resp.json();
    console.log(`✅ Загружено разделов: ${sections.length}`);
  } catch (e) {
    console.error('❌ Ошибка загрузки разделов:', e);
    sections = [];
  }
}

/**
 * Рендер навигации
 */
function renderNavigation() {
  const nav = document.getElementById('sectionNav');
  nav.innerHTML = sections.map(s => `
    <button class="section-btn ${currentSection === s.id ? 'active' : ''}" 
            onclick="openSection('${s.id}')"
            data-section="${s.id}">
      ${getSectionIcon(s.id)} ${s.title}
    </button>
  `).join('');
}

/**
 * Иконки для разделов
 */
function getSectionIcon(id) {
  const icons = {
    overview: '📊',
    problems: '⛔',
    resolved_problems: '✅',
    deferred_v2: '⏳',
    functions: '📋',
    nodes: '🖥',
    screens: '📱',
    infrastructure: '🏢',
    security: '🛡️',
    design_system: '🎨',
    competitive_analysis: '🏆',
    roadmap: '🗺️',
    risks: '⚠️',
    verdict: '✅',
    recommended_actions: '🎯',
    devops_setup: '⚙️',
    legal_analysis: '⚖️',
    user_perspective: '👤',
    ui_conflicts: '🎨',
    functions_analysis: '📊',
    data_schemas: '🗄️',
    api_schemas: '📡',
    tech_org: '⚙️',
    codegen_instructions: '🤖',
    message_attachments: '💬',
    illegitimate_md: '⚠️',
    message_features_v1: '📨',
    message_system_v1: '💬'
  };
  return icons[id] || '📄';
}

/**
 * Открытие раздела
 */
async function openSection(sectionId) {
  currentSection = sectionId;
  
  // Обновляем активную кнопку
  document.querySelectorAll('.section-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });
  
  // Показываем загрузку
  const content = document.getElementById('contentArea');
  content.innerHTML = '<div class="loading">Загрузка данных...</div>';
  
  try {
    // Загружаем данные раздела
    const resp = await fetch(`${API_BASE}/data/${sectionId}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    
    // Рендерим данные
    content.innerHTML = renderSection(sectionId, data);
  } catch (e) {
    content.innerHTML = `
      <div class="summary-box" style="border-left-color: var(--red);">
        <h3 style="color: var(--red);">❌ Ошибка загрузки</h3>
        <p>Раздел: ${sectionId}</p>
        <p>Ошибка: ${e.message}</p>
      </div>
    `;
  }
}

/**
 * Рендер раздела по типу
 */
function renderSection(sectionId, data) {
  const renderers = {
    overview: renderOverview,
    problems: renderProblems,
    resolved_problems: renderResolvedProblems,
    deferred_v2: renderDeferred,
    functions: renderFunctions,
    nodes: renderNodes,
    screens: renderScreens,
    infrastructure: renderInfrastructure,
    security: renderSecurity,
    design_system: renderDesignSystem,
    competitive_analysis: renderCompetitiveAnalysis,
    roadmap: renderRoadmap,
    risks: renderRisks,
    verdict: renderVerdict,
    recommended_actions: renderRecommendedActions,
    devops_setup: renderDevOps,
    legal_analysis: renderLegal,
    user_perspective: renderUserPerspective,
    ui_conflicts: renderUiConflicts,
    functions_analysis: renderFunctionsAnalysis,
    data_schemas: renderDataSchemas,
    api_schemas: renderApiSchemas,
    tech_org: renderTechOrg,
    codegen_instructions: renderCodegen,
    message_attachments: renderAttachments,
    illegitimate_md: renderIllegitimate,
    message_features_v1: renderMessage_features_v1,
    message_system_v1: renderMessage_system_v1
  };
  
  const renderer = renderers[sectionId] || renderDefault;
  return renderer(data);
}

/**
 * Рендер Overview
 */
function renderOverview(data) {
  const v1 = data.scores_v1 || {};
  const v2 = data.scores_v2 || {};
  
  const scoreFields = [
    { key: 'doc_quality', label: 'Качество документации' },
    { key: 'recovery_readiness', label: 'Пригодность для восстановления' },
    { key: 'functional_coverage', label: 'Полнота покрытия' },
    { key: 'technical_feasibility', label: 'Техническая реализуемость' },
    { key: 'security_score', label: 'Безопасность' },
    { key: 'compliance_score', label: 'Compliance 150-ФЗ' }
  ];
  
  let scoresHtml = '';
  scoreFields.forEach(({ key, label }) => {
    const v1Val = v1[key] ?? null;
    const v2Val = v2[key] ?? null;
    const display = (v1Val !== null && v2Val !== null) 
      ? `${v1Val} — ${v2Val}` 
      : (v1Val ?? v2Val ?? '—');
    const avg = (v1Val !== null && v2Val !== null) ? (v1Val + v2Val) / 2 : (v1Val ?? v2Val ?? 0);
    const color = avg >= 8 ? 'var(--green)' : avg >= 6 ? 'var(--orange)' : 'var(--red)';
    
    scoresHtml += `
      <div class="score-item">
        <div class="score-value" style="color:${color}">${display}</div>
        <div class="score-label">${label}</div>
      </div>
    `;
  });
  
  const fs = data.functions_summary || {};
  
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    
    <div class="score-card">
      ${scoresHtml}
    </div>
    
    <div class="summary-box">
      <h3 style="margin-bottom: 8px;">📝 Summary</h3>
      <p>${data.summary}</p>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px;">
      <div class="summary-box" style="border-left-color: var(--green);">
        <h3 style="color: var(--green); margin-bottom: 12px;">✅ Сильные стороны</h3>
        <ul style="padding-left: 20px;">
          ${(data.strengths || []).map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      <div class="summary-box" style="border-left-color: var(--red);">
        <h3 style="color: var(--red); margin-bottom: 12px;">⛔ Слабые стороны</h3>
        <ul style="padding-left: 20px;">
          ${(data.weaknesses || []).map(w => `<li>${w}</li>`).join('')}
        </ul>
      </div>
    </div>
    
    ${fs.total ? `
      <div class="score-card" style="margin-top: 24px;">
        <div class="score-item">
          <div class="score-value" style="color: var(--cyan)">${fs.total}</div>
          <div class="score-label">Всего функций</div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color: var(--green)">${fs.v1}</div>
          <div class="score-label">V1</div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color: var(--purple)">${fs.v2}</div>
          <div class="score-label">V2</div>
        </div>
      </div>
    ` : ''}
  `;
}

/**
 * Рендер Problems
 */
function renderProblems(data) {
  const items = data.items || [];
  const unresolved = items.filter(p => !p.resolved);
  
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    
    <div class="score-card">
      <div class="score-item">
        <div class="score-value" style="color: var(--accent)">${items.length}</div>
        <div class="score-label">Всего проблем</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--red)">${unresolved.length}</div>
        <div class="score-label">Нерешённых</div>
      </div>
    </div>
    
    ${unresolved.map(p => `
      <div class="problem">
        <div class="problem-num">⛔ ${p.id}: ${p.title} <span class="badge badge-${p.severity}">${p.severity}</span></div>
        <p>${p.description}</p>
        ${p.deferred_to ? `<p style="color: var(--purple);">⏳ Отложено до: ${p.deferred_to}</p>` : ''}
        ${p.solutions ? `
          <h4 style="margin: 12px 0 8px; color: var(--accent);">Решения:</h4>
          ${p.solutions.map(s => `
            <div class="solution-block">
              <div class="solution-title">${s.name}</div>
              <p>${s.detail}</p>
            </div>
          `).join('')}
        ` : ''}
      </div>
    `).join('')}
  `;
}

/**
 * Рендер Resolved Problems
 */
function renderResolvedProblems(data) {
  const items = data.items || [];
  const resolved = items.filter(p => p.resolved);
  
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    
    <div class="score-card">
      <div class="score-item">
        <div class="score-value" style="color: var(--green)">${resolved.length}</div>
        <div class="score-label">Решено ✅</div>
      </div>
    </div>
    
    ${resolved.map(p => `
      <div class="problem" style="border-left-color: var(--green);">
        <div class="problem-num" style="color: var(--green);">✅ ${p.id}: ${p.title}</div>
        <p>${p.description}</p>
        <p style="color: var(--green); margin-top: 8px;"><strong>Решение:</strong> ${p.solution}</p>
        <p style="color: var(--text-dim); font-size: 0.9em;">📅 ${p.resolution_date}</p>
      </div>
    `).join('')}
  `;
}

/**
 * Рендер Deferred V2
 */
function renderDeferred(data) {
  const subsections = data.subsections || [];
  const totals = data.totals || {};
  
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    
    <div class="score-card">
      <div class="score-item">
        <div class="score-value" style="color: var(--purple)">${totals.total_items || 0}</div>
        <div class="score-label">Всего элементов</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--orange)">${totals.premium_items || 0}</div>
        <div class="score-label">Premium</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--green)">${totals.features_items || 0}</div>
        <div class="score-label">Features</div>
      </div>
    </div>
    
    <h3 style="margin: 24px 0 16px;">Подразделы:</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
      ${subsections.map(s => `
        <div class="summary-box" style="border-left-color: var(--purple);">
          <h4 style="color: var(--purple); margin-bottom: 8px;">⏳ ${s.title}</h4>
          <p style="color: var(--text-dim); font-size: 0.9em;">${s.description}</p>
        </div>
      `).join('')}
    </div>
    
    ${data.roadmap_triggers ? `
      <div class="summary-box" style="border-left-color: var(--green); margin-top: 24px;">
        <h4 style="color: var(--green); margin-bottom: 12px;">🚀 Условия запуска V2</h4>
        <p><strong>Пользователи:</strong> ${data.roadmap_triggers.users}</p>
        <p><strong>Доход:</strong> ${data.roadmap_triggers.revenue}</p>
      </div>
    ` : ''}
  `;
}

/**
 * Рендер Functions
 */
function renderFunctions(data) {
  const items = data.items || [];
  
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Описание</th>
          <th>Версия</th>
          <th>Premium</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(f => `
          <tr>
            <td><code>${f.id}</code></td>
            <td><strong>${f.name}</strong></td>
            <td>${f.description}</td>
            <td><span class="badge badge-${f.version}">${f.version.toUpperCase()}</span></td>
            <td>${f.premium ? '💰' : '🆓'}</td>
            <td>${f.status || '—'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Рендер Nodes
 */
function renderNodes(data) {
  const items = data.items || [];
  const summary = data.summary || {};
  
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    
    <div class="score-card">
      <div class="score-item">
        <div class="score-value" style="color: var(--accent)">${summary.total || items.length}</div>
        <div class="score-label">Всего узлов</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--green)">${summary.client || 0}</div>
        <div class="score-label">Клиентских</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--cyan)">${summary.runtime || 0}</div>
        <div class="score-label">Runtime</div>
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Тип</th>
          <th>Хост</th>
          <th>Приоритет</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(n => `
          <tr>
            <td><code>${n.id}</code></td>
            <td><strong>${n.name}</strong></td>
            <td>${n.type}</td>
            <td>${n.hostname || '—'}</td>
            <td><span class="badge badge-${n.priority === 'critical' ? 'critical' : n.priority === 'high' ? 'warning' : 'ok'}">${n.priority}</span></td>
            <td>${n.implementation_status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Рендер Screens
 */
function renderScreens(data) {
  const items = data.items || [];
  const summary = data.summary || {};
  
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    
    <div class="score-card">
      <div class="score-item">
        <div class="score-value" style="color: var(--accent)">${summary.total || items.length}</div>
        <div class="score-label">Всего экранов</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--green)">${summary.v1 || 0}</div>
        <div class="score-label">V1</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--purple)">${summary.v2 || 0}</div>
        <div class="score-label">V2</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--orange)">${summary.mockup_coverage || '0%'}</div>
        <div class="score-label">Mockup coverage</div>
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Узел</th>
          <th>Версия</th>
          <th>Mockup</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(s => `
          <tr>
            <td><code>${s.id}</code></td>
            <td><strong>${s.name}</strong></td>
            <td>${s.node}</td>
            <td><span class="badge badge-${s.version}">${s.version.toUpperCase()}</span></td>
            <td>${s.has_mockup ? '✅' : '❌'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Рендер по умолчанию
 */
function renderDefault(data) {
  return `
    <h2 style="margin-bottom: 16px;">${data.title || 'Данные раздела'}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description || ''}</p>
    <pre style="background: var(--surface); padding: 16px; border-radius: 8px; overflow-x: auto;">${JSON.stringify(data, null, 2)}</pre>
  `;
}

// Заглушки для остальных рендереров - ТЕПЕРЬ С НОРМАЛЬНЫМ РЕНДЕРОМ
function renderInfrastructure(data) {
  const server = data.server || {};
  const storage = data.storage || {};
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    <div class="summary-box" style="border-left-color: var(--green);">
      <h3 style="color: var(--green); margin-bottom: 12px;">🖥 Сервер</h3>
      <p><strong>Локация:</strong> ${server.location || '—'}</p>
      <p><strong>Тип:</strong> ${server.type || '—'}</p>
      <p><strong>Compliance:</strong> ${(server.compliance || []).join(', ')}</p>
    </div>
    <div class="summary-box" style="border-left-color: var(--purple);">
      <h3 style="color: var(--purple); margin-bottom: 12px;">💾 Хранилище</h3>
      <p><strong>Основное:</strong> ${storage.primary || '—'}</p>
      <p><strong>БД:</strong> ${storage.database || '—'}</p>
      <p><strong>Кэш:</strong> ${storage.cache || '—'}</p>
    </div>
  `;
}

function renderSecurity(data) {
  const compliance = data.compliance || {};
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      <div class="summary-box" style="border-left-color: var(--green);">
        <h4 style="color: var(--green);">152-ФЗ</h4>
        <p>Status: ${compliance['152_fz']?.status || '—'}</p>
      </div>
      <div class="summary-box" style="border-left-color: var(--green);">
        <h4 style="color: var(--green);">150-ФЗ</h4>
        <p>Status: ${compliance['150_fz']?.status || '—'}</p>
      </div>
    </div>
    <h4 style="margin: 16px 0 8px;">Меры безопасности:</h4>
    <ul style="padding-left: 20px;">
      ${(data.security_measures || []).map(m => `<li>${m}</li>`).join('')}
    </ul>
  `;
}

function renderDesignSystem(data) {
  const tokens = data.tokens || {};
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    <div class="summary-box" style="border-left-color: var(--accent);">
      <h4 style="color: var(--accent); margin-bottom: 12px;">🎨 Цвета</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px;">
        ${Object.entries(tokens.colors || {}).map(([name, color]) => `
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 24px; height: 24px; border-radius: 4px; background: ${color}; border: 1px solid var(--border);"></div>
            <code>${name}</code>
          </div>
        `).join('')}
      </div>
    </div>
    <h4 style="margin: 16px 0 8px;">Компоненты:</h4>
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      ${(data.components || []).map(c => `<span class="badge badge-info">${c}</span>`).join('')}
    </div>
  `;
}

function renderCompetitiveAnalysis(data) {
  const items = data.items || [];
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    ${items.map(c => `
      <div class="comp-card" style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin: 16px 0;">
        <h3 style="color: var(--accent); margin-bottom: 8px;">${c.competitor}</h3>
        <p style="color: var(--text-dim); font-size: 0.9em; margin-bottom: 12px;">
          Доля рынка: РФ <strong>${c.market_share_ru}</strong> | РБ <strong>${c.market_share_by}</strong>
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <h4 style="color: var(--green); margin-bottom: 8px;">✅ Сильные стороны</h4>
            <ul style="padding-left: 20px;">${(c.strengths || []).map(s => `<li>${s}</li>`).join('')}</ul>
          </div>
          <div>
            <h4 style="color: var(--red); margin-bottom: 8px;">❌ Слабые стороны</h4>
            <ul style="padding-left: 20px;">${(c.weaknesses || []).map(w => `<li>${w}</li>`).join('')}</ul>
          </div>
        </div>
      </div>
    `).join('')}
    ${data.marketing_recommendations ? `
      <div class="summary-box" style="border-left-color: var(--cyan); margin-top: 24px;">
        <h4 style="color: var(--cyan); margin-bottom: 12px;">📈 Рекомендации по маркетингу</h4>
        <ul style="padding-left: 20px;">${data.marketing_recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
      </div>
    ` : ''}
  `;
}

function renderRoadmap(data) {
  const phases = data.phases || [];
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${phases.map((p, i) => `
        <div class="summary-box" style="border-left-color: var(--accent);">
          <h3 style="color: var(--accent); margin-bottom: 8px;">Phase ${p.phase}: ${p.name}</h3>
          <p style="color: var(--text-dim); font-size: 0.9em;">⏱ ${p.duration}</p>
          <ul style="padding-left: 20px; margin-top: 8px;">${(p.tasks || []).map(t => `<li>${t}</li>`).join('')}</ul>
        </div>
      `).join('')}
    </div>
    <div class="score-card" style="margin-top: 24px;">
      <div class="score-item">
        <div class="score-value" style="color: var(--accent)">${data.total_hours || '—'}</div>
        <div class="score-label">Всего часов</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--purple)">${data.v2_trigger || '—'}</div>
        <div class="score-label">Условие V2</div>
      </div>
    </div>
  `;
}

function renderRisks(data) {
  const items = data.items || [];
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    <table>
      <thead>
        <tr>
          <th>Риск</th>
          <th>Вероятность</th>
          <th>Влияние</th>
          <th>Митигация</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(r => `
          <tr>
            <td><strong>${r.risk}</strong></td>
            <td><span class="badge badge-${r.probability === 'high' ? 'warning' : r.probability === 'medium' ? 'warning' : 'ok'}">${r.probability}</span></td>
            <td><span class="badge badge-${r.impact === 'critical' ? 'critical' : r.impact === 'high' ? 'warning' : 'ok'}">${r.impact}</span></td>
            <td>${r.mitigation}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderVerdict(data) {
  const items = data.items || [];
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    <div class="score-card" style="margin-bottom: 24px;">
      <div class="score-item">
        <div class="score-value" style="color: var(--accent)">${data.average_score || '—'}/10</div>
        <div class="score-label">Средний балл</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Категория</th>
          <th>Балл</th>
          <th>Комментарий</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(i => `
          <tr>
            <td><code>${i.id}</code></td>
            <td><strong>${i.title}</strong></td>
            <td><span class="badge badge-${i.score >= 8 ? 'ok' : i.score >= 6 ? 'warning' : 'critical'}">${i.score}</span></td>
            <td>${i.comment}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ${data.conclusion ? `
      <div class="summary-box" style="margin-top: 24px;">
        <p><strong>Вывод:</strong> ${data.conclusion}</p>
      </div>
    ` : ''}
  `;
}

function renderRecommendedActions(data) {
  const v1 = data.v1_priority || [];
  const bap = data.bap_priority || [];
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    <h3 style="color: var(--green); margin: 24px 0 16px;">🎯 V1 Приоритеты</h3>
    ${v1.map(a => `
      <div class="solution-block" style="border-left-color: var(--green);">
        <div class="solution-title">Priority ${a.priority}: ${a.action}</div>
        <p>⏱ ${a.estimated_hours} часов | 📁 ${a.category}</p>
        ${a.note ? `<p style="color: var(--text-dim); font-size: 0.9em;">📝 ${a.note}</p>` : ''}
      </div>
    `).join('')}
    <h3 style="color: var(--purple); margin: 24px 0 16px;">🤖 BAP (AI Codegen) Приоритеты</h3>
    ${bap.map(a => `
      <div class="solution-block" style="border-left-color: var(--purple);">
        <div class="solution-title">Priority ${a.priority}: ${a.action}</div>
        <p>⏱ ${a.estimated_hours} часов | 📁 ${a.category}</p>
        ${a.note ? `<p style="color: var(--text-dim); font-size: 0.9em;">📝 ${a.note}</p>` : ''}
      </div>
    `).join('')}
  `;
}

function renderDevOps(data) {
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      <div class="summary-box" style="border-left-color: var(--green);">
        <h4 style="color: var(--green);">CI/CD</h4>
        <p>Platform: ${data.ci_cd?.platform || '—'}</p>
      </div>
      <div class="summary-box" style="border-left-color: var(--purple);">
        <h4 style="color: var(--purple);">Docker</h4>
        <p>Services: ${(data.docker?.services || []).length} шт.</p>
      </div>
    </div>
  `;
}

function renderLegal(data) {
  const countries = data.countries || [];
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    ${countries.map(c => `
      <div class="summary-box" style="border-left-color: var(--orange); margin: 16px 0;">
        <h3 style="color: var(--orange); margin-bottom: 12px;">${c.country} <span class="badge badge-v1">${c.code}</span></h3>
        <h4 style="margin: 12px 0 8px;">Законы:</h4>
        <ul style="padding-left: 20px;">${(c.key_laws || []).map(l => `<li>${l.name} — ${l.title}</li>`).join('')}</ul>
        <h4 style="margin: 12px 0 8px;">Compliance Checklist:</h4>
        <ul style="padding-left: 20px;">${(c.compliance_checklist || []).map(i => `<li>${i}</li>`).join('')}</ul>
      </div>
    `).join('')}
  `;
}

function renderUserPerspective(data) {
  const items = data.items || [];
  const strengths = items.find(i => i.category === 'Strengths')?.items || [];
  const weaknesses = items.find(i => i.category === 'Weaknesses')?.items || [];
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      <div class="summary-box" style="border-left-color: var(--green);">
        <h3 style="color: var(--green); margin-bottom: 12px;">✅ Сильные стороны</h3>
        ${strengths.map(s => `
          <div style="margin: 12px 0; padding: 12px; background: var(--surface2); border-radius: 4px;">
            <strong>${s.name}</strong> <span class="badge badge-${s.impact === 'high' ? 'critical' : 'warning'}">${s.impact}</span>
            <p style="color: var(--text-dim); font-size: 0.9em; margin: 8px 0 0;">${s.user_benefit}</p>
          </div>
        `).join('')}
      </div>
      <div class="summary-box" style="border-left-color: var(--red);">
        <h3 style="color: var(--red); margin-bottom: 12px;">⛔ Слабые стороны</h3>
        ${weaknesses.map(w => `
          <div style="margin: 12px 0; padding: 12px; background: var(--surface2); border-radius: 4px;">
            <strong>${w.name}</strong> <span class="badge badge-${w.impact === 'critical' ? 'critical' : 'warning'}">${w.impact}</span>
            <p style="color: var(--text-dim); font-size: 0.9em; margin: 8px 0 0;">${w.user_friction}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderUiConflicts(data) {
  const items = data.items || [];
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    ${items.map(c => `
      <div class="problem" style="border-left-color: ${c.resolved ? 'var(--green)' : 'var(--purple)'};">
        <div class="problem-num" style="color: ${c.resolved ? 'var(--green)' : 'var(--purple)'};">
          ${c.resolved ? '✅' : '🎨'} ${c.id}: ${c.title}
        </div>
        <p>${c.description}</p>
        ${c.solutions ? `
          <h4 style="margin: 12px 0 8px;">Решения:</h4>
          ${c.solutions.map(s => `
            <div class="solution-block">
              <div class="solution-title">${s.name}</div>
              <p>${s.detail}</p>
            </div>
          `).join('')}
        ` : ''}
      </div>
    `).join('')}
  `;
}

function renderFunctionsAnalysis(data) {
  const summary = data.summary || {};
  const categories = data.categories || {};
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    <div class="score-card">
      <div class="score-item">
        <div class="score-value" style="color: var(--accent)">${summary.total_functions || 0}</div>
        <div class="score-label">Всего</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--green)">${summary.v1_spec_ready || 0}</div>
        <div class="score-label">V1 готово</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--purple)">${summary.v2_deferred || 0}</div>
        <div class="score-label">V2 отложено</div>
      </div>
    </div>
    <h4 style="margin: 24px 0 16px;">По категориям:</h4>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
      ${Object.entries(categories).map(([cat, counts]) => `
        <div class="summary-box" style="border-left-color: var(--accent);">
          <strong>${cat}</strong>: ${counts.total} функций
        </div>
      `).join('')}
    </div>
  `;
}

function renderDataSchemas(data) {
  const tables = data.tables || [];
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    ${tables.map(t => `
      <div class="summary-box" style="border-left-color: var(--cyan); margin: 16px 0;">
        <h3 style="color: var(--cyan); margin-bottom: 12px;">📊 ${t.name}</h3>
        <table>
          <thead><tr><th>Колонка</th><th>Тип</th><th>PK</th><th>Unique</th></tr></thead>
          <tbody>
            ${(t.columns || []).map(c => `
              <tr>
                <td><code>${c.name}</code></td>
                <td>${c.type}</td>
                <td>${c.primary ? '✅' : ''}</td>
                <td>${c.unique ? '✅' : ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `).join('')}
  `;
}

function renderApiSchemas(data) {
  const endpoints = data.endpoints || [];
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    ${endpoints.map(e => `
      <div class="solution-block" style="margin: 16px 0;">
        <div class="solution-title">
          <span class="badge badge-${e.method === 'GET' ? 'ok' : e.method === 'POST' ? 'info' : 'warning'}">${e.method}</span>
          <code style="margin-left: 8px;">${e.path}</code>
        </div>
        <p>${e.description}</p>
      </div>
    `).join('')}
  `;
}

function renderTechOrg(data) {
  const items = data.items || [];
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    ${items.map(i => `
      <div class="summary-box" style="border-left-color: var(--accent); margin: 16px 0;">
        <h4 style="color: var(--accent); margin-bottom: 8px;">${i.category}</h4>
        <p><strong>Вопрос:</strong> ${i.question}</p>
        <p><strong>Ответ:</strong> ${i.answer}</p>
        <p><span class="badge badge-${i.status === 'resolved' ? 'ok' : 'warning'}">${i.status}</span></p>
      </div>
    `).join('')}
  `;
}

function renderCodegen(data) {
  const phases = data.phases || [];
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    ${phases.map(p => `
      <div class="summary-box" style="border-left-color: var(--purple);">
        <h4 style="color: var(--purple);">Phase ${p.phase}: ${p.name}</h4>
        <p>⏱ ${p.hours} часов</p>
        <h5 style="margin: 12px 0 8px;">Команды:</h5>
        <ul style="padding-left: 20px;">${(p.commands || []).map(c => `<li><code>${c}</code></li>`).join('')}</ul>
      </div>
    `).join('')}
    <div class="score-card" style="margin-top: 24px;">
      <div class="score-item">
        <div class="score-value" style="color: var(--purple)">${data.total_hours || '—'}</div>
        <div class="score-label">Всего часов</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--accent)">${data.ai_model || '—'}</div>
        <div class="score-label">AI модель</div>
      </div>
    </div>
  `;
}

function renderAttachments(data) {
  const attachments = data.attachments || {};
  const reactions = data.reactions || {};
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      <div class="summary-box" style="border-left-color: var(--cyan);">
        <h4 style="color: var(--cyan);">Вложения</h4>
        <p>Типы: ${(attachments.types || []).join(', ')}</p>
        <p>V1 Max: ${attachments.max_size_v1 || '—'}</p>
        <p>V2 Premium Max: ${attachments.max_size_v2_premium || '—'}</p>
      </div>
      <div class="summary-box" style="border-left-color: var(--purple);">
        <h4 style="color: var(--purple);">Реакции</h4>
        <p>Default: ${(reactions.default || []).join(' ')}</p>
        <p>Premium: ${reactions.premium || '—'}</p>
      </div>
    </div>
  `;
}

function renderIllegitimate(data) {
  const files = data.files || [];
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    <table>
      <thead><tr><th>Файл</th><th>Статус</th><th>Заметка</th></tr></thead>
      <tbody>
        ${files.map(f => `
          <tr>
            <td><code>${f.path}</code></td>
            <td><span class="badge badge-${f.status === 'requires_json' ? 'warning' : 'info'}">${f.status}</span></td>
            <td>${f.note || '—'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ${data.action_required ? `
      <div class="summary-box" style="border-left-color: var(--red); margin-top: 24px;">
        <p><strong>Требуется:</strong> ${data.action_required}</p>
      </div>
    ` : ''}
  `;
}

/**
 * Рендер Message Features V1
 */
function renderMessage_features_v1(data) {
  const features = data.features || {};
  const questions = data.questions_to_10?.questions || [];
  const recommendations = data.recommendations_summary || {};
  
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    
    <div class="score-card">
      <div class="score-item">
        <div class="score-value" style="color: var(--accent)">${Object.keys(features).length}</div>
        <div class="score-label">Функций</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--green)">${recommendations.final_scores?.with_recommendations?.total || '—'}</div>
        <div class="score-label">Итоговая оценка</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--purple)">${questions.length}</div>
        <div class="score-label">Вопросов</div>
      </div>
    </div>
    
    <h3 style="margin: 24px 0 16px;">Функции:</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
      ${Object.entries(features).map(([key, f]) => `
        <div class="summary-box" style="border-left-color: ${f.premium ? 'var(--purple)' : 'var(--green)'};">
          <h4 style="color: ${f.premium ? 'var(--purple)' : 'var(--green)'};">
            ${f.premium ? '💰' : '🆓'} ${f.name}
          </h4>
          <p style="color: var(--text-dim); font-size: 0.9em;">${f.name_en}</p>
          <p><span class="badge badge-${f.priority}">Priority ${f.priority}</span></p>
          <p><span class="badge badge-${f.status}">${f.status}</span></p>
        </div>
      `).join('')}
    </div>
    
    <h3 style="margin: 24px 0 16px;">Вопросы до 10/10:</h3>
    ${questions.map(q => `
      <div class="problem" style="border-left-color: var(--cyan);">
        <div class="problem-num" style="color: var(--cyan);">❓ ${q.id}. ${q.title}</div>
        <p style="color: var(--text-dim); font-size: 0.9em;">${q.title_en}</p>
        <p style="margin-top: 8px;"><strong>✅ Решение:</strong> ${q.decision}</p>
      </div>
    `).join('')}
    
    <div class="summary-box" style="border-left-color: var(--green); margin-top: 24px;">
      <h4 style="color: var(--green); margin-bottom: 12px;">📊 Итоговые метрики</h4>
      <p><strong>Baseline:</strong> ${recommendations.final_scores?.baseline?.total || '—'}/10</p>
      <p><strong>С рекомендациями:</strong> ${recommendations.final_scores?.with_recommendations?.total || '—'}/10</p>
    </div>
  `;
}

/**
 * Рендер Message System V1
 */
function renderMessage_system_v1(data) {
  const chatTypes = data.chat_types || [];
  const messageTypes = data.message_types || [];
  const attachmentTypes = data.attachment_types || [];
  const metrics = data.metrics || {};
  
  return `
    <h2 style="margin-bottom: 16px;">${data.title}</h2>
    <p style="color: var(--text-dim); margin-bottom: 24px;">${data.description}</p>
    
    <div class="score-card">
      <div class="score-item">
        <div class="score-value" style="color: var(--accent)">${metrics.total_chat_types || chatTypes.length}</div>
        <div class="score-label">Типов чатов</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--cyan)">${metrics.total_message_types || messageTypes.length}</div>
        <div class="score-label">Типов сообщений</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--purple)">${metrics.total_attachment_types || attachmentTypes.length}</div>
        <div class="score-label">Типов вложений</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color: var(--green)">${metrics.total_database_tables || data.database_tables?.length || 0}</div>
        <div class="score-label">Таблиц БД</div>
      </div>
    </div>
    
    <h3 style="margin: 24px 0 16px;">Типы чатов:</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
      ${chatTypes.map(ct => `
        <div class="summary-box" style="border-left-color: ${ct.e2e ? 'var(--green)' : 'var(--orange)'};">
          <h4 style="color: ${ct.e2e ? 'var(--green)' : 'var(--orange)'};">
            ${ct.e2e ? '🔒' : '📢'} ${ct.name}
          </h4>
          <p style="color: var(--text-dim); font-size: 0.9em;">${ct.name_en}</p>
          <p><strong>Пользователи:</strong> ${ct.users || ct.users_min + '-' + (ct.users_max || ct.users_max_premium || '∞')}</p>
          <p><strong>E2E:</strong> ${ct.e2e ? '✅' : '❌'}</p>
          <p><strong>Premium:</strong> ${ct.premium_required ? '💰' : '🆓'}</p>
        </div>
      `).join('')}
    </div>
    
    <h3 style="margin: 24px 0 16px;">Типы вложений:</h3>
    <table>
      <thead>
        <tr><th>Тип</th><th>Free</th><th>Premium</th><th>Форматы</th><th>Обработка</th></tr>
      </thead>
      <tbody>
        ${attachmentTypes.map(at => `
          <tr>
            <td><strong>${at.name}</strong></td>
            <td>${at.free_limit_mb} MB</td>
            <td>${at.premium_limit_mb} MB</td>
            <td><code>${(at.formats || []).join(', ')}</code></td>
            <td>${at.processing}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    ${data.security ? `
      <div class="summary-box" style="border-left-color: var(--green); margin-top: 24px;">
        <h4 style="color: var(--green); margin-bottom: 12px;">🔐 Безопасность</h4>
        <p><strong>Протокол:</strong> ${data.security.e2e_protocol}</p>
        <p><strong>Транспорт:</strong> ${data.security.transport}</p>
        <p><strong>Compliance:</strong> ${(data.security.compliance || []).join(', ')}</p>
      </div>
    ` : ''}
  `;
}

// Запуск
document.addEventListener('DOMContentLoaded', init);

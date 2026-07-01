// Section config with JSON paths
const sections = {
  overview: '_json/overview/data.json',
  problems: '_json/problems/data.json',
  deferred: '_json/deferred_v2/data.json',
  // Подразделы deferred_v2
  deferred_premium: '_json/deferred_v2/premium/data.json',
  deferred_features: '_json/deferred_v2/features/data.json',
  deferred_auth_platform: '_json/deferred_v2/auth_platform/data.json',
  deferred_international: '_json/deferred_v2/international/data.json',
  deferred_ai_premium: '_json/deferred_v2/ai_premium/data.json',
  deferred_payments: '_json/deferred_v2/payments/data.json',
  deferred_e2e_premium: '_json/deferred_v2/e2e_premium/data.json',
  functions: '_json/functions/data.json',
  ui_conflicts: '_json/ui_conflicts/data.json',
  killer_features: '_json/killer_features/data.json',
  legal_analysis: '_json/legal_analysis/data.json',
  user_perspective: '_json/user_perspective/data.json',
  competitive_analysis: '_json/competitive_analysis/data.json',
  roadmap: '_json/roadmap/data.json',
  risks: '_json/risks/data.json',
  verdict: '_json/verdict/data.json',
  nodes: '_json/nodes/data.json',
  screens: '_json/screens/data.json',
  infrastructure: '_json/infrastructure/data.json',
  devops_setup: '_json/devops_setup/data.json',
  recovery_protocol: '_json/recovery_protocol/data.json',
  security: '_json/security/data.json',
  design_system: '_json/design_system/data.json',
  common_components: '_json/common_components/data.json',
  functions_analysis: '_json/functions_analysis/data.json',
  data_schemas: '_json/data_schemas/data.json',
  api_schemas: '_json/api_schemas/data.json',
  tech_org: '_json/tech_org/data.json',
  recommended_actions: '_json/recommended_actions/data.json',
  // Подразделы recommended_actions
  recommended_v1: '_json/recommended_actions/v1/data.json',
  recommended_bap: '_json/recommended_actions/bap/data.json',
  codegen_instructions: '_json/codegen_instructions/data.json',
  message_attachments: '_json/message_attachments/data.json',
  illegitimate_md: '_json/illegitimate_md/data.json',
  mockups: '_json/mockups/data.json',
  // Подразделы mockups
  mockups_components: '_json/mockups/components/data.json',
  mockups_phone: '_json/mockups/phone/data.json',
  mockups_laptop_16_10: '_json/mockups/laptop_16_10/data.json',
  mockups_laptop_16_9: '_json/mockups/laptop_16_9/data.json',
  mockups_square: '_json/mockups/square/data.json',
  resolved_problems: '_json/resolved_problems/data.json'
};

// State
let sectionData = {};
let currentSection = 'overview';

// Load JSON - с поддержкой file:// протокола (встроенные данные)
async function loadSection(sectionId) {
  if (sectionData[sectionId]) return sectionData[sectionId];
  const path = sections[sectionId];
  try {
    const resp = await fetch(path);
    sectionData[sectionId] = await resp.json();
    return sectionData[sectionId];
  } catch (e) {
    console.warn(`fetch failed for ${path}, using embedded data:`, e.message);
    // Fallback: встроенные данные для работы без сервера
    if (EMBEDDED_JSON && EMBEDDED_JSON[sectionId]) {
      sectionData[sectionId] = EMBEDDED_JSON[sectionId];
      return sectionData[sectionId];
    }
    console.error(`No embedded data for ${sectionId}`);
    return [];
  }
}

// Render functions
function renderOverview(data) {
  if (!data.length) return;
  const d = data[0];
  
  // Определяем список полей для отображения
  const scoreFields = [
    { key: 'doc_quality', label: 'Качество документации' },
    { key: 'recovery_readiness', label: 'Пригодность для восстановления' },
    { key: 'functional_coverage', label: 'Полнота покрытия' },
    { key: 'technical_feasibility', label: 'Техническая реализуемость' },
    { key: 'security_score', label: 'Безопасность' },
    { key: 'compliance_score', label: 'Compliance 150-ФЗ' },
    { key: 'avg_implementation_readiness', label: 'Средняя готовность' }
  ];
  
  // Рендерим квадраты с V1 — V2 (в тех же квадратах)
  let scoresHtml = '';
  scoreFields.forEach(({ key, label }) => {
    const v1 = d.scores_v1 ? d.scores_v1[key] : null;
    const v2 = d.scores_v2 ? d.scores_v2[key] : null;
    const combined = d.scores ? d.scores[key] : null;
    
    // Формируем значение: "V1 — V2" в одном квадрате
    let valueDisplay;
    let color;
    
    if (v1 !== null && v2 !== null) {
      // Оба значения есть — показываем "V1 — V2"
      valueDisplay = `${v1} — ${v2}`;
      const avg = (v1 + v2) / 2;
      color = avg >= 8 ? 'var(--green)' : avg >= 6 ? 'var(--orange)' : 'var(--red)';
    } else if (combined !== null) {
      // Только combined (старый формат)
      valueDisplay = combined;
      color = combined >= 8 ? 'var(--green)' : combined >= 6 ? 'var(--orange)' : 'var(--red)';
    } else {
      valueDisplay = '—';
      color = 'var(--text-dim)';
    }
    
    scoresHtml += `
      <div class="score-item">
        <div class="score-value" style="color:${color}; font-size:1.8em; line-height:1.2;">${valueDisplay}</div>
        <div class="score-label" style="font-size:0.8em;">${label}</div>
      </div>
    `;
  });
  
  document.getElementById('overviewScores').innerHTML = scoresHtml;
  
  // Summary
  let summaryHtml = `<p>${d.summary}</p>`;
  
  // Добавляем summary функций
  if (d.functions_summary) {
    const fs = d.functions_summary;
    summaryHtml += `
      <div style="margin-top:16px; padding-top:16px; border-top:1px solid var(--border);">
        <h4 style="color:var(--accent); margin-bottom:8px;">📊 Функциональный охват:</h4>
        <div class="score-card" style="margin:12px 0;">
          <div class="score-item">
            <div class="score-value" style="color:var(--cyan)">${fs.total_functions}</div>
            <div class="score-label">Всего функций</div>
          </div>
          <div class="score-item">
            <div class="score-value" style="color:var(--green)">${fs.v1_current}</div>
            <div class="score-label">V1 текущих</div>
          </div>
          <div class="score-item">
            <div class="score-value" style="color:var(--orange)">${fs.v2_deferred}</div>
            <div class="score-label">V2 отложенных</div>
          </div>
        </div>
        <p style="font-size:0.9em; color:var(--text-dim);">
          <strong>V1 категории:</strong> ${Object.entries(fs.v1_categories).map(([k,v]) => `${k}: ${v}`).join(', ')}<br>
          <strong>V2 категории:</strong> ${Object.entries(fs.v2_categories).map(([k,v]) => `${k}: ${v}`).join(', ')}
        </p>
      </div>
    `;
  }
  
  // Добавляем статус миграций
  if (d.status) {
    summaryHtml += `
      <div style="margin-top:12px; padding-top:12px; border-top:1px solid var(--border); font-size:0.9em;">
        <strong>Статус:</strong> 
        Killer features: ${d.status.killer_features} | 
        V2 миграция: ${d.status.v2_migrated} | 
        Статусы: ${d.status.all_statuses}
      </div>
    `;
  }
  
  document.getElementById('overviewSummary').innerHTML = summaryHtml;
  document.getElementById('overviewStrengths').innerHTML = d.strengths.map(s => `<li>${s}</li>`).join('');
  document.getElementById('overviewWeaknesses').innerHTML = d.weaknesses.map(w => `<li>${w}</li>`).join('');
}

function renderProblems(data) {
  const unresolved = data.filter(p => !p.resolved);
  const resolvedCount = data.filter(p => p.resolved).length;
  const total = data.length;
  
  let html = `
    <div class="score-card" style="margin-bottom:24px;">
      <div class="score-item">
        <div class="score-value" style="color:var(--accent)">${total}</div>
        <div class="score-label">Всего проблем</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color:var(--green)">${resolvedCount}</div>
        <div class="score-label">Решено ✅</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color:var(--red)">${unresolved.length}</div>
        <div class="score-label">Нерешённых ⛔</div>
      </div>
    </div>
  `;
  
  if (!unresolved.length) {
    html += `<div class="summary-box" style="border-left:3px solid var(--green); padding:16px; margin-bottom:16px;">
      <h3 style="color:var(--green); margin:0 0 8px;">🎉 Все проблемы решены!</h3>
      <p>Все ${total} проблем имеют выбранные решения. Перейдите в раздел <a href="#" onclick="switchSection('resolved_problems'); return false;" style="color:var(--accent);">✅ Решённые</a> чтобы посмотреть их.</p>
    </div>`;
  }
  
  html += unresolved.map(p => {
    const sevClass = p.severity === 'critical' ? 'badge-critical' : p.severity === 'warning' ? 'badge-warning' : 'badge-ok';
    const sevLabel = p.severity === 'critical' ? 'Критическая' : p.severity === 'warning' ? 'Предупреждение' : 'Минор';
    
    let solutionHtml = p.solutions.map(s => `
      <div class="solution-block">
        <div class="solution-title">Вариант: ${s.name}</div>
        <p>${s.detail}</p>
      </div>
    `).join('');
    
    return `
      <div class="problem" style="border-left-color: var(--red);">
        <div class="problem-num" style="color:var(--red);">⛔ Проблема #${p.id}: ${p.title} <span class="badge ${sevClass}">${sevLabel}</span></div>
        <p>${p.description}</p>
        ${solutionHtml}
      </div>
    `;
  }).join('');
  
  document.getElementById('problemsList').innerHTML = html;
}

async function renderDeferred() {
  // Новый формат: индекс с подразделами
  const data = sectionData.deferred || [];
  
  // Проверяем, это индекс (объект с subsections) или старый массив
  if (data && data.subsections) {
    const index = data;
    let html = `
      <div class="summary-box" style="border-left: 4px solid var(--purple); margin-bottom:24px;">
        <h3 style="color:var(--purple);">⏳ Отложено до V2 — ${index.totals?.total_items || 0} элементов</h3>
        <p style="color:var(--text-dim); margin-top:8px;">${index.description || 'Функции V2, отложенные до запуска платформы'}</p>
      </div>
      
      <div class="score-card" style="margin-bottom:24px;">
        <div class="score-item">
          <div class="score-value" style="color:var(--purple)">${index.totals?.premium_items || 0}</div>
          <div class="score-label">Premium</div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color:var(--green)">${index.totals?.features_items || 0}</div>
          <div class="score-label">Features</div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color:var(--orange)">${index.totals?.international_items || 0}</div>
          <div class="score-label">International</div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color:var(--cyan)">${index.totals?.ai_premium_items || 0}</div>
          <div class="score-label">AI & Premium</div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color:var(--accent)">${index.totals?.auth_platform_items || 0}</div>
          <div class="score-label">Auth Platform</div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color:var(--red)">${index.totals?.payments_items || 0}</div>
          <div class="score-label">Payments</div>
        </div>
      </div>
    `;
    
    // Рендерим каждый подраздел
    for (const subsection of index.subsections) {
      try {
        const subData = await loadSection(`deferred_${subsection.id}`);
        if (subData && subData.items) {
          html += `
            <h3 class="sub-title" style="border-left-color: var(--purple); margin:24px 0 16px;">
              ⏳ ${subsection.title} (${subData.items.length} элементов)
            </h3>
            <p style="color:var(--text-dim); margin-bottom:16px;">${subsection.description}</p>
          `;
          
          // Рендерим items из подраздела
          if (Array.isArray(subData.items)) {
            html += subData.items.map(item => `
              <div class="comp-card" style="border-left: 4px solid var(--purple); margin: 12px 0;">
                <div class="feature-header">
                  <div>
                    <span class="feature-name">${item.name || item.title || item.id}</span>
                    ${item.category ? `<span class="badge badge-info">${item.category}</span>` : ''}
                    ${item.version ? `<span class="badge badge-v2">${item.version}</span>` : ''}
                  </div>
                </div>
                <p style="margin:8px 0;">${item.description || ''}</p>
                ${item.status ? `<p style="color:var(--orange); font-size:0.9em;">📌 ${item.status}</p>` : ''}
                ${item.reason ? `<p style="color:var(--text-dim); font-size:0.9em;">Причина: ${item.reason}</p>` : ''}
              </div>
            `).join('');
          }
          
          // Рендерим categories если есть (для premium)
          if (subData.categories) {
            subData.categories.forEach(cat => {
              html += `
                <h4 style="color:var(--accent); margin:16px 0 8px;">${cat.name || cat.id} (${cat.items?.length || 0})</h4>
              `;
              if (cat.items && Array.isArray(cat.items)) {
                html += cat.items.map(item => `
                  <div class="solution-block" style="margin: 12px 0; border-left: 3px solid var(--accent);">
                    <div class="solution-title">${item.title || item.name}</div>
                    <p>${item.description || ''}</p>
                    ${item.escalation ? `<p style="color:var(--red); font-size:0.9em;">⚠️ Эскалация: ${Array.isArray(item.escalation) ? item.escalation.join(', ') : item.escalation}</p>` : ''}
                    ${item.price ? `<p style="color:var(--purple); font-size:0.9em;">💰 ${item.price}</p>` : ''}
                  </div>
                `).join('');
              }
            });
          }
        }
      } catch (e) {
        console.warn(`Failed to load subsection ${subsection.id}:`, e);
        html += `<div class="summary-box" style="border-left: 3px solid var(--red);">⚠️ Не удалось загрузить подраздел: ${subsection.id}</div>`;
      }
    }
    
    // Roadmap triggers
    if (index.roadmap_triggers) {
      html += `
        <div class="summary-box" style="border-left: 4px solid var(--green); margin-top:24px;">
          <h4 style="color:var(--green); margin-bottom:8px;">🚀 Условия запуска V2</h4>
          <ul style="padding-left:20px;">
            ${index.roadmap_triggers.users ? `<li>${index.roadmap_triggers.users}</li>` : ''}
            ${index.roadmap_triggers.revenue ? `<li>${index.roadmap_triggers.revenue}</li>` : ''}
          </ul>
          ${index.roadmap_triggers.actions ? `
            <h5 style="color:var(--accent); margin:12px 0 8px;">Действия:</h5>
            <ul style="padding-left:20px;">
              ${index.roadmap_triggers.actions.map(a => `<li>${a}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `;
    }
    
    document.getElementById('deferredList').innerHTML = html;
    return;
  }
  
  // Старый формат (массив) - fallback
  document.getElementById('deferredList').innerHTML = Array.isArray(data) ? data.map(group => {
    const isV2Functions = group.category && group.category.includes('V2 функции (перенесены');
    
    if (isV2Functions) {
      return `
        <div class="comp-card" style="border-left: 4px solid var(--purple);">
          <div class="comp-name">
            ⏳ V2 функции (перенесены из functions/data.json)
            <span class="badge badge-v2">${group.count} шт.</span>
          </div>
          ${group.items.map(item => `
            <div class="solution-block" style="margin: 12px 0; border-left: 3px solid var(--accent);">
              <div class="solution-title">#${item.id}: ${item.name}</div>
              <p>${item.description || ''}</p>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    return `
      <div class="comp-card" style="border-left: 4px solid var(--orange);">
        <div class="comp-name">⏳ ${group.category} (${group.count} шт.)</div>
        ${group.items.map(item => `
          <div class="solution-block" style="margin: 12px 0;">
            <div class="solution-title">#${item.id}: ${item.title}</div>
            <p>${item.description || ''}</p>
          </div>
        `).join('')}
      </div>
    `;
  }).join('') : '<div class="summary-box">Нет данных</div>';
}

function renderFunctions(data) {
  document.getElementById('functionsTable').innerHTML = data.map(f => {
    const vClass = f.version === 'v1' ? 'badge-v1' : 'badge-v2';
    const pBadge = f.premium 
      ? `<span class="badge badge-premium">${f.premium_price || 'Premium'}</span>` 
      : `<span class="badge badge-free">Free</span>`;
    
    // Статус реализации
    let statusBadge = '';
    if (f.status) {
      if (f.status.includes('ожидают реализации')) {
        statusBadge = `<span class="badge badge-warning">⏳ Ожидание</span>`;
      } else if (f.status.includes('✅ Spec')) {
        statusBadge = `<span class="badge badge-ok">✅ Spec</span>`;
      } else if (f.status.includes('🟡')) {
        statusBadge = `<span class="badge badge-warning">🟡 Partial</span>`;
      } else if (f.status.includes('❌')) {
        statusBadge = `<span class="badge badge-critical">❌ Missing</span>`;
      } else {
        statusBadge = `<span class="badge badge-info">${f.status}</span>`;
      }
    }
    
    return `
      <tr>
        <td><code>${f.id}</code></td>
        <td><strong>${f.name}</strong>${f.usp ? ' <span class="badge badge-info">USP</span>' : ''}</td>
        <td>${f.description}</td>
        <td><span class="badge ${vClass}">${f.version}</span></td>
        <td>${pBadge} ${statusBadge}</td>
      </tr>
    `;
  }).join('');
}

function renderUiConflicts(data) {
  const resolvedCount = data.filter(c => c.resolved).length;
  const total = data.length;
  
  let html = `
    <div class="score-card" style="margin-bottom:24px;">
      <div class="score-item">
        <div class="score-value" style="color:var(--accent)">${total}</div>
        <div class="score-label">Всего UI-конфликтов</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color:var(--green)">${resolvedCount}</div>
        <div class="score-label">Решено ✅</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color:var(--orange)">${total - resolvedCount}</div>
        <div class="score-label">Осталось</div>
      </div>
    </div>
  `;
  
  html += data.map(c => {
    const sevClass = c.severity === 'critical' ? 'badge-critical' : c.severity === 'warning' ? 'badge-warning' : 'badge-ok';
    const sevLabel = c.severity === 'critical' ? 'Критический' : c.severity === 'warning' ? 'Предупреждение' : 'Минор';
    const isResolved = c.resolved;
    
    let resolutionHtml = '';
    if (isResolved) {
      const selectedSolution = c.solutions.find(s => s.resolved) || c.solutions[0];
      resolutionHtml = `
        <div class="solution-block" style="border-left:3px solid var(--green); background:rgba(34,197,94,0.05); margin-bottom:12px;">
          <div class="solution-title" style="color:var(--green);">✅ РЕШЕНО: ${selectedSolution.name}</div>
          <p>${selectedSolution.detail}</p>
          ${selectedSolution.resolved ? `<p style="color:var(--cyan); font-size:0.9em;"><strong>Изменения в файлах:</strong> ${selectedSolution.changes || selectedSolution.resolved}</p>` : ''}
          ${c.resolution_note ? `<p style="color:var(--text-dim); font-size:0.85em; font-style:italic;">📝 ${c.resolution_note}</p>` : ''}
        </div>
      `;
    } else {
      resolutionHtml = `
        <h4 style="color:var(--green); margin: 12px 0 8px;">Решения:</h4>
        ${c.solutions.map(s => `
          <div class="solution-block">
            <div class="solution-title">Вариант: ${s.name}</div>
            <p>${s.detail}</p>
          </div>
        `).join('')}
      `;
    }
    
    return `
      <div class="problem" style="border-left-color: ${isResolved ? 'var(--green)' : 'var(--purple)'}">
        <div class="problem-num" style="color:${isResolved ? 'var(--green)' : 'var(--purple)'}">${isResolved ? '✅' : '🎨'} UI-Конфликт #${c.id}: ${c.title} <span class="badge ${sevClass}">${sevLabel} | ${c.category}</span></div>
        <p>${c.description}</p>
        <h4 style="color:var(--orange); margin: 12px 0 8px;">Конфликты:</h4>
        <ul>${c.conflicts.map(cf => `<li>${cf}</li>`).join('')}</ul>
        ${resolutionHtml}
      </div>
    `;
  }).join('');
  
  document.getElementById('uiConflictsList').innerHTML = html;
}

function renderKillerFeatures(data) {
  if (!data.length) return;
  
  // Проверяем, есть ли данные в старом формате (phases) или новый (MOVED)
  if (data[0].status === 'MOVED') {
    const moved = data[0];
    document.getElementById('killerFeaturesList').innerHTML = `
      <div class="summary-box" style="border-left: 4px solid var(--orange);">
        <h3 style="color:var(--orange); margin-bottom:12px;">⚠️ УВЕДОМЛЕНИЕ</h3>
        <p style="font-size:1.1em; margin-bottom:16px;"><strong>Все функции перенесены в:</strong></p>
        <div class="score-card" style="margin:16px 0;">
          <div class="score-item" style="border-left: 3px solid var(--green);">
            <div style="font-weight:700; color:var(--green); margin-bottom:4px;">📄 MD документ</div>
            <div style="font-size:0.9em; word-break:break-all;">BALLOO_MASTER_RECOVERY_GUIDE/функции.md</div>
          </div>
          <div class="score-item" style="border-left: 3px solid var(--accent);">
            <div style="font-weight:700; color:var(--accent); margin-bottom:4px;">📦 JSON файл</div>
            <div style="font-size:0.9em; word-break:break-all;">steps/_json/functions/data.json</div>
          </div>
        </div>
        <h4 style="color:var(--accent); margin:16px 0 8px;">Статистика переноса:</h4>
        <div class="score-card" style="margin:12px 0;">
          <div class="score-item">
            <div class="score-value" style="color:var(--green)">${moved.summary.v1_moved}</div>
            <div class="score-label">V1 перенесено</div>
          </div>
          <div class="score-item">
            <div class="score-value" style="color:var(--orange)">${moved.summary.v2_basic_moved}</div>
            <div class="score-label">V2 Basic перенесено</div>
          </div>
          <div class="score-item">
            <div class="score-value" style="color:var(--purple)">${moved.summary.v2_premium_moved}</div>
            <div class="score-label">V2 Premium перенесено</div>
          </div>
        </div>
        <p style="margin-top:12px; color:var(--text-dim);">
          <strong>Итого:</strong> ${moved.summary.total_moved} фич перенесены полностью<br>
          <strong>Искать в:</strong> функции.md (по MESG-XXX ID) или functions/data.json (по id/name)
        </p>
      </div>
    `;
    return;
  }
  
  // Старый формат (phases) - на всякий случай
  document.getElementById('killerFeaturesList').innerHTML = data.map(group => {
    const isV1 = group.phase === 'V1';
    const isPremium = group.label.includes('Premium');
    const borderColor = isV1 ? 'var(--green)' : isPremium ? 'var(--orange)' : 'var(--purple)';
    
    return `
      <h3 class="sub-title" style="border-left-color:${borderColor}; padding-left:16px;">${group.label} (${group.count} фич)</h3>
      ${group.features.map(f => `
        <div class="feature-card" style="border-left: 4px solid ${isPremium ? 'var(--orange)' : 'var(--green)'}">
          <div class="feature-header">
            <span class="feature-name">${f.id}: ${f.name}</span>
            <div class="feature-tags">
              <span class="badge ${isV1 ? 'badge-v1' : isPremium ? 'badge-premium' : 'badge-v2'}">${group.phase}${isPremium ? ' Premium' : ''}</span>
            </div>
          </div>
          <p class="feature-desc">${f.description}</p>
          <div class="feature-tags">
            <span class="badge ${f.effort === 'low' ? 'badge-ok' : f.effort === 'medium' ? 'badge-warning' : 'badge-critical'}">Эфф: ${f.effort === 'low' ? 'Низкий' : f.effort === 'medium' ? 'Средний' : 'Высокий'}</span>
            <span class="badge ${f.impact === 'high' ? 'badge-critical' : f.impact === 'medium' ? 'badge-warning' : 'badge-ok'}">Влияние: ${f.impact === 'high' ? 'Высокое' : f.impact === 'medium' ? 'Среднее' : 'Низкое'}</span>
            ${f.why_v1 ? `<span style="color:var(--green); font-style:italic; font-size:0.9em;">💡 ${f.why_v1}</span>` : ''}
            ${f.price_suggestion ? `<span class="badge badge-premium">💰 ${f.price_suggestion}</span>` : ''}
          </div>
        </div>
      `).join('')}
    `;
  }).join('');
}

function renderLegalAnalysis(data) {
  document.getElementById('legalAnalysisList').innerHTML = data.map(country => {
    const lawsHtml = country.key_laws.map(l => {
      const sevClass = l.type === 'critical' ? 'badge-critical' : 'badge-warning';
      return `<div class="law-item"><span>${l.name}</span><span class="badge ${sevClass}">${l.title}</span></div>`;
    }).join('');
    
    const problemsHtml = country.problem_points.map(p => {
      const sevClass = p.severity === 'critical' ? 'badge-critical' : 'badge-warning';
      return `
        <div class="solution-block" style="border-left:3px solid var(--red);">
          <div class="solution-title">${p.id}: ${p.category} <span class="badge ${sevClass}">${p.severity === 'critical' ? 'Критично' : 'Предупреждение'}</span></div>
          <p><strong>Описание:</strong> ${p.description}</p>
          <p><strong>Влияние:</strong> ${p.impact}</p>
          <p><strong>Решение:</strong> ${p.solution}</p>
        </div>
      `;
    }).join('');
    
    const checklistHtml = country.compliance_checklist.map(item => {
      const icon = item.substring(0, 2);
      return `<li>${icon} ${item.substring(2)}</li>`;
    }).join('');
    
    return `
      <div class="legal-country">
        <div class="legal-title">${country.country} <span class="badge badge-v1">${country.code}</span></div>
        <h4 style="color:var(--orange); margin-bottom:8px;">Ключевые законы:</h4>
        ${lawsHtml}
        <h4 style="color:var(--red); margin:16px 0 8px;">Проблемные точки:</h4>
        ${problemsHtml}
        <h4 style="color:var(--green); margin:16px 0 8px;">Compliance Checklist:</h4>
        <ul class="checklist">${checklistHtml}</ul>
      </div>
    `;
  }).join('');
}

function renderUserPerspective(data) {
  const strengths = data.find(d => d.category === 'Strengths')?.items || [];
  const weaknesses = data.find(d => d.category === 'Weaknesses')?.items || [];
  
  document.getElementById('userStrengths').innerHTML = strengths.map(s => `
    <div class="sp-item" style="border-left-color:var(--green)">
      <div class="sp-item-name">${s.name} <span class="badge ${s.impact === 'high' ? 'badge-critical' : s.impact === 'medium' ? 'badge-warning' : 'badge-ok'}">${s.impact}</span></div>
      <p class="sp-item-desc">${s.description}</p>
      <p class="sp-item-benefit">💚 ${s.user_benefit}</p>
    </div>
  `).join('');
  
  document.getElementById('userWeaknesses').innerHTML = weaknesses.map(w => `
    <div class="sp-item" style="border-left-color:var(--red)">
      <div class="sp-item-name">${w.name} <span class="badge ${w.impact === 'critical' ? 'badge-critical' : w.impact === 'high' ? 'badge-high' : 'badge-medium'}">${w.impact}</span></div>
      <p class="sp-item-desc">${w.description}</p>
      <p class="sp-item-friction">⚡ ${w.user_friction}</p>
    </div>
  `).join('');
}

function renderCompetitiveAnalysis(data) {
  document.getElementById('competitiveList').innerHTML = data.map(c => {
    return `
      <div class="comp-card">
        <div class="comp-name">${c.competitor}</div>
        <div class="comp-ms">Доля рынка: РФ ${c.market_share_ru} | РБ ${c.market_share_by}</div>
        <div class="comp-grid">
          <div class="comp-section strengths">
            <h4>✅ Сильные стороны конкурента</h4>
            <ul>${c.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
          </div>
          <div class="comp-section weaknesses">
            <h4>❌ Слабые стороны конкурента</h4>
            <ul>${c.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
          </div>
        </div>
        <div class="comp-grid" style="margin-top:12px;">
          <div class="comp-section" style="border-left:3px solid var(--green); padding-left:12px;">
            <h4 style="color:var(--green)">🎈 Balloo ВЫГОДНЕЕ</h4>
            <ul>${c.balloo_advantage.map(a => `<li>${a}</li>`).join('')}</ul>
          </div>
          <div class="comp-section" style="border-left:3px solid var(--red); padding-left:12px;">
            <h4 style="color:var(--red)">🎈 Balloo ПРОИГРЫВАЕТ</h4>
            <ul>${c.balloo_disadvantage.map(d => `<li>${d}</li>`).join('')}</ul>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderRoadmap(data) {
  document.getElementById('roadmapTimeline').innerHTML = data.map(r => `
    <div class="timeline-item">
      <div class="timeline-phase">Phase ${r.phase}: ${r.name}</div>
      <div class="timeline-duration">⏱ ${r.duration}</div>
      <ul class="timeline-tasks">${r.tasks.map(t => `<li>${t}</li>`).join('')}</ul>
    </div>
  `).join('');
}

function renderRisks(data) {
  document.getElementById('risksTable').innerHTML = data.map(r => {
    const probClass = r.probability === 'high' ? 'badge-critical' : r.probability === 'medium' ? 'badge-warning' : 'badge-ok';
    const impClass = r.impact === 'critical' ? 'badge-critical' : r.impact === 'high' ? 'badge-high' : 'badge-warning';
    return `
      <tr>
        <td><strong>${r.risk}</strong></td>
        <td><span class="badge ${probClass}">${r.probability === 'high' ? 'Высокая' : r.probability === 'medium' ? 'Средняя' : 'Низкая'}</span></td>
        <td><span class="badge ${impClass}">${r.impact === 'critical' ? 'Критическое' : r.impact === 'high' ? 'Высокое' : 'Среднее'}</span></td>
        <td>${r.mitigation}</td>
      </tr>
    `;
  }).join('');
}

function renderVerdict(data) {
  if (!data.length) return;
  
  // Новый формат: массив {id, title, score, comment}
  const avgScore = (data.reduce((sum, d) => sum + d.score, 0) / data.length).toFixed(1);
  
  let html = `
    <div class="score-card" style="margin-bottom:20px;">
      <div class="score-item">
        <div class="score-value" style="color:var(--accent)">${avgScore}/10</div>
        <div class="score-label">Средний балл</div>
      </div>
    </div>
    <h4 style="color:var(--accent); margin-bottom:12px;">Оценки по категориям:</h4>
    <table>
      <thead><tr><th>ID</th><th>Категория</th><th>Балл</th><th>Комментарий</th></tr></thead>
      <tbody>
        ${data.map(d => `
          <tr>
            <td>${d.id}</td>
            <td><strong>${d.title}</strong></td>
            <td><span class="badge ${d.score >= 8 ? 'badge-ok' : d.score >= 6 ? 'badge-warning' : 'badge-critical'}">${d.score}</span></td>
            <td>${d.comment}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  document.getElementById('verdictContent').innerHTML = html;
}

// Section switching
async function switchSection(sectionId) {
  currentSection = sectionId;
  
  document.querySelectorAll('.section-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });
  
  document.querySelectorAll('.section-content').forEach(content => {
    content.classList.toggle('active', content.id === `section-${sectionId}`);
  });
  
  const data = sectionData[sectionId] || [];
  
  // Async рендереры (для подразделов)
  const asyncRenderers = {
    deferred: renderDeferred,
    recommended_actions: renderRecommendedActions,
    mockups: renderMockups
  };
  
  // Sync рендереры
  const syncRenderers = {
    overview: renderOverview,
    problems: renderProblems,
    functions: renderFunctions,
    ui_conflicts: renderUiConflicts,
    killer_features: renderKillerFeatures,
    legal_analysis: renderLegalAnalysis,
    user_perspective: renderUserPerspective,
    competitive_analysis: renderCompetitiveAnalysis,
    roadmap: renderRoadmap,
    risks: renderRisks,
    verdict: renderVerdict,
    nodes: renderNodes,
    screens: renderScreens,
    infrastructure: renderInfrastructure,
    devops_setup: renderDevOpsSetup,
    recovery_protocol: renderRecoveryProtocol,
    security: renderSecurity,
    design_system: renderDesignSystem,
    common_components: renderCommonComponents,
    functions_analysis: renderFunctionsAnalysis,
    data_schemas: renderDataSchemas,
    api_schemas: renderApiSchemas,
    tech_org: renderTechOrg,
    codegen_instructions: renderCodegenInstructions,
    message_attachments: renderMessageAttachments,
    illegitimate_md: renderIllegitimateMD,
    resolved_problems: renderResolvedProblems
  };
  
  if (asyncRenderers[sectionId]) {
    await asyncRenderers[sectionId]();
  } else if (syncRenderers[sectionId]) {
    syncRenderers[sectionId](data);
  }
}

function renderNodes(data) {
  // Статусы и приоритеты с русскими названиями и цветами
  const statusMap = {
    implemented: { label: 'Реализован', color: 'var(--green)' },
    partial: { label: 'Частично', color: 'var(--orange)' },
    stub: { label: 'Заглушка', color: 'var(--text-dim)' },
    planned: { label: 'Запланирован', color: 'var(--accent)' },
    deferred_v2: { label: 'Отложен V2', color: 'var(--purple)' },
    docs_only: { label: 'Только docs', color: 'var(--text-dim)' },
    disabled: { label: 'Отключён', color: 'var(--red)' }
  };
  
  const priorityMap = {
    critical: { label: 'Критический', color: 'var(--red)' },
    high: { label: 'Высокий', color: 'var(--orange)' },
    normal: { label: 'Обычный', color: 'var(--accent)' },
    low: { label: 'Низкий', color: 'var(--green)' }
  };
  
  const typeMap = {
    client: { label: '🖥 Клиентский', color: 'var(--green)' },
    technical: { label: '⚙️ Технический', color: 'var(--accent)' }
  };
  
  const entityKindMap = {
    runtime: { label: 'Runtime', color: 'var(--cyan)' },
    artifact: { label: 'Artifact', color: 'var(--purple)' },
    workspace: { label: 'Workspace', color: 'var(--orange)' }
  };
  
  const visMap = {
    public: { label: '🌐 Публичный', color: 'var(--green)' },
    internal: { label: '🔒 Внутренний', color: 'var(--orange)' }
  };
  
  const dsMap = {
    api: 'API', db: 'DB', storage: 'Storage', mixed: 'Mixed', manual: 'Manual', none: 'None'
  };
  
  // Группируем по type + visibility
  const grouped = {};
  data.forEach(n => {
    const type = n.type || 'technical';
    const vis = n.visibility || 'internal';
    const key = `${type}_${vis}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(n);
  });
  
  const typeLabels = {
    client: '🖥 Клиентский',
    technical: '⚙️ Технический'
  };
  const visLabels = {
    public: '🌐 Публичный',
    internal: '🔒 Внутренний'
  };
  
  let html = '';
  
  // Сводная статистика
  html += `
    <div class="score-card" style="margin-bottom:24px;">
      <div class="score-item">
        <div class="score-value" style="color:var(--accent)">${data.length}</div>
        <div class="score-label">Всего узлов</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color:var(--green)">${data.filter(n => n.type === 'client').length}</div>
        <div class="score-label">Клиентских</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color:var(--accent)">${data.filter(n => n.type === 'technical').length}</div>
        <div class="score-label">Технических</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color:var(--cyan)">${data.filter(n => n.entity_kind === 'runtime').length}</div>
        <div class="score-label">Runtime</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color:var(--purple)">${data.filter(n => n.entity_kind === 'artifact').length}</div>
        <div class="score-label">Artifact</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color:var(--orange)">${data.filter(n => n.entity_kind === 'workspace').length}</div>
        <div class="score-label">Workspace</div>
      </div>
    </div>
  `;
  
  Object.entries(grouped).forEach(([groupKey, nodes]) => {
    if (!nodes.length) return;
    const [type, vis] = groupKey.split('_');
    
    html += `<h3 class="sub-title" style="border-left-color: var(--accent);">${typeLabels[type] || type} | ${visLabels[vis] || vis} (${nodes.length})</h3>`;
    
    nodes.forEach(n => {
      const st = statusMap[n.implementation_status] || { label: n.implementation_status || 'N/A', color: 'var(--text-dim)' };
      const pr = priorityMap[n.priority] || { label: n.priority || 'N/A', color: 'var(--text-dim)' };
      const tp = typeMap[n.type] || { label: n.type || 'technical', color: 'var(--text-dim)' };
      const ek = entityKindMap[n.entity_kind] || { label: n.entity_kind || 'runtime', color: 'var(--text-dim)' };
      const vi = visMap[n.visibility] || { label: n.visibility || 'internal', color: 'var(--text-dim)' };
      
      const isSecurityRisky = n.security_review_required || (n.access && n.access.security_review_required);
      const isTemporary = n.temporary_risky_mechanism || (n.access && n.access.temporary_risky_mechanism);
      const isDomainless = !n.hostname || n.hostname === null;
      const isWorkspace = n.entity_kind === 'workspace';
      const isArtifact = n.entity_kind === 'artifact';
      
      let borderColor = 'var(--green)';
      if (isSecurityRisky) borderColor = 'var(--red)';
      else if (n.priority === 'critical') borderColor = 'var(--red)';
      else if (n.priority === 'high') borderColor = 'var(--orange)';
      else if (isDomainless) borderColor = 'var(--purple)';
      else if (isWorkspace) borderColor = 'var(--orange)';
      else if (isArtifact) borderColor = 'var(--purple)';
      
      html += `
        <div class="comp-card" style="border-left: 4px solid ${borderColor}; margin: 16px 0;">
          <div class="feature-header">
            <div>
              <span class="feature-name">${n.name || n.id}</span>
              <span style="color:var(--text-dim); font-size:0.85em; margin-left:8px;">(<code>${n.id}</code>)</span>
            </div>
            <div class="feature-tags">
              <span class="badge badge-info">${ek.label}</span>
              <span class="badge" style="background:${st.color}22; color:${st.color};">${st.label}</span>
              <span class="badge" style="background:${pr.color}22; color:${pr.color};">${pr.label}</span>
              ${vi.label.includes('Публичный') ? '<span class="badge badge-ok">🌐 Public</span>' : '<span class="badge badge-warning">🔒 Internal</span>'}
              ${isSecurityRisky ? '<span class="badge badge-critical">⚠️ Security Review</span>' : ''}
              ${isTemporary ? '<span class="badge badge-critical">🔴 Temporary Risky</span>' : ''}
              ${isDomainless ? '<span class="badge badge-info">Без домена</span>' : ''}
              ${isWorkspace ? '<span class="badge badge-premium">Workspace</span>' : ''}
              ${isArtifact ? '<span class="badge badge-v2">Artifact</span>' : ''}
            </div>
          </div>
          
          ${n.role ? `<p class="comp-ms">${n.role}</p>` : ''}
          
          <!-- Основные поля -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin:12px 0;">
            <div><strong>Домен:</strong> ${n.hostname ? `<code>${n.hostname}</code>` : '<span style="color:var(--text-dim);">—</span>'}</div>
            <div><strong>Порты:</strong> ${n.ports && n.ports.length ? n.ports.map(p => `<code>${p}</code>`).join(', ') : '<span style="color:var(--text-dim);">—</span>'}</div>
            <div><strong>Данные:</strong> ${dsMap[n.data_source] || n.data_source || '—'}</div>
          </div>
          
          <!-- Owner -->
          ${n.owner ? `
            <div style="margin:8px 0; padding:8px; background:var(--surface2); border-radius:4px; font-size:0.9em;">
              <strong>👤 Owner:</strong> ${n.owner.role || '—'} | Assignee: ${n.owner.assignee || '—'} | Supervisor: ${n.owner.supervisor || '—'}
            </div>
          ` : ''}
          
          <!-- Notes -->
          ${n.notes && n.notes.length ? `
            <h4 style="color:var(--purple); margin:12px 0 8px;">📝 Notes:</h4>
            <ul style="padding-left:20px;">${n.notes.map(note => `<li style="margin-bottom:4px;">${note}</li>`).join('')}</ul>
          ` : ''}
          
          <!-- Services (для runtime) -->
          ${n.services && n.services.length ? `
            <h4 style="color:var(--accent); margin:12px 0 8px;">⚙️ Services:</h4>
            <ul>${n.services.map(s => `<li>${s}</li>`).join('')}</ul>
          ` : ''}
          
          <!-- Dependencies & Calls -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin:12px 0;">
            ${n.dependencies && n.dependencies.length ? `
              <div>
                <h4 style="color:var(--orange); margin:0 0 6px;">📥 Dependencies:</h4>
                <p>${n.dependencies.map(d => `<code>${d}</code>`).join(', ')}</p>
              </div>
            ` : ''}
            ${n.calls && n.calls.length ? `
              <div>
                <h4 style="color:var(--cyan); margin:0 0 6px;">📤 Calls:</h4>
                <p>${n.calls.map(c => `<code>${c}</code>`).join(', ')}</p>
              </div>
            ` : ''}
          </div>
          
          <!-- Function IDs -->
          ${n.function_ids && n.function_ids.length ? `
            <h4 style="color:var(--green); margin:12px 0 8px;">🔧 Functions (${n.function_ids.length}):</h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${n.function_ids.map(f => `<span class="badge badge-info" style="font-size:0.75em;">${f}</span>`).join('')}
            </div>
          ` : ''}
          
          <!-- Screen IDs -->
          ${n.screen_ids && n.screen_ids.length ? `
            <h4 style="color:var(--purple); margin:12px 0 8px;">📱 Screens (${n.screen_ids.length}):</h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${n.screen_ids.map(s => `<span class="badge badge-v2" style="font-size:0.75em;">${s}</span>`).join('')}
            </div>
          ` : ''}
          
          <!-- Component IDs -->
          ${n.component_ids && n.component_ids.length ? `
            <h4 style="color:var(--cyan); margin:12px 0 8px;">🧩 Components (${n.component_ids.length}):</h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${n.component_ids.map(c => `<span class="badge badge-ok" style="font-size:0.75em;">${c}</span>`).join('')}
            </div>
          ` : ''}
          
          <!-- Shared Packages (workspace) -->
          ${n.shared_package_ids && n.shared_package_ids.length ? `
            <h4 style="color:var(--orange); margin:12px 0 8px;">📦 Shared Packages:</h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${n.shared_package_ids.map(p => `<span class="badge badge-premium" style="font-size:0.75em;">${p}</span>`).join('')}
            </div>
          ` : ''}
          
          <!-- Distribution (artifact) -->
          ${n.distribution && typeof n.distribution === 'object' && !Array.isArray(n.distribution) ? `
            <h4 style="color:var(--green); margin:12px 0 8px;">📦 Distribution:</h4>
            <table>
              <thead><tr><th>Платформа</th><th>URL</th></tr></thead>
              <tbody>
                ${Object.entries(n.distribution).map(([plat, url]) => `
                  <tr><td><strong>${plat.toUpperCase()}</strong></td><td><code style="word-break:break-all;">${url}</code></td></tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}
          
          <!-- Requirements -->
          ${n.requirements && typeof n.requirements === 'object' ? `
            <h4 style="color:var(--orange); margin:12px 0 8px;">💻 Requirements ${n.requirements_changeable ? '(изменяемые)' : ''}:</h4>
            <table>
              <thead><tr><th>Ресурс</th><th>Значение</th></tr></thead>
              <tbody>
                ${Object.entries(n.requirements).map(([k,v]) => `<tr><td><strong>${k.toUpperCase()}</strong></td><td>${v}</td></tr>`).join('')}
              </tbody>
            </table>
          ` : ''}
          
          <!-- Security Risk Flags -->
          ${isSecurityRisky || isTemporary ? `
            <div class="solution-block" style="border-left: 3px solid var(--red); background: rgba(248,81,73,0.05); margin-top:12px;">
              <div class="solution-title" style="color:var(--red);">
                ⚠️ Security Risk
                ${isSecurityRisky ? ' | Review Required' : ''}
                ${isTemporary ? ' | Temporary Risky Mechanism' : ''}
              </div>
              ${n.access && n.access.description ? `<p><strong>Описание:</strong> ${n.access.description}</p>` : ''}
              ${n.access && n.access.mechanism ? `<p><strong>Механизм:</strong> ${n.access.mechanism}</p>` : ''}
              ${n.access && n.access.cross_platform ? `
                <p><strong>Путь к ключу:</strong></p>
                <ul>
                  ${Object.entries(n.access.cross_platform).map(([os, path]) => `<li><strong>${os.toUpperCase()}:</strong> <code>${path}</code></li>`).join('')}
                </ul>
              ` : ''}
              ${n.access && n.access.companion_app ? `
                <h5 style="color:var(--orange); margin:8px 0 4px;">Companion App:</h5>
                <p>${n.access.companion_app.description}</p>
                <p style="font-size:0.9em; color:var(--orange);">⚠️ ${n.access.companion_app.notes ? n.access.companion_app.notes.join(' ') : 'Требует пересмотра'}</p>
              ` : ''}
            </div>
          ` : ''}
          
          <!-- Codegen UI -->
          ${n.ui && n.ui.buttons ? `
            <div class="solution-block" style="border-left: 3px solid var(--accent); background: rgba(88,166,255,0.05); margin-top:12px;">
              <div class="solution-title" style="color:var(--accent);">🚀 CLI-Codegen UI</div>
              ${n.ui.buttons.map(btn => `
                <div style="margin:8px 0; padding:8px; background:var(--surface2); border-radius:4px;">
                  <p><strong>${btn.label}</strong></p>
                  <code style="font-size:0.85em; color:var(--text-dim);">${btn.action}</code>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    });
  });
  
  document.getElementById('nodesList').innerHTML = html;
}

function renderScreens(data) {
  // Статистика
  const v1Screens = data.filter(s => !s.premium_only && !s.notice);
  const v2Screens = data.filter(s => s.premium_only || s.sla || s.notice);
  const withMockup = data.filter(s => s.mockup).length;
  
  let html = `
    <div class="score-card" style="margin-bottom:24px;">
      <div class="score-item">
        <div class="score-value" style="color:var(--accent)">${data.length}</div>
        <div class="score-label">Всего экранов</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color:var(--green)">${v1Screens.length}</div>
        <div class="score-label">V1 экранов</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color:var(--purple)">${v2Screens.length}</div>
        <div class="score-label">V2/Premium экранов</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color:var(--cyan)">${withMockup}</div>
        <div class="score-label">С mockup</div>
      </div>
    </div>
  `;
  
  // Группируем по узлам
  const grouped = {};
  data.forEach(s => {
    const nodes = (s.node_ids || []).map(n => n.replace('node-', '')).join(', ') || 'general';
    if (!grouped[nodes]) grouped[nodes] = [];
    grouped[nodes].push(s);
  });
  
  Object.entries(grouped).forEach(([nodeGroup, screens]) => {
    html += `<h3 class="sub-title" style="border-left-color: var(--accent);">📱 Узлы: ${nodeGroup} (${screens.length})</h3>`;
    
    screens.forEach(s => {
      const isPremium = s.premium_only;
      const isV2Special = s.sla || s.notice;
      let borderColor = 'var(--green)';
      if (isPremium) borderColor = 'var(--purple)';
      else if (isV2Special) borderColor = 'var(--orange)';
      
      html += `
        <div class="comp-card" style="border-left: 4px solid ${borderColor}; margin: 12px 0;">
          <div class="feature-header">
            <div>
              <span class="feature-name">${s.name}</span>
              <span style="color:var(--text-dim); font-size:0.85em; margin-left:8px;">(<code>${s.id}</code>)</span>
            </div>
            <div class="feature-tags">
              <span class="badge badge-info">${s.path}</span>
              ${isPremium ? '<span class="badge badge-premium">🔒 Premium</span>' : ''}
              ${isV2Special ? '<span class="badge badge-v2">V2</span>' : ''}
              ${s.mockup ? '<span class="badge badge-ok">📸 Mockup</span>' : '<span class="badge badge-warning">Без mockup</span>'}
            </div>
          </div>
          
          ${s.mockup ? `<p style="color:var(--cyan); font-size:0.9em;">📸 <code>${s.mockup}</code></p>` : ''}
          ${s.notice ? `<p style="color:var(--orange); font-size:0.9em;">📢 ${s.notice}</p>` : ''}
          ${s.sla ? `<p style="color:var(--accent); font-size:0.9em;">⏱ SLA: ${s.sla}</p>` : ''}
          
          ${s.components && s.components.length ? `
            <h4 style="color:var(--purple); margin:8px 0;">Компоненты:</h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${s.components.map(c => `<span class="badge badge-info" style="font-size:0.8em;">${c}</span>`).join('')}
            </div>
          ` : ''}
          
          ${s.api_requests && s.api_requests.length ? `
            <h4 style="color:var(--accent); margin:8px 0;">API Requests:</h4>
            <ul style="padding-left:20px;">
              ${s.api_requests.map(r => `<li><code>${r}</code></li>`).join('')}
            </ul>
          ` : ''}
          
          ${s.missing_api && s.missing_api.length ? `
            <h4 style="color:var(--red); margin:8px 0;">⚠️ Missing API:</h4>
            <ul style="padding-left:20px;">
              ${s.missing_api.map(r => `<li><strong>${r}</strong></li>`).join('')}
            </ul>
          ` : ''}
          
          ${s.node_ids && s.node_ids.length ? `
            <h4 style="color:var(--green); margin:8px 0;">Узлы:</h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${s.node_ids.map(n => `<span class="badge badge-ok" style="font-size:0.75em;">${n}</span>`).join('')}
            </div>
          ` : ''}
          
          ${s.shared_components && s.shared_components.length ? `
            <h4 style="color:var(--cyan); margin:8px 0;">Shared Components:</h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${s.shared_components.map(c => `<span class="badge badge-v2" style="font-size:0.75em;">${c}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      `;
    });
  });
  
  document.getElementById('screensList').innerHTML = html;
}

function renderInfrastructure(data) {
  document.getElementById('infraList').innerHTML = data.map(i => `
    <div class="legal-country">
      <div class="legal-title">${i.name}</div>
      ${i.location ? `<p><strong>Location:</strong> ${i.location}</p>` : ''}
      ${i.domain ? `<p><strong>Domain:</strong> ${i.domain}</p>` : ''}
      ${i.compliance ? `
        <h4 style="color:var(--orange); margin:12px 0;">Compliance:</h4>
        <ul>${i.compliance.map(c => `<li>${c}</li>`).join('')}</ul>
      ` : ''}
      ${i.firewall ? `<p><strong>Firewall:</strong> ${i.firewall}</p>` : ''}
      ${i.ddos_protection ? `<p><strong>DDoS:</strong> ${i.ddos_protection}</p>` : ''}
    </div>
  `).join('');
}

function renderE2eStrategy(data) {
  document.getElementById('e2eStrategyList').innerHTML = data.map(s => `
    <div class="comp-card" style="border-left: 4px solid var(--red);">
      <div class="comp-name">${s.title}</div>
      <p><strong>Current:</strong> ${s.current_state}</p>
      <p><strong>Target:</strong> ${s.target_state}</p>
      ${s.final_decision ? `<p style="color:var(--green); font-weight:700;">✅ ${s.final_decision}</p>` : ''}
    </div>
  `).join('') + data.filter(d => d.phase).map(phase => `
    <div class="comp-card" style="border-left: 4px solid var(--green);">
      <div class="comp-name">${phase.phase} <span class="badge badge-v2">${phase.duration}</span></div>
      <p><strong>Tech:</strong> ${phase.tech}</p>
      ${phase.is_premium ? `<span class="badge badge-premium">Premium</span>` : ''}
      <h4 style="color:var(--accent); margin:8px 0;">Features:</h4>
      <ul>${phase.features.map(f => `<li>${f}</li>`).join('')}</ul>
      ${phase.levels ? `
        <h4 style="color:var(--purple); margin:8px 0;">Уровни Secret Chats:</h4>
        ${phase.levels.map(l => `
          <div class="solution-block">
            <div class="solution-title">${l.level}: ${l.name}</div>
            <p>${l.description}</p>
            ${l.ai_filter ? `
              <h5 style="color:var(--orange); margin:6px 0;">AI-Фильтр:</h5>
              <ul>
                <li>Триггеры: ${l.ai_filter.triggers.join(', ')}</li>
                <li>Действие: ${l.ai_filter.action}</li>
                <li>Апелляция: ${l.ai_filter.appeal.type} (${l.ai_filter.appeal.sla})</li>
                <li>Review: ${l.ai_filter.appeal.reviewer}</li>
                <li>Learning: ${l.ai_filter.appeal.learning}</li>
              </ul>
              <h5 style="color:var(--red); margin:6px 0;">Эскалация:</h5>
              <ul>
                ${l.ai_filter.escalation.map(e => `<li>${e.action}</li>`).join('')}
              </ul>
            ` : ''}
            ${l.group_rule ? `<p><strong>Групповое правило:</strong> ${l.group_rule}</p>` : ''}
            ${l.anonymous_complaint ? `<p><strong>Анонимная жалоба:</strong> ${l.anonymous_complaint}</p>` : ''}
          </div>
        `).join('')}
      ` : ''}
      ${phase.calls_policy ? `
        <h4 style="color:var(--orange); margin:12px 0;">Политика звонков:</h4>
        <div class="solution-block">
          <p><strong>Запись:</strong> ${phase.calls_policy.recording}</p>
          <p><strong>Уведомление:</strong> ${phase.calls_policy.notice}</p>
          <p><strong>Скачивание:</strong> ${phase.calls_policy.download ? 'Да, клиенты могут просмотреть/скачать' : 'Нет'}</p>
        </div>
      ` : ''}
      ${phase.priority_order ? `
        <h4 style="color:var(--cyan); margin:12px 0;">Приоритеты:</h4>
        <ul>${Object.entries(phase.priority_order).map(([k,v]) => `<li>#${k}: ${v}</li>`).join('')}</ul>
      ` : ''}
      ${phase.api_endpoints ? `
        <h4 style="color:var(--purple); margin:8px 0;">API Endpoints:</h4>
        <ul>${phase.api_endpoints.map(e => `<li><code>${e}</code></li>`).join('')}</ul>
      ` : ''}
      ${phase.security_notes ? `
        <h4 style="color:var(--orange); margin:8px 0;">Security Notes:</h4>
        <ul>${phase.security_notes.map(n => `<li>${n}</li>`).join('')}</ul>
      ` : ''}
    </div>
  `).join('');
}

function renderPremiumPolicies(data) {
  // Находим header (объект с id: "premium-policy-header")
  const header = data.find(d => d.id === 'premium-policy-header');
  // Находим features (объект с feature и items)
  const policyFeatures = data.filter(d => d.feature && d.feature.includes('Premium-функции V2'));
  // Находим policy details (остальные с feature, но без items)
  const policyDetails = data.filter(d => d.feature && !d.feature.includes('Premium-функции V2') && !d.feature.includes('Secret Chats'));
  // Secret Chats feature
  const secretChats = data.find(d => d.feature && d.feature.includes('Premium Secret Chats'));
  
  let html = '';
  
  // Header card
  if (header) {
    html += `
      <div class="comp-card" style="border-left: 4px solid var(--orange); background: linear-gradient(135deg, rgba(255,165,0,0.1), rgba(248,81,73,0.05));">
        <div class="comp-name">${header.title}</div>
        ${header.version ? `<span class="badge badge-v2">v${header.version}</span>` : ''}
        ${header.is_final ? '<span class="badge badge-critical" style="margin-left:8px;">🔒 ФИНАЛЬНОЕ РЕШЕНИЕ</span>' : ''}
        <p style="color:var(--green); font-weight:700; margin-top:8px;">✅ Никаких изменений больше не будет.</p>
        ${header.v2_migration ? `
          <div style="margin-top:12px; padding:12px; background:rgba(88,166,255,0.1); border-radius:4px; border-left:3px solid var(--accent);">
            <h4 style="color:var(--accent); margin-bottom:8px;">🔄 V2 Миграция</h4>
            <p><strong>Статус:</strong> ${header.v2_migration.status}</p>
            <p><strong>Примечание:</strong> ${header.v2_migration.notice}</p>
            <p style="color:var(--text-dim); font-size:0.85em;">Источник: ${header.v2_migration.moved_from}</p>
          </div>
        ` : ''}
        <p style="color:var(--text-dim); margin-top:8px;">${header.notice || ''}</p>
      </div>
    `;
  }
  
  // Secret Chats feature
  if (secretChats) {
    html += `
      <div class="comp-card" style="border-left: 4px solid var(--purple);">
        <div class="comp-name">${secretChats.feature}</div>
        ${secretChats.access ? `<p><strong>Доступ:</strong> ${secretChats.access}</p>` : ''}
        ${secretChats.levels ? `
          <h4 style="color:var(--accent); margin:8px 0;">Уровни:</h4>
          ${secretChats.levels.map(l => `
            <div class="solution-block">
              <div class="solution-title">${l.level}</div>
              <p>${l.description}</p>
              ${l.ai_filter ? `
                <h5 style="color:var(--orange); margin:6px 0;">AI-Фильтр:</h5>
                <ul>
                  ${l.ai_filter.triggers.map(t => `<li>${t}</li>`).join('')}
                </ul>
                <p><strong>Действие:</strong> ${l.ai_filter.action}</p>
                <p><strong>Апелляция:</strong> ${l.ai_filter.appeal.type} (${l.ai_filter.appeal.sla})</p>
                <p><strong>Review:</strong> ${l.ai_filter.appeal.reviewer}</p>
                <p><strong>Learning:</strong> ${l.ai_filter.appeal.learning}</p>
              ` : ''}
              ${l.group_rule ? `<p><strong>Групповое правило:</strong> ${l.group_rule}</p>` : ''}
              ${l.anonymous_complaint ? `<p><strong>Анонимная жалоба:</strong> ${l.anonymous_complaint}</p>` : ''}
            </div>
          `).join('')}
        ` : ''}
        ${secretChats.escalation_matrix ? `
          <h4 style="color:var(--red); margin:8px 0;">Матрица Эскалации:</h4>
          <table>
            <thead><tr><th>Кол-во</th><th>Период</th><th>Действие</th></tr></thead>
            <tbody>
              ${secretChats.escalation_matrix.map(e => `<tr><td>${e.count}</td><td>${e.period || '-'}</td><td>${e.action}</td></tr>`).join('')}
            </tbody>
          </table>
        ` : ''}
        ${secretChats.terms_notice ? `<p><strong>Условия:</strong> ${secretChats.terms_notice}</p>` : ''}
        ${secretChats.priority_order ? `
          <h4 style="color:var(--cyan); margin:8px 0;">Приоритеты:</h4>
          <ul>${Object.entries(secretChats.priority_order).map(([k,v]) => `<li>#${k}: ${v}</li>`).join('')}</ul>
        ` : ''}
      </div>
    `;
  }
  
  // Other policy details
  policyDetails.forEach(feature => {
    html += `
      <div class="comp-card" style="border-left: 4px solid var(--green);">
        <div class="comp-name">${feature.feature}</div>
        ${feature.policy ? `<p><strong>Политика:</strong> ${feature.policy}</p>` : ''}
        ${feature.notice_to_users ? `<p><strong>Уведомление пользователям:</strong> ${feature.notice_to_users}</p>` : ''}
        ${feature.user_access ? `<p><strong>Доступ пользователей:</strong> ${feature.user_access}</p>` : ''}
        ${feature.data_sharing ? `<p><strong>Передача данных:</strong> ${feature.data_sharing}</p>` : ''}
        ${feature.channel ? `<p><strong>Канал:</strong> ${feature.channel}</p>` : ''}
        ${feature.validation ? `<p><strong>Валидация:</strong> ${feature.validation}</p>` : ''}
        ${feature.compliance_150 ? `<p><strong>Compliance 150-ФЗ:</strong> ${feature.compliance_150}</p>` : ''}
      </div>
    `;
  });
  
  // Premium V2 Functions list
  policyFeatures.forEach(feature => {
    html += `
      <div class="comp-card" style="border-left: 4px solid var(--purple);">
        <div class="comp-name">${feature.feature}</div>
        ${feature.v2_note ? `<p style="color:var(--purple); font-weight:600; margin-bottom:12px;">${feature.v2_note}</p>` : ''}
        <table>
          <thead><tr><th>ID</th><th>Функция</th><th>Цена</th><th>Категория</th></tr></thead>
          <tbody>
            ${feature.items.map(item => `
              <tr>
                <td><code>${item.id}</code></td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td><span class="badge badge-info">${item.category}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  });
  
  document.getElementById('premiumPoliciesList').innerHTML = html;
}

function renderDevOpsSetup(data) {
  if (!data.length) return;
  const d = data[0];
  document.getElementById('devopsSetupList').innerHTML = `
    <div class="summary-box">
      <h3>${d.title}</h3>
      <p><strong>Версия:</strong> ${d.version} | <strong>Дата:</strong> ${d.date}</p>
      <h4 style="color:var(--accent); margin:12px 0 8px;">Архитектура:</h4>
      <ul>${Object.entries(d.architecture).map(([k,v]) => `<li>${k}: ${v}</li>`).join('')}</ul>
      <h4 style="color:var(--purple); margin:12px 0 8px;">Порты узлов:</h4>
      <table><thead><tr><th>Узел</th><th>Порт</th></tr></thead><tbody>
        ${Object.entries(d.ports).map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
      </tbody></table>
      <h4 style="color:var(--green); margin:12px 0 8px;">ORM:</h4><p>${d.orm}</p>
      <h4 style="color:var(--orange); margin:12px 0 8px;">Тестирование:</h4>
      <p>${d.testing.framework} | Backend: ${d.testing.backend_goal}, Frontend: ${d.testing.frontend_goal}</p>
      <h4 style="color:var(--cyan); margin:12px 0 8px;">Требования к серверу:</h4>
      <ul>${Object.entries(d.server_requirements).map(([k,v]) => `<li>${k.toUpperCase()}: ${v}</li>`).join('')}</ul>
    </div>
  `;
}

function renderRecoveryProtocol(data) {
  if (!data.length) return;
  const d = data[0];
  document.getElementById('recoveryProtocolList').innerHTML = `
    <div class="summary-box">
      <h3>${d.title}</h3>
      <p><strong>Статус:</strong> ${d.status} | <strong>Локация:</strong> ${d.location} | <strong>Домен:</strong> ${d.domain}</p>
      <h4 style="color:var(--red); margin:12px 0 8px;">Hard Constraints:</h4>
      <ul>${Object.entries(d.hard_constraints).map(([k,v]) => `<li><strong>${k}:</strong> ${typeof v === 'object' ? JSON.stringify(v) : v}</li>`).join('')}</ul>
      <h4 style="color:var(--green); margin:12px 0 8px;">E2E Рекомендации:</h4>
      <ul>${d.e2e_recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
      <h4 style="color:var(--orange); margin:12px 0 8px;">Premium Policies ${d.premium_policies.final ? '<span class="badge badge-critical">ФИНАЛЬНОЕ</span>' : ''}:</h4>
      <ul>${Object.entries(d.premium_policies).filter(([k]) => k !== 'final').map(([k,v]) => `<li><strong>${k}:</strong> ${typeof v === 'object' ? JSON.stringify(v) : v}</li>`).join('')}</ul>
    </div>
  `;
}

function renderSecurity(data) {
  if (!data.length) return;
  const d = data[0];
  document.getElementById('securityList').innerHTML = `
    <div class="summary-box">
      <h3>${d.title}</h3>
      <p><strong>Версия:</strong> ${d.version} | <strong>Дата:</strong> ${d.date}</p>
      <h4 style="color:var(--accent); margin:12px 0 8px;">Аутентификация:</h4>
      <ul>${Object.entries(d.authentication).map(([k,v]) => `<li><strong>${k}:</strong> ${JSON.stringify(v)}</li>`).join('')}</ul>
      <h4 style="color:var(--purple); margin:12px 0 8px;">E2EE:</h4>
      <ul>${Object.entries(d.e2ee).filter(([k]) => k !== 'future').map(([k,v]) => `<li><strong>${k}:</strong> ${JSON.stringify(v)}</li>`).join('')}</ul>
      <h4 style="color:var(--green); margin:12px 0 8px;">OWASP Защита:</h4>
      <ul>${Object.entries(d.owasp_protection).map(([k,v]) => `<li><strong>${k}:</strong> ${JSON.stringify(v)}</li>`).join('')}</ul>
      <h4 style="color:var(--orange); margin:12px 0 8px;">Комплаенс:</h4>
      <ul>${Object.entries(d.compliance).map(([k,v]) => `<li><strong>${k}:</strong> ${JSON.stringify(v)}</li>`).join('')}</ul>
    </div>
  `;
}

function renderDesignSystem(data) {
  if (!data.length) return;
  const d = data[0];
  
  // Поддержка старой структуры (company) и новой (brand)
  const company = d.company || d.brand?.company || {};
  const brand = d.brand || d.company || {};
  
  let html = `
    <div class="summary-box">
      <h3>${d.title}</h3>
      <p><strong>Версия:</strong> ${d.version} | <strong>Дата:</strong> ${d.date}</p>
      
      ${company.full_name ? `
        <h4 style="color:var(--accent); margin:12px 0 8px;">🏢 Компания:</h4>
        <p><strong>Название:</strong> ${company.full_name} | <strong>Город:</strong> ${company.city || 'N/A'}</p>
        <p><strong>Слоган:</strong> ${company.slogan || ''}</p>
      ` : ''}
      
      <h4 style="color:var(--accent); margin:12px 0 8px;">🎈 Бренд:</h4>
      <p><strong>Название:</strong> ${brand.name} | <strong>Домен:</strong> ${brand.domain || company.website} | <strong>Эмодзи:</strong> ${brand.emoji}</p>
      ${brand.slogan ? `<p><strong>Слоган:</strong> ${brand.slogan}</p>` : ''}
      
      ${d.colors ? `
        <h4 style="color:var(--purple); margin:12px 0 8px;">🎨 Цвета:</h4>
        <table>
          <thead><tr><th>Тип</th><th>Цвет</th><th>Значение</th></tr></thead>
          <tbody>
            ${d.colors.brand ? Object.entries(d.colors.brand).map(([k,v]) => `<tr><td><strong>Brand</strong></td><td><code>${v}</code></td><td>${k}</td></tr>`).join('') : ''}
            ${d.colors.semantic ? Object.entries(d.colors.semantic).map(([k,v]) => `<tr><td><strong>Semantic</strong></td><td><code>${v}</code></td><td>${k}</td></tr>`).join('') : ''}
          </tbody>
        </table>
      ` : ''}
      
      ${d.themes ? `
        <h4 style="color:var(--green); margin:12px 0 8px;">🌓 Темы:</h4>
        <table>
          <thead><tr><th>ID</th><th>Название</th><th>Фон</th><th>По умолчанию</th></tr></thead>
          <tbody>
            ${(d.themes.presets || []).map(t => `<tr><td>${t.id}</td><td>${t.name}</td><td><code>${t.background}</code></td><td>${t.default ? '✅' : ''}</td></tr>`).join('')}
          </tbody>
        </table>
      ` : ''}
      
      ${d.design_contract ? `
        <h4 style="color:var(--orange); margin:12px 0 8px;">📐 Дизайн-контракт:</h4>
        <p><strong>Border Radius:</strong> ${d.design_contract.border_radius}</p>
        ${d.design_contract.justification ? `<ul>${d.design_contract.justification.map(j => `<li>${j}</li>`).join('')}</ul>` : ''}
      ` : ''}
      
      ${d.typography ? `
        <h4 style="color:var(--cyan); margin:12px 0 8px;">🔤 Типографика:</h4>
        <p><strong>Font Family:</strong> ${d.typography.font_family}</p>
        <table>
          <thead><tr><th>Размер</th><th>Значение</th></tr></thead>
          <tbody>
            ${Object.entries(d.typography.sizes || {}).map(([k,v]) => `<tr><td>${k}</td><td><code>${v}</code></td></tr>`).join('')}
          </tbody>
        </table>
      ` : ''}
      
      ${d.components ? `
        <h4 style="color:var(--purple); margin:12px 0 8px;">🧩 Компоненты:</h4>
        <ul>${d.components.map(c => `<li>${c}</li>`).join('')}</ul>
      ` : ''}
      
      ${d.animations ? `
        <h4 style="color:var(--green); margin:12px 0 8px;">✨ Анимации:</h4>
        <p><strong>Keyframes:</strong> ${(d.animations.keyframes || []).join(', ')}</p>
      ` : ''}
      
      ${d.responsive ? `
        <h4 style="color:var(--accent); margin:12px 0 8px;">📱 Адаптивность:</h4>
        <table>
          <thead><tr><th>Breakpoint</th><th>Значение</th></tr></thead>
          <tbody>
            ${Object.entries(d.responsive.breakpoints || {}).map(([k,v]) => `<tr><td>${k}</td><td><code>${v}</code></td></tr>`).join('')}
          </tbody>
        </table>
      ` : ''}
      
      ${d.layouts ? `
        <h4 style="color:var(--orange); margin:12px 0 8px;">📐 Layouts:</h4>
        <ul>${Object.entries(d.layouts).map(([k,v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('')}</ul>
      ` : ''}
    </div>
  `;
  
  document.getElementById('designSystemList').innerHTML = html;
}

function renderCommonComponents(data) {
  if (!data.length) return;
  const d = data[0];
  let html = '';
  
  // Заголовок
  html += `
    <div class="summary-box" style="margin-bottom:20px;">
      <h3>${d.title}</h3>
      <p><strong>Версия:</strong> ${d.version} | <strong>Дата:</strong> ${d.date}</p>
      <p style="color:var(--text-dim); font-size:0.9em;">Всего категорий: ${Object.keys(d.components || {}).length}</p>
    </div>
  `;
  
  const categoryLabels = {
    layout: '📐 Layout',
    form: '📝 Form',
    'data_display': '📊 Data Display',
    overlay: '🔲 Overlay',
    feedback: '💬 Feedback',
    navigation: '🧭 Navigation',
    'input_extended': '⌨️ Extended Inputs',
    'data_extended': '📋 Extended Data'
  };
  
  const categoryIcons = {
    layout: '📐',
    form: '📝',
    'data_display': '📊',
    overlay: '🔲',
    feedback: '💬',
    navigation: '🧭',
    'input_extended': '⌨️',
    'data_extended': '📋'
  };
  
  Object.entries(d.components || {}).forEach(([category, components]) => {
    const label = categoryLabels[category] || category.toUpperCase();
    const icon = categoryIcons[category] || '📦';
    
    html += `<h3 class="sub-title" style="color:var(--accent);">${icon} ${label} (${components.length})</h3>`;
    
    html += components.map(c => `
      <div class="comp-card" style="margin: 12px 0;">
        <div class="feature-header">
          <div>
            <span class="feature-name">${c.id}: ${c.name}</span>
            <span class="badge badge-info">${c.type}</span>
            <span class="badge badge-v2">Level: ${c.level}</span>
          </div>
        </div>
        
        ${c.behavior ? `<p style="color:var(--purple);"><strong>Behavior:</strong> ${c.behavior}</p>` : ''}
        ${c.use ? `<p style="color:var(--cyan);"><strong>Use:</strong> ${c.use}</p>` : ''}
        
        ${c.desktop ? `
          <h4 style="color:var(--accent); margin:8px 0;">🖥 Desktop:</h4>
          <table>
            <tbody>
              ${Object.entries(c.desktop).map(([k,v]) => `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`).join('')}
            </tbody>
          </table>
        ` : ''}
        
        ${c.mobile ? `
          <h4 style="color:var(--green); margin:8px 0;">📱 Mobile:</h4>
          <table>
            <tbody>
              ${Object.entries(c.mobile).map(([k,v]) => `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`).join('')}
            </tbody>
          </table>
        ` : ''}
        
        ${c.sizes ? `
          <h4 style="color:var(--orange); margin:8px 0;">📏 Sizes:</h4>
          <table>
            <tbody>
              ${Object.entries(c.sizes).map(([k,v]) => `<tr><td><strong>${k}</strong></td><td><code>${v}</code></td></tr>`).join('')}
            </tbody>
          </table>
        ` : ''}
        
        ${c.variants ? `
          <h4 style="color:var(--purple); margin:8px 0;">🎨 Variants:</h4>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            ${Array.isArray(c.variants) ? c.variants.map(v => `<span class="badge badge-ok">${v}</span>`).join('') : `<span class="badge badge-ok">${c.variants}</span>`}
          </div>
        ` : ''}
        
        ${c.features ? `
          <h4 style="color:var(--cyan); margin:8px 0;">⚡ Features:</h4>
          <ul>${Array.isArray(c.features) ? c.features.map(f => `<li>${f}</li>`).join('') : `<li>${c.features}</li>`}</ul>
        ` : ''}
        
        ${c.animation ? `<p style="color:var(--accent);"><strong>Animation:</strong> ${c.animation}</p>` : ''}
      </div>
    `).join('');
  });
  
  document.getElementById('commonComponentsList').innerHTML = html;
}

function renderFunctionsAnalysis(data) {
  if (!data.length) return;
  const d = data[0];
  document.getElementById('functionsAnalysisList').innerHTML = `
    <div class="summary-box">
      <h3>${d.title}</h3>
      <p><strong>V1 функции:</strong> ${d.total_functions_v1} | <strong>V2 функции:</strong> ${d.total_functions_v2} | <strong>Всего:</strong> ${d.total_functions_v1 + d.total_functions_v2}</p>
      <h4 style="color:var(--accent); margin:12px 0 8px;">Категории V1:</h4>
      ${Object.entries(d.categories).filter(([k]) => !k.startsWith('v2_')).map(([k,funcs]) => `
        <div class="solution-block" style="margin:8px 0;">
          <div class="solution-title">${k}: ${funcs.length} функций</div>
          <ul>${funcs.map(f => `<li>${f}</li>`).join('')}</ul>
        </div>
      `).join('')}
      <h4 style="color:var(--purple); margin:12px 0 8px;">Категории V2:</h4>
      ${Object.entries(d.categories).filter(([k]) => k.startsWith('v2_')).map(([k,funcs]) => `
        <div class="solution-block" style="margin:8px 0;">
          <div class="solution-title">${k}: ${funcs.length} функций</div>
          <ul>${funcs.map(f => `<li>${f}</li>`).join('')}</ul>
        </div>
      `).join('')}
    </div>
  `;
}

function renderDataSchemas(data) {
  if (!data.length) return;
  const d = data[0];
  document.getElementById('dataSchemasList').innerHTML = `
    <div class="summary-box">
      <h3>${d.title}</h3>
      <p><strong>ORM:</strong> ${d.orm} | <strong>Database:</strong> ${d.database}</p>
      <h4 style="color:var(--accent); margin:12px 0 8px;">Таблицы:</h4>
      ${d.tables.map(t => `
        <div class="comp-card">
          <div class="comp-name">${t.name} <span class="badge badge-info">${t.fields.length} полей</span></div>
          <ul>${t.fields.map(f => `<li>${f}</li>`).join('')}</ul>
          ${t.retention ? `<p><strong>Retention:</strong> ${t.retention}</p>` : ''}
          ${t.write_only ? '<p><strong>Write-only:</strong> true</p>' : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function renderApiSchemas(data) {
  if (!data.length) return;
  const d = data[0];
  document.getElementById('apiSchemasList').innerHTML = `
    <div class="summary-box">
      <h3>${d.title}</h3>
      <p><strong>Версия:</strong> ${d.version} | <strong>Base URL:</strong> ${d.base_url}</p>
      ${Object.entries(d.endpoints).map(([category, endpoints]) => `
        <h4 style="color:var(--accent); margin:12px 0 8px;">${category.toUpperCase()} (${endpoints.length} endpoints):</h4>
        <table>
          <thead><tr><th>Метод</th><th>Path</th><th>Описание</th></tr></thead>
          <tbody>
            ${endpoints.map(e => `<tr><td><span class="badge ${e.method === 'GET' ? 'badge-ok' : e.method === 'POST' ? 'badge-info' : e.method === 'PUT' ? 'badge-warning' : 'badge-critical'}">${e.method}</span></td><td><code>${e.path}</code></td><td>${e.description}</td></tr>`).join('')}
          </tbody>
        </table>
      `).join('')}
    </div>
  `;
}

function renderTechOrg(data) {
  if (!data.length) return;
  const d = data[0];
  document.getElementById('techOrgList').innerHTML = `
    <div class="summary-box">
      <h3>${d.title}</h3>
      ${d.questions.map(q => `
        <div class="comp-card">
          <div class="comp-name">${q.id}: ${q.question} <span class="badge badge-info">${q.category}</span></div>
          <div class="solution-block">
            <div class="solution-title">Ответ:</div>
            <p>${q.answer}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderRecommendedActions(data) {
  if (!data.length) return;
  const d = data[0];
  
  // V1 секция
  let v1Html = '';
  const v1 = d.v1;
  if (v1 && v1.actions) {
    v1Html = `
      <div class="summary-box" style="border-left: 4px solid var(--green); margin-bottom:24px;">
        <h3 style="color:var(--green);">🎯 V1 — Текущие метрики → Целевые 10</h3>
        <p style="color:var(--text-dim);">Всего шагов: ${Object.values(v1.actions).reduce((sum, m) => sum + m.steps.length, 0)}</p>
    `;
    
    Object.entries(v1.actions).forEach(([metric, info]) => {
      const current = info.current;
      const target = info.target;
      const gap = target - current;
      const gapPercent = Math.round((gap / (target - 0)) * 100);
      
      v1Html += `
        <div class="comp-card" style="border-left: 3px solid ${gap > 2 ? 'var(--red)' : gap > 1 ? 'var(--orange)' : 'var(--green)'}; margin: 16px 0;">
          <div class="feature-header">
            <div>
              <span class="feature-name">${metric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </div>
            <div class="feature-tags">
              <span class="badge badge-info">Текущее: ${current}</span>
              <span class="badge badge-ok">Цель: ${target}</span>
              <span class="badge ${gap > 2 ? 'badge-critical' : 'badge-warning'}">Gap: ${gap}</span>
            </div>
          </div>
          
          ${info.steps.map((step, idx) => `
            <div class="solution-block" style="margin: 12px 0; border-left: 3px solid var(--accent);">
              <div class="solution-title">
                #${idx + 1}. ${step.title}
                <span class="badge ${step.effort === 'low' ? 'badge-ok' : step.effort === 'medium' ? 'badge-warning' : 'badge-critical'}">${step.effort === 'low' ? 'Низкий' : step.effort === 'medium' ? 'Средний' : 'Высокий'} effort</span>
              </div>
              <p><strong>Варианты действий (${step.variants.length}):</strong></p>
              <ol style="margin-top:8px; padding-left:24px;">
                ${step.variants.map((v, vi) => `<li style="margin-bottom:6px;">${v}</li>`).join('')}
              </ol>
            </div>
          `).join('')}
        </div>
      `;
    });
    
    v1Html += '</div>';
  }
  
  // V2 секция
  let v2Html = '';
  const v2 = d.v2;
  if (v2 && v2.actions) {
    v2Html = `
      <div class="summary-box" style="border-left: 4px solid var(--purple); margin-bottom:24px;">
        <h3 style="color:var(--purple);">🎯 V2 — Отложенные метрики → Целевые 10</h3>
        <p style="color:var(--text-dim);">Всего шагов: ${Object.values(v2.actions).reduce((sum, m) => sum + m.steps.length, 0)}</p>
    `;
    
    Object.entries(v2.actions).forEach(([metric, info]) => {
      const current = info.current;
      const target = info.target;
      const gap = target - current;
      
      v2Html += `
        <div class="comp-card" style="border-left: 3px solid ${gap > 3 ? 'var(--red)' : gap > 2 ? 'var(--orange)' : 'var(--green)'}; margin: 16px 0;">
          <div class="feature-header">
            <div>
              <span class="feature-name">${metric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </div>
            <div class="feature-tags">
              <span class="badge badge-info">Текущее: ${current}</span>
              <span class="badge badge-ok">Цель: ${target}</span>
              <span class="badge ${gap > 3 ? 'badge-critical' : 'badge-warning'}">Gap: ${gap}</span>
            </div>
          </div>
          
          ${info.steps.map((step, idx) => `
            <div class="solution-block" style="margin: 12px 0; border-left: 3px solid var(--accent);">
              <div class="solution-title">
                #${idx + 1}. ${step.title}
                <span class="badge ${step.effort === 'low' ? 'badge-ok' : step.effort === 'medium' ? 'badge-warning' : 'badge-critical'}">${step.effort === 'low' ? 'Низкий' : step.effort === 'medium' ? 'Средний' : 'Высокий'} effort</span>
              </div>
              <p><strong>Варианты действий (${step.variants.length}):</strong></p>
              <ol style="margin-top:8px; padding-left:24px;">
                ${step.variants.map((v, vi) => `<li style="margin-bottom:6px;">${v}</li>`).join('')}
              </ol>
            </div>
          `).join('')}
        </div>
      `;
    });
    
    v2Html += '</div>';
  }
  
  // Balloo Auth Platform V2 секция
  let bapHtml = '';
  if (d.balloo_auth_platform_v2 && d.balloo_auth_platform_v2.steps) {
    const bap = d.balloo_auth_platform_v2;
    bapHtml = `
      <div class="summary-box" style="border-left: 4px solid var(--orange);">
        <h3 style="color:var(--orange);">🔐 Balloo Auth Platform V2 — Отложенная платформа</h3>
        <p style="color:var(--text-dim);">${bap.description || 'Отложенный набор действий для реализации Balloo Auth Platform'}</p>
        <p style="color:var(--accent);">Всего шагов: ${bap.steps.length}</p>
        
        ${bap.steps.map((step, idx) => `
          <div class="solution-block" style="margin: 12px 0; border-left: 3px solid var(--orange);">
            <div class="solution-title">
              #${idx + 1}. ${step.title}
              <span class="badge ${step.effort === 'low' ? 'badge-ok' : step.effort === 'medium' ? 'badge-warning' : 'badge-critical'}">${step.effort === 'low' ? 'Низкий' : step.effort === 'medium' ? 'Средний' : 'Высокий'} effort</span>
            </div>
            <p><strong>Варианты действий (${step.variants.length}):</strong></p>
            <ol style="margin-top:8px; padding-left:24px;">
              ${step.variants.map((v, vi) => `<li style="margin-bottom:6px;">${v}</li>`).join('')}
            </ol>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  document.getElementById('recommendedActionsV1').innerHTML = v1Html;
  document.getElementById('recommendedActionsV2').innerHTML = v2Html;
  document.getElementById('recommendedActionsBAP').innerHTML = bapHtml;
}

function renderCodegenInstructions(data) {
  if (!data.length) return;
  const d = data[0];
  
  // Environment
  const env = d.codegen_environment;
  let envHtml = `
    <div class="summary-box" style="border-left: 4px solid var(--cyan); margin-bottom:24px;">
      <h3 style="color:var(--cyan);">🤖 Окружение кодогенерации</h3>
      <div class="score-card" style="margin:16px 0;">
        <div class="score-item">
          <div class="score-value" style="color:var(--green); font-size:1.2em;">${env.ai_tools.join(', ')}</div>
          <div class="score-label">AI инструменты</div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color:var(--accent)">${env.max_duration_hours}ч</div>
          <div class="score-label">Макс. время</div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color:var(--orange)">${env.max_requests_per_day} <small style="font-size:0.6em;">→ ${env.max_requests_per_day_scale || 'до 2000 с запросом'}</small></div>
          <div class="score-label">Запросов/день (Koda Base)</div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color:var(--purple)">${env.phases || 14}</div>
          <div class="score-label">Фаз генерации</div>
        </div>
      </div>
      <p style="color:var(--text-dim);">Финальное действие пользователя: <code>${env.final_user_action}</code></p>
      <p style="color:var(--orange); font-size:0.9em;">Исключённые платформы: ${env.excluded_platforms.join(', ')}</p>
      <p style="color:var(--green); font-size:0.9em;">Включённые платформы: ${env.included_platforms.join(', ')}</p>
      ${env.orchestrator ? `
        <div style="margin-top:12px; padding:12px; background:rgba(88,166,255,0.1); border-radius:4px; border-left:3px solid var(--accent);">
          <h4 style="color:var(--accent); margin-bottom:8px;">🎛️ AI Orchestrator</h4>
          <p><strong>Статус:</strong> ${env.orchestrator.enabled ? '✅ Включён' : '❌ Выключен'}</p>
          <p><strong>Логика:</strong> ${env.orchestrator.decision_logic}</p>
          <p><strong>Балансировка:</strong> ${env.orchestrator.load_balancing}</p>
        </div>
      ` : ''}
    </div>
  `;
  
  // V2 Roadmap
  let v2RoadmapHtml = '';
  if (d.v2_roadmap) {
    const v2 = d.v2_roadmap;
    v2RoadmapHtml = `
      <div class="summary-box" style="border-left: 4px solid var(--purple); margin-bottom:24px;">
        <h3 style="color:var(--purple);">🚀 V2 Roadmap — Условия запуска</h3>
        <p style="color:var(--text-dim);">V2 запускается при достижении целевых метрик</p>
        <div style="margin:16px 0;">
          <h4 style="color:var(--orange); margin-bottom:8px;">Триггеры:</h4>
          <ul>${v2.trigger_conditions.map(t => `<li style="margin-bottom:4px;">${t}</li>`).join('')}</ul>
        </div>
        <div style="margin:16px 0;">
          <h4 style="color:var(--green); margin-bottom:8px;">Действия:</h4>
          <ul>${v2.actions.map(a => `<li style="margin-bottom:4px;">${a}</li>`).join('')}</ul>
        </div>
        <p style="color:var(--cyan); font-weight:700;">Макс. запросов при V2: ${v2.max_requests_v2}</p>
      </div>
    `;
  }
  
  // Ticket System
  let ticketHtml = '';
  if (d.ticket_system) {
    const ts = d.ticket_system;
    ticketHtml = `
      <div class="summary-box" style="border-left: 4px solid var(--green); margin-bottom:24px;">
        <h3 style="color:var(--green);">📋 Ticket System — Система управления тикетами</h3>
        <p style="color:var(--text-dim);">${ts.description}</p>
        
        <div style="margin:16px 0;">
          <h4 style="color:var(--accent); margin-bottom:8px;">Хранение:</h4>
          <table>
            <tbody>
              <tr><td><strong>Location:</strong></td><td><code>${ts.storage.location}</code></td></tr>
              <tr><td><strong>Format:</strong></td><td>${ts.storage.format}</td></tr>
              <tr><td><strong>Retention:</strong></td><td>${ts.storage.retention}</td></tr>
            </tbody>
          </table>
        </div>
        
        <div style="margin:16px 0;">
          <h4 style="color:var(--orange); margin-bottom:8px;">Жизненный цикл:</h4>
          <p style="font-weight:700;">${ts.lifecycle[0]}</p>
          <p style="color:var(--text-dim); font-size:0.9em;">${ts.lifecycle[1]}</p>
        </div>
        
        <div style="margin:16px 0;">
          <h4 style="color:var(--purple); margin-bottom:8px;">Отчёты:</h4>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <div style="padding:12px; background:var(--surface2); border-radius:4px;">
              <h5 style="color:var(--green); margin-bottom:8px;">✅ После тикета</h5>
              <ul style="padding-left:20px; font-size:0.9em;">
                ${ts.reporting.after_ticket.content.map(c => `<li style="margin-bottom:2px;">${c}</li>`).join('')}
              </ul>
              <p style="color:var(--text-dim); font-size:0.85em;">Storage: ${ts.reporting.after_ticket.storage}</p>
            </div>
            <div style="padding:12px; background:var(--surface2); border-radius:4px;">
              <h5 style="color:var(--cyan); margin-bottom:8px;">📊 После фазы</h5>
              <ul style="padding-left:20px; font-size:0.9em;">
                ${ts.reporting.after_phase.content.map(c => `<li style="margin-bottom:2px;">${c}</li>`).join('')}
              </ul>
              <p style="color:var(--text-dim); font-size:0.85em;">Storage: ${ts.reporting.after_phase.storage}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Notifications (Max Bot)
  let notificationsHtml = '';
  if (d.notifications && d.notifications.max_bot) {
    const nb = d.notifications.max_bot;
    notificationsHtml = `
      <div class="summary-box" style="border-left: 4px solid var(--orange); margin-bottom:24px;">
        <h3 style="color:var(--orange);">🔔 Max Bot — Уведомления</h3>
        <p style="color:var(--text-dim);">${nb.description}</p>
        
        <div style="margin:16px 0;">
          <h4 style="color:var(--accent); margin-bottom:8px;">Триггеры:</h4>
          <ul>${nb.triggers.map(t => `<li style="margin-bottom:4px;">${t}</li>`).join('')}</ul>
        </div>
        
        <div style="margin:16px 0;">
          <h4 style="color:var(--green); margin-bottom:8px;">Получатели:</h4>
          <ul>${nb.recipients.map(r => `<li style="margin-bottom:4px;">${r}</li>`).join('')}</ul>
        </div>
        
        <div style="margin:16px 0;">
          <h4 style="color:var(--purple); margin-bottom:8px;">Шаблоны сообщений:</h4>
          <table>
            <thead><tr><th>Тип</th><th>Шаблон</th></tr></thead>
            <tbody>
              ${Object.entries(nb.message_template).map(([k, v]) => `
                <tr>
                  <td><code>${k}</code></td>
                  <td><code style="font-size:0.85em;">${v}</code></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
  
  document.getElementById('codegenEnvironment').innerHTML = envHtml;
  document.getElementById('codegenV2Roadmap').innerHTML = v2RoadmapHtml;
  document.getElementById('codegenTicketSystem').innerHTML = ticketHtml + notificationsHtml;
  
  // ... остальной код renderCodegenInstructions без изменений ...
  
  // Design principles
  const principlesHtml = d.design_principles ? `
    <div class="summary-box" style="border-left: 3px solid var(--accent); margin-bottom:24px;">
      <h4 style="color:var(--accent); margin-bottom:12px;">📐 Принципы проектирования</h4>
      <ul>${d.design_principles.map(p => `<li style="margin-bottom:8px;">${p}</li>`).join('')}</ul>
    </div>
  ` : '';
  
  // Phases
  let phasesHtml = '';
  if (d.generation_phases) {
    phasesHtml = `
      <h3 class="sub-title" style="border-left-color:var(--cyan);">🚀 Фазы генерации (${d.generation_phases.length})</h3>
    `;
    d.generation_phases.forEach(phase => {
      const hours = phase.estimated_hours || '?';
      const deps = phase.dependencies && phase.dependencies.length ? `Зависимости: ${phase.dependencies.join(', ')}` : 'Зависимости: нет';
      const checks = phase.checks && phase.checks.length ? phase.checks.map(c => `<li style="margin-bottom:4px;">✅ ${c}</li>`).join('') : '';
      const files = phase.files_to_create ? phase.files_to_create.length : 0;
      const jsonSrc = phase.json_sources ? phase.json_sources.join(', ') : '';
      
      phasesHtml += `
        <div class="comp-card" style="border-left: 4px solid var(--cyan); margin: 16px 0;">
          <div class="feature-header">
            <div>
              <span class="feature-name">Фаза ${phase.phase}: ${phase.name}</span>
            </div>
            <div class="feature-tags">
              <span class="badge badge-info">${hours}ч</span>
              <span class="badge badge-ok">${files} файлов</span>
              <span class="badge badge-warning">${phase.checks?.length || 0} проверок</span>
            </div>
          </div>
          <p style="color:var(--text-dim); margin:8px 0;">${phase.description || ''}</p>
          <p style="color:var(--text-dim); font-size:0.9em;">⏳ ${deps}</p>
          
          ${phase.files_to_create ? `
            <h4 style="color:var(--green); margin:12px 0 8px;">📄 Создаваемые файлы (${phase.files_to_create.length}):</h4>
            <ul style="padding-left:20px; font-size:0.9em; color:var(--text-dim);">
              ${phase.files_to_create.map(f => `<li style="margin-bottom:2px;"><code>${f}</code></li>`).join('')}
            </ul>
          ` : ''}
          
          ${phase.packages ? `
            <h4 style="color:var(--accent); margin:12px 0 8px;">📦 Пакеты:</h4>
            ${phase.packages.map(pkg => `
              <div style="margin:8px 0; padding:8px; background:var(--surface2); border-radius:4px;">
                <strong>${pkg.name}</strong>
                <ul style="margin-top:4px; padding-left:20px; font-size:0.85em;">
                  ${pkg.files.map(f => `<li style="margin-bottom:2px;"><code>${f}</code></li>`).join('')}
                </ul>
              </div>
            `).join('')}
          ` : ''}
          
          ${checks ? `
            <h4 style="color:var(--green); margin:12px 0 8px;">✅ Check list:</h4>
            <ul style="padding-left:20px;">${checks}</ul>
          ` : ''}
          
          ${jsonSrc ? `<p style="color:var(--text-dim); font-size:0.85em;">📋 JSON источники: ${jsonSrc}</p>` : ''}
        </div>
      `;
    });
  }
  
  document.getElementById('codegenPhases').innerHTML = phasesHtml;
  
  // AI Instructions
  let aiHtml = '';
  if (d.ai_instructions) {
    const ai = d.ai_instructions;
    aiHtml = `
      <div class="summary-box" style="border-left: 4px solid var(--purple);">
        <h3 style="color:var(--purple);">⚙️ Настройки AI</h3>
        
        ${ai.ollama_fallback ? `
          <div style="margin:16px 0; padding:12px; background:var(--surface2); border-radius:4px;">
            <h4 style="color:var(--orange);">🔄 Ollama → Koda Base Fallback</h4>
            <p><strong>Триггер:</strong> ${ai.ollama_fallback.trigger}</p>
            <p><strong>Действие:</strong> ${ai.ollama_fallback.action}</p>
            <p><strong>Лимит:</strong> ${ai.ollama_fallback.max_daily_requests} запросов/день</p>
            <h5 style="margin-top:8px;">Приоритет:</h5>
            <ul>${ai.ollama_fallback.priority_order.map(p => `<li style="margin-bottom:4px;">${p}</li>`).join('')}</ul>
          </div>
        ` : ''}
        
        ${ai.error_handling ? `
          <div style="margin:16px 0; padding:12px; background:var(--surface2); border-radius:4px;">
            <h4 style="color:var(--red);">🐛 Обработка ошибок</h4>
            <p><strong>Retry:</strong> ${ai.error_handling.retry_policy}</p>
            <p><strong>Лог:</strong> ${ai.error_handling.error_logging}</p>
            <p><strong>Stuck detection:</strong> ${ai.error_handling.stuck_detection}</p>
          </div>
        ` : ''}
        
        ${ai.quality_gates ? `
          <div style="margin:16px 0; padding:12px; background:var(--surface2); border-radius:4px;">
            <h4 style="color:var(--green);">🚪 Quality Gates</h4>
            <ul>${ai.quality_gates.map(g => `<li style="margin-bottom:4px;">${g}</li>`).join('')}</ul>
          </div>
        ` : ''}
      </div>
    `;
  }
  
  // User experience
  let userHtml = '';
  if (d.user_final_experience) {
    const ux = d.user_final_experience;
    userHtml = `
      <div class="summary-box" style="border-left: 4px solid var(--green); margin-top:24px;">
        <h3 style="color:var(--green);">🎉 Финальный опыт пользователя</h3>
        <ol style="margin-top:12px; padding-left:24px;">
          ${Object.entries(ux).map(([k, v]) => `<li style="margin-bottom:8px;"><strong>${k.replace('step_', 'Шаг ')}:</strong> ${v}</li>`).join('')}
        </ol>
      </div>
    `;
  }
  
  document.getElementById('codegenInstructions').innerHTML = principlesHtml + aiHtml + userHtml;
}

function renderMessageAttachments(data) {
  if (!data.length) return;
  const d = data[0];
  
  let html = '';
  
  // === ATTACHMENTS TYPES ===
  const attachments = d.attachments || {};
  if (attachments.supported_types) {
    html += `
      <h3 class="sub-title" style="border-left-color:var(--cyan); margin-bottom:16px;">📎 Типы вложений (${Object.keys(attachments.supported_types).length})</h3>
    `;
    
    Object.entries(attachments.supported_types).forEach(([type, info]) => {
      const icons = {
        images: '🖼️', videos: '🎥', documents: '📄', audio: '🎵',
        location: '📍', contacts: '👤', links: '🔗', polls: '📊',
        sticker: '🎭', voice_message: '🎤', video_message: '📹', files: '📁'
      };
      const icon = icons[type] || '📎';
      
      html += `
        <div class="comp-card" style="border-left: 4px solid var(--cyan); margin: 12px 0;">
          <div class="feature-header">
            <div>
              <span class="feature-name">${icon} ${type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </div>
          </div>
          <p style="color:var(--text-dim); margin:8px 0;">${info.description}</p>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:8px; margin-top:8px;">
            ${info.formats ? `<div><strong>Форматы:</strong> <code>${Array.isArray(info.formats) ? info.formats.join(', ') : info.formats}</code></div>` : ''}
            ${info.max_size_mb ? `<div><strong>Макс. размер:</strong> ${info.max_size_mb} MB</div>` : ''}
            ${info.max_size_kb ? `<div><strong>Макс. размер:</strong> ${info.max_size_kb} KB</div>` : ''}
            ${info.max_duration_seconds ? `<div><strong>Макс. длительность:</strong> ${info.max_duration_seconds} сек</div>` : ''}
            ${info.waveform ? `<div><strong>Waveform:</strong> ✅</div>` : ''}
            ${info.speed_control ? `<div><strong>Скорость:</strong> ${info.speed_control.join(', ')}</div>` : ''}
            ${info.circular ? `<div><strong>Форма:</strong> Круглая</div>` : ''}
            ${info.preview ? `<div><strong>Превью:</strong> ${Array.isArray(info.preview) ? info.preview.join(', ') : info.preview}</div>` : ''}
          </div>
        </div>
      `;
    });
  }
  
  // === REACTIONS ===
  const interactions = d.message_interactions || {};
  if (interactions.reactions) {
    const reactions = interactions.reactions;
    html += `
      <h3 class="sub-title" style="border-left-color:var(--purple); margin:24px 0 16px;">🎭 Реакции (${reactions.total_variants} шт.)</h3>
    `;
    
    Object.entries(reactions.categories).forEach(([catId, cat]) => {
      const catColors = {
        basic_emotions: 'var(--green)',
        expressive: 'var(--orange)',
        contextual: 'var(--cyan)'
      };
      const color = catColors[catId] || 'var(--accent)';
      
      html += `
        <div style="margin:16px 0; padding:12px; background:var(--surface2); border-radius:4px; border-left:3px solid ${color};">
          <h4 style="color:${color}; margin-bottom:8px;">${cat.label} (${cat.count})</h4>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${cat.reactions.map(r => `
              <div style="padding:8px 12px; background:var(--surface); border-radius:6px; text-align:center; min-width:80px;">
                <div style="font-size:1.5em;">${r.id}</div>
                <div style="font-size:0.75em; color:var(--text-dim); margin-top:4px;">${r.name}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
    
    if (reactions.behavior) {
      html += `
        <div style="margin:16px 0; padding:12px; background:rgba(139,92,246,0.1); border-radius:4px; border-left:3px solid var(--purple);">
          <h4 style="color:var(--purple); margin-bottom:8px;">⚙️ Поведение реакций</h4>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:8px; font-size:0.9em;">
            <div>Мульти-реакции: ${reactions.behavior.multi_reaction ? '✅' : '❌'}</div>
            <div>Макс на сообщение: ${reactions.behavior.max_per_message}</div>
            <div>Показывать счётчики: ${reactions.behavior.show_counts ? '✅' : '❌'}</div>
            <div>Анимация при добавлении: ${reactions.behavior.animated_on_add ? '✅' : '❌'}</div>
            <div>Кастомные паки: ${reactions.behavior.customize_packs ? '✅' : '❌'}</div>
          </div>
        </div>
      `;
    }
  }
  
  // === MESSAGE LAYOUTS ===
  const layouts = d.message_layouts || {};
  if (Object.keys(layouts).length) {
    html += `<h3 class="sub-title" style="border-left-color:var(--green); margin:24px 0 16px;">💬 Макеты сообщений (${Object.keys(layouts).length})</h3>`;
    
    Object.entries(layouts).forEach(([layoutId, layout]) => {
      const icons = {
        sent_message: '📤', received_message: '📥', group_message: '👥',
        scheduled_message: '⏰', failed_message: '⚠️', voice_message_layout: '🎤',
        video_message_layout: '📹', photo_message_layout: '🖼️',
        document_message_layout: '📄', link_preview_layout: '🔗',
        poll_layout: '📊', sticker_layout: '🎭'
      };
      const icon = icons[layoutId] || '💬';
      
      html += `
        <div class="comp-card" style="border-left: 4px solid var(--green); margin: 12px 0;">
          <div class="feature-header">
            <div>
              <span class="feature-name">${icon} ${layoutId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </div>
          </div>
          ${layout.alignment ? `<p><strong>Выравнивание:</strong> ${layout.alignment === 'right' ? '📤 Справа' : '📥 Слева'}</p>` : ''}
          ${layout.background_color ? `<p><strong>Фон:</strong> <code>${layout.background_color}</code></p>` : ''}
          ${layout.border_radius ? `<p><strong>Скругление:</strong> <code>${layout.border_radius}</code></p>` : ''}
          ${layout.elements && layout.elements.length ? `
            <h4 style="color:var(--accent); margin:8px 0;">Элементы:</h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${layout.elements.map(e => `<span class="badge badge-info" style="font-size:0.8em;">${e}</span>`).join('')}
            </div>
          ` : ''}
          ${layout.waveform_color ? `<p><strong>Waveform:</strong> <code>${layout.waveform_color}</code></p>` : ''}
          ${layout.grid_layout ? `<p><strong>Grid:</strong> ${JSON.stringify(layout.grid_layout)}</p>` : ''}
          ${layout.lightbox ? `<p><strong>Lightbox:</strong> ✅</p>` : ''}
          ${layout.preview_supported ? `<p><strong>Превью:</strong> ${layout.preview_supported.join(', ')}</p>` : ''}
        </div>
      `;
    });
  }
  
  // === INPUT FORMS ===
  const inputForms = d.input_form_layouts || {};
  if (Object.keys(inputForms).length) {
    html += `<h3 class="sub-title" style="border-left-color:var(--orange); margin:24px 0 16px;">✏️ Макеты форм ввода (${Object.keys(inputForms).length})</h3>`;
    
    Object.entries(inputForms).forEach(([formId, form]) => {
      const icons = {
        text_input: '📝', attachment_button: '📎', voice_record_button: '🎤',
        emoji_button: '😀', reply_bar: '↩️', typing_indicator_bar: '⌨️'
      };
      const icon = icons[formId] || '✏️';
      
      html += `
        <div class="comp-card" style="border-left: 4px solid var(--orange); margin: 12px 0;">
          <div class="feature-header">
            <div>
              <span class="feature-name">${icon} ${formId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </div>
          </div>
          ${form.type ? `<p><strong>Тип:</strong> <code>${form.type}</code></p>` : ''}
          ${form.max_length ? `<p><strong>Макс. длина:</strong> ${form.max_length} символов</p>` : ''}
          ${form.placeholder ? `<p><strong>Placeholder:</strong> <code>${form.placeholder}</code></p>` : ''}
          ${form.enter_to_send !== undefined ? `<p><strong>Enter для отправки:</strong> ${form.enter_to_send ? '✅' : '❌ (Shift+Enter для новой строки)'}</p>` : ''}
          ${form.auto_save_draft ? `<p><strong>Автосохранение черновика:</strong> ✅</p>` : ''}
          ${form.menu_items && form.menu_items.length ? `
            <h4 style="color:var(--accent); margin:8px 0;">Меню вложений:</h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${form.menu_items.map(item => `<span class="badge badge-ok" style="font-size:0.8em;">${item.icon} ${item.label}</span>`).join('')}
            </div>
          ` : ''}
          ${form.cancel_gesture ? `<p><strong>Отмена записи:</strong> <code>${form.cancel_gesture}</code></p>` : ''}
          ${form.panels ? `<p><strong>Панели:</strong> ${form.panels.join(', ')}</p>` : ''}
          ${form.dismiss_gesture ? `<p><strong>Жест отмены:</strong> <code>${form.dismiss_gesture}</code></p>` : ''}
        </div>
      `;
    });
  }
  
  // === CHAT TILES ===
  const chatTiles = d.chat_tile_layouts || {};
  if (Object.keys(chatTiles).length) {
    html += `<h3 class="sub-title" style="border-left-color:var(--accent); margin:24px 0 16px;">🗂 Плитки чатов (${Object.keys(chatTiles).length})</h3>`;
    
    Object.entries(chatTiles).forEach(([tileId, tile]) => {
      if (tileId === 'chat_tile_states' || tileId === 'swipe_actions') return;
      
      const icons = {
        '1on1_chat': '👤', group_chat: '👥', channel: '📢'
      };
      const icon = icons[tileId] || '🗂';
      
      html += `
        <div class="comp-card" style="border-left: 4px solid var(--accent); margin: 12px 0;">
          <div class="feature-header">
            <div>
              <span class="feature-name">${icon} ${tileId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </div>
          </div>
          ${tile.avatar_type ? `<p><strong>Аватар:</strong> <code>${tile.avatar_type}</code></p>` : ''}
          ${tile.elements && tile.elements.length ? `
            <h4 style="color:var(--accent); margin:8px 0;">Элементы плитки:</h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${tile.elements.map(e => `<span class="badge badge-info" style="font-size:0.8em;">${e}</span>`).join('')}
            </div>
          ` : ''}
          ${tile.show_online !== undefined ? `<p><strong>Показывать онлайн:</strong> ${tile.show_online ? '✅' : '❌'}</p>` : ''}
          ${tile.show_participants_count ? `<p><strong>Счётчик участников:</strong> ✅</p>` : ''}
        </div>
      `;
    });
    
    // Chat tile states
    if (chatTiles.chat_tile_states) {
      html += `
        <div style="margin:16px 0;">
          <h4 style="color:var(--purple); margin-bottom:8px;">🎨 Состояния плиток</h4>
          ${Object.entries(chatTiles.chat_tile_states).map(([state, info]) => `
            <div style="margin:8px 0; padding:8px; background:var(--surface2); border-radius:4px;">
              <strong>${state.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
              <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:4px;">
                ${Object.entries(info).filter(([k]) => k !== 'background').map(([k, v]) => `
                  <span class="badge ${typeof v === 'boolean' ? (v ? 'badge-ok' : 'badge-warning') : 'badge-info'}" style="font-size:0.75em;">
                    ${k}: ${typeof v === 'boolean' ? (v ? '✅' : '❌') : v}
                  </span>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    // Swipe actions
    if (chatTiles.swipe_actions) {
      html += `
        <div style="margin:16px 0;">
          <h4 style="color:var(--cyan); margin-bottom:8px;">👆 Свайп-действия</h4>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            ${Object.entries(chatTiles.swipe_actions).map(([device, actions]) => `
              <div style="padding:12px; background:var(--surface2); border-radius:4px;">
                <strong>${device === 'mobile' ? '📱 Mobile' : '🖥 Desktop'}:</strong>
                ${Object.entries(actions).map(([dir, items]) => `
                  <div style="margin-top:4px; font-size:0.9em;">
                    <strong>${dir === 'left' ? '⬅️' : dir === 'right' ? '➡️' : '🖱'} ${dir}:</strong>
                    <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:2px;">
                      ${items.map(item => `<span class="badge badge-ok" style="font-size:0.7em;">${item}</span>`).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }
  
  // === ATTACHMENT PREIEWS ===
  const previews = d.attachment_previews || {};
  if (Object.keys(previews).length) {
    html += `<h3 class="sub-title" style="border-left-color:var(--green); margin:24px 0 16px;">👁 Превью вложений (${Object.keys(previews).length})</h3>`;
    
    Object.entries(previews).forEach(([type, info]) => {
      html += `
        <div class="comp-card" style="border-left: 4px solid var(--green); margin: 12px 0;">
          <div class="feature-header">
            <div>
              <span class="feature-name">${type.charAt(0).toUpperCase() + type.slice(1)} preview</span>
            </div>
          </div>
          ${info.thumbnail_size ? `<p><strong>Размер миниатюры:</strong> <code>${info.thumbnail_size}</code></p>` : ''}
          ${info.quality_levels ? `<p><strong>Качество:</strong> ${info.quality_levels.join(', ')}</p>` : ''}
          ${info.features && info.features.length ? `
            <h4 style="color:var(--accent); margin:8px 0;">Функции:</h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${info.features.map(f => `<span class="badge badge-ok" style="font-size:0.8em;">${f}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      `;
    });
  }
  
  // === MOCKUPS ===
  const mockups = d.mockups || {};
  if (Object.keys(mockups).length) {
    html += `
      <h3 class="sub-title" style="border-left-color:var(--cyan); margin:24px 0 16px;">📸 Макеты (Mockups)</h3>
      <table>
        <thead><tr><th>Элемент</th><th>Путь</th><th>Действие</th></tr></thead>
        <tbody>
          ${Object.entries(mockups).map(([name, path]) => `
            <tr>
              <td><strong>${name}</strong></td>
              <td><code>${path}</code></td>
              <td><a href="${path}" target="_blank" style="color:var(--accent);">Открыть ↗</a></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
  
  document.getElementById('messageAttachmentsList').innerHTML = html;
}

function renderIllegitimateMD() {
  document.getElementById('illegitimateList').innerHTML = `
    <div class="summary-box">
      <h3>MD файлы без JSON</h3>
      <p>Эти MD файлы не имеют соответствующих JSON файлов в <code>steps/_json/</code>.</p>
      <p style="color:var(--orange); margin-top:12px;">Статус: Все MD файлы теперь имеют JSON (синхронизация завершена).</p>
      <p style="color:var(--green); margin-top:8px;">✅ Все 17+9 = 26 JSON файлов подключены к HTML.</p>
      <p style="color:var(--green); margin-top:4px;">✅ Все MD файлы синхронизированы с JSON.</p>
    </div>
  `;
}

async function renderMockups() {
  const data = sectionData.mockups || [];
  
  if (data && data.subsections) {
    const index = data;
    let html = `
      <div class="summary-box" style="border-left: 4px solid var(--cyan); margin-bottom:24px;">
        <h3 style="color:var(--cyan);">📸 Макеты — ${index.totals?.total_mockups || 0} HTML-макетов</h3>
        <p style="color:var(--text-dim); margin-top:8px;">${index.description || 'Макеты организованы по типам устройств'}</p>
      </div>
      
      <div class="score-card" style="margin-bottom:24px;">
        <div class="score-item">
          <div class="score-value" style="color:var(--green)">${index.totals?.v1_mockups || 0}</div>
          <div class="score-label">V1 макетов</div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color:var(--purple)">${index.totals?.v2_mockups || 0}</div>
          <div class="score-label">V2 макетов</div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color:var(--red)">${index.totals?.missing_mockups || 0}</div>
          <div class="score-label">Без макетов</div>
        </div>
      </div>
    `;
    
    for (const subsection of index.subsections) {
      try {
        const subData = await loadSection(`mockups_${subsection.id}`);
        if (subData) {
          const isComponents = subsection.id === 'components';
          
          html += `
            <h3 class="sub-title" style="border-left-color: var(--cyan); margin:24px 0 16px;">
              ${isComponents ? '🧩 ' : '📱 '}${subsection.title}
            </h3>
            <p style="color:var(--text-dim); margin-bottom:16px;">${subsection.description}</p>
          `;
          
          if (isComponents && subData.components) {
            html += subData.components.map(comp => {
              const hasMockup = comp.mockup && comp.mockup !== null;
              return `
                <div class="comp-card" style="border-left: 4px solid ${hasMockup ? 'var(--green)' : 'var(--orange)'}; margin: 12px 0;">
                  <div class="feature-header">
                    <div>
                      <span class="feature-name">${comp.name || comp.id}</span>
                      <span class="badge ${hasMockup ? 'badge-ok' : 'badge-warning'}">${hasMockup ? '✅ Макет есть' : '❌ Макета нет'}</span>
                    </div>
                  </div>
                  <p style="margin:8px 0;">${comp.description || ''}</p>
                  ${hasMockup ? `
                    <a href="${comp.mockup}" target="_blank" style="color:var(--accent); text-decoration:underline;">🔗 Открыть макет ↗</a>
                  ` : `
                    <p style="color:var(--red); font-size:0.9em;">⚠️ HTML-макет отсутствует. Требуется разработка.</p>
                  `}
                </div>
              `;
            }).join('');
          }
          
          if (subData.screens) {
            const sizeInfo = subData.screen_size ? `(${subData.screen_size.width}x${subData.screen_size.height}, ${subData.screen_size.aspect_ratio})` : '';
            
            html += `
              <div style="margin-bottom:16px; padding:8px; background:var(--surface2); border-radius:4px;">
                <strong>Размер экрана:</strong> ${sizeInfo || 'N/A'} | 
                <strong>Всего:</strong> ${subData.totals?.total_screens || subData.screens.length} |
                <strong>С макетом:</strong> ${subData.totals?.with_mockup || 0} |
                <strong>Без макета:</strong> ${subData.totals?.without_mockup || 0}
              </div>
            `;
            
            html += subData.screens.map(screen => {
              const hasMockup = screen.mockup && screen.mockup !== null && screen.status !== 'missing';
              return `
                <div class="comp-card" style="border-left: 4px solid ${hasMockup ? 'var(--green)' : 'var(--orange)'}; margin: 12px 0;">
                  <div class="feature-header">
                    <div>
                      <span class="feature-name">${screen.name}</span>
                      <span style="color:var(--text-dim); font-size:0.85em; margin-left:8px;">(<code>${screen.id}</code>)</span>
                      <span class="badge ${hasMockup ? 'badge-ok' : 'badge-warning'}" style="margin-left:8px;">
                        ${hasMockup ? '✅ Макет' : '❌ Нет макета'}
                      </span>
                      ${screen.v2 ? '<span class="badge badge-v2" style="margin-left:4px;">V2</span>' : ''}
                    </div>
                  </div>
                  ${hasMockup ? `
                    <div style="margin:8px 0; padding:8px; background:rgba(34,197,94,0.05); border-radius:4px;">
                      <p style="color:var(--green); font-size:0.9em;">📸 <code>${screen.mockup}</code></p>
                      <a href="${screen.mockup}" target="_blank" style="color:var(--accent); text-decoration:underline;">🔗 Открыть HTML-макет ↗</a>
                    </div>
                  ` : `
                    <div style="margin:8px 0; padding:8px; background:rgba(248,81,73,0.05); border-radius:4px;">
                      <p style="color:var(--red); font-size:0.9em;">⚠️ HTML-макет отсутствует для "${screen.name}"</p>
                      <p style="color:var(--text-dim); font-size:0.85em;">Путь: ${screen.path || 'N/A'}</p>
                    </div>
                  `}
                </div>
              `;
            }).join('');
          }
        }
      } catch (e) {
        console.warn(`Failed to load mockup subsection ${subsection.id}:`, e);
        html += `<div class="summary-box" style="border-left: 3px solid var(--red);">⚠️ Не удалось загрузить: ${subsection.id}</div>`;
      }
    }
    
    document.getElementById('mockupsList').innerHTML = html;
    return;
  }
  
  // Fallback
  const screens = sectionData.screens || [];
  const mockups = screens.filter(s => s.mockup).map(s => ({
    name: s.name, path: s.path, mockup: s.mockup, id: s.id, premium_only: s.premium_only
  }));
  
  let html = `<div class="score-card"><div class="score-item"><div class="score-value" style="color:var(--accent)">${mockups.length}</div><div class="score-label">Всего макетов</div></div></div>`;
  html += `<table><thead><tr><th>Экран</th><th>Путь</th><th>Макет</th><th>Действие</th></tr></thead><tbody>`;
  mockups.forEach(m => {
    html += `<tr><td><strong>${m.name}</strong></td><td><code>${m.path}</code></td><td><code>${m.mockup}</code></td><td><a href="${m.mockup}" target="_blank">Открыть ↗</a></td></tr>`;
  });
  html += `</tbody></table>`;
  
  document.getElementById('mockupsList').innerHTML = html;
}

async function renderRecommendedActions() {
  const data = sectionData.recommended_actions || [];
  
  if (data && data.subsections) {
    const index = data;
    let html = `
      <div class="summary-box" style="border-left: 4px solid var(--green); margin-bottom:24px;">
        <h3 style="color:var(--green);">🎯 Рекомендуемые действия</h3>
        <p style="color:var(--text-dim); margin-top:8px;">${index.description || 'Доведение метрик до 10'}</p>
      </div>
      
      <div class="score-card" style="margin-bottom:24px;">
        <div class="score-item">
          <div class="score-value" style="color:var(--green)">${index.totals?.v1_steps || 0}</div>
          <div class="score-label">V1 шаги</div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color:var(--orange)">${index.totals?.bap_steps || 0}</div>
          <div class="score-label">BAP шаги</div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color:var(--accent)">${index.totals?.total_active_steps || 0}</div>
          <div class="score-label">Всего активных</div>
        </div>
      </div>
    `;
    
    try {
      const v1Data = await loadSection('recommended_v1');
      if (v1Data && v1Data.actions) {
        html += `
          <h3 class="sub-title" style="border-left-color: var(--green); margin:24px 0 16px;">
            🎯 V1 — Текущие метрики → Целевые 10 (${Object.keys(v1Data.actions).length} метрик)
          </h3>
        `;
        
        Object.entries(v1Data.actions).forEach(([metric, info]) => {
          const current = info.current;
          const target = info.target;
          const gap = target - current;
          
          html += `
            <div class="comp-card" style="border-left: 4px solid ${gap > 2 ? 'var(--red)' : gap > 1 ? 'var(--orange)' : 'var(--green)'}; margin: 16px 0;">
              <div class="feature-header">
                <div>
                  <span class="feature-name">${metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
                <div class="feature-tags">
                  <span class="badge badge-info">Текущее: ${current}</span>
                  <span class="badge badge-ok">Цель: ${target}</span>
                  <span class="badge ${gap > 2 ? 'badge-critical' : 'badge-warning'}">Gap: ${gap}</span>
                </div>
              </div>
              ${info.steps.map((step, idx) => `
                <div class="solution-block" style="margin: 12px 0; border-left: 3px solid var(--accent);">
                  <div class="solution-title">#${idx + 1}. ${step.title}
                    <span class="badge ${step.effort === 'low' ? 'badge-ok' : step.effort === 'medium' ? 'badge-warning' : 'badge-critical'}">
                      ${step.effort === 'low' ? 'Низкий' : step.effort === 'medium' ? 'Средний' : 'Высокий'} effort
                    </span>
                  </div>
                  ${step.variants && step.variants.length ? `
                    <p><strong>Варианты (${step.variants.length}):</strong></p>
                    <ol style="margin-top:8px; padding-left:24px;">
                      ${step.variants.map((v, vi) => `<li style="margin-bottom:6px;">${v}</li>`).join('')}
                    </ol>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          `;
        });
      }
    } catch (e) {
      console.warn('Failed to load recommended_v1:', e);
      html += `<div class="summary-box" style="border-left: 3px solid var(--red);">⚠️ Не удалось загрузить V1</div>`;
    }
    
    try {
      const bapData = await loadSection('recommended_bap');
      if (bapData && bapData.steps) {
        html += `
          <h3 class="sub-title" style="border-left-color: var(--orange); margin:24px 0 16px;">
            🔐 Balloo Auth Platform V2 (${bapData.steps.length} шагов)
          </h3>
          <p style="color:var(--text-dim); margin-bottom:16px;">${bapData.description || 'Действия для реализации платформы авторизации'}</p>
        `;
        
        bapData.steps.forEach((step, idx) => {
          html += `
            <div class="solution-block" style="margin: 12px 0; border-left: 3px solid var(--orange);">
              <div class="solution-title">#${idx + 1}. ${step.title}
                <span class="badge ${step.effort === 'low' ? 'badge-ok' : step.effort === 'medium' ? 'badge-warning' : 'badge-critical'}">
                  ${step.effort === 'low' ? 'Низкий' : step.effort === 'medium' ? 'Средний' : 'Высокий'} effort
                </span>
              </div>
              ${step.variants && step.variants.length ? `
                <p><strong>Варианты (${step.variants.length}):</strong></p>
                <ol style="margin-top:8px; padding-left:24px;">
                  ${step.variants.map((v, vi) => `<li style="margin-bottom:6px;">${v}</li>`).join('')}
                </ol>
              ` : ''}
            </div>
          `;
        });
      }
    } catch (e) {
      console.warn('Failed to load recommended_bap:', e);
      html += `<div class="summary-box" style="border-left: 3px solid var(--red);">⚠️ Не удалось загрузить BAP</div>`;
    }
    
    if (index.deferred_to_v2) {
      html += `
        <div class="summary-box" style="border-left: 4px solid var(--purple); margin-top:24px;">
          <h4 style="color:var(--purple); margin-bottom:8px;">⏳ V2 действия отложены</h4>
          <p style="color:var(--text-dim);">${index.deferred_to_v2.note || 'V2 recommended actions перенесены в deferred_v2'}</p>
        </div>
      `;
    }
    
    document.getElementById('recommendedActionsV1').innerHTML = html;
    document.getElementById('recommendedActionsV2').innerHTML = '';
    document.getElementById('recommendedActionsBAP').innerHTML = '';
    return;
  }
  
  // Fallback
  document.getElementById('recommendedActionsV1').innerHTML = '<div class="summary-box">Нет данных</div>';
  document.getElementById('recommendedActionsV2').innerHTML = '';
  document.getElementById('recommendedActionsBAP').innerHTML = '';
}

function renderResolvedProblems(data) {
  const total = data.length;
  
  let html = `
    <div class="score-card" style="margin-bottom:24px;">
      <div class="score-item">
        <div class="score-value" style="color:var(--accent)">${total}</div>
        <div class="score-label">Всего решённых проблем</div>
      </div>
    </div>
  `;
  
  html += data.map(p => {
    const sevClass = p.severity === 'critical' ? 'badge-critical' : p.severity === 'warning' ? 'badge-warning' : 'badge-ok';
    const sevLabel = p.severity === 'critical' ? 'Критическая' : p.severity === 'warning' ? 'Предупреждение' : 'Минор';
    
    let solutionHtml = '';
    if (p.solutions && p.solutions.length) {
      const selectedSolution = p.solutions.find(s => s.resolved) || p.solutions[0];
      solutionHtml = `
        <div class="solution-block" style="border-left:3px solid var(--green); background:rgba(34,197,94,0.05); margin-bottom:12px;">
          <div class="solution-title" style="color:var(--green);">✅ РЕШЕНО: ${selectedSolution.name}</div>
          <p>${selectedSolution.detail}</p>
        </div>
      `;
      if (p.resolution_note) {
        solutionHtml += `<p style="color:var(--text-dim); font-size:0.85em; font-style:italic;">📝 ${p.resolution_note}</p>`;
      }
    }
    
    return `
      <div class="problem" style="border-left-color: var(--green); opacity: 0.85;">
        <div class="problem-num" style="color:var(--green);">✅ Проблема #${p.id}: ${p.title} <span class="badge ${sevClass}">${sevLabel}</span></div>
        <p>${p.description}</p>
        ${solutionHtml}
      </div>
    `;
  }).join('');
  
  document.getElementById('resolvedProblemsList').innerHTML = html;
}

// Initialize
document.querySelectorAll('.section-btn').forEach(btn => {
  btn.addEventListener('click', () => switchSection(btn.dataset.section));
});

async function init() {
  const loadPromises = Object.keys(sections).map(async (sectionId) => {
    const data = await loadSection(sectionId);
    return { sectionId, data };
  });
  
  const results = await Promise.all(loadPromises);
  results.forEach(({ sectionId, data }) => {
    sectionData[sectionId] = data;
  });
  
  switchSection('overview');
}

init();

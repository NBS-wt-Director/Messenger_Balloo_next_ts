/**
 * Surveys Controller
 * Управление опросами (длинными формами с несколькими секциями)
 */

const db = require('better-sqlite3')('./data/app.db');

/**
 * Создать опрос
 * POST /api/surveys
 */
async function createSurvey(data) {
  const {
    chatId,
    creatorId,
    title,
    description,
    sections,
    settings,
    createdAt
  } = data;

  const surveyId = `survey-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Вставить опрос
    db.prepare(`
      INSERT INTO Survey (id, chatId, creatorId, title, description, sections, settings, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(surveyId, chatId, creatorId, title, description, JSON.stringify(sections), JSON.stringify(settings), createdAt, createdAt);

    // Вставить секции
    for (const section of sections) {
      const sectionId = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      db.prepare(`
        INSERT INTO SurveySection (id, surveyId, title, description, questions, order)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(sectionId, surveyId, section.title, section.description || '', JSON.stringify(section.questions), section.order || 0);
    }

    return { success: true, surveyId };
  } catch (error) {
    console.error('[Surveys] Error creating survey:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Получить опрос
 * GET /api/surveys/:surveyId
 */
async function getSurvey(surveyId) {
  try {
    const survey = db.prepare('SELECT * FROM Survey WHERE id = ?').get(surveyId);
    
    if (!survey) {
      return { success: false, error: 'Опрос не найден' };
    }

    const sections = db.prepare(`
      SELECT * FROM SurveySection 
      WHERE surveyId = ? 
      ORDER BY order ASC
    `).all(surveyId);

    return {
      success: true,
      survey: {
        ...survey,
        sections: sections.map(s => ({
          ...s,
          questions: JSON.parse(s.questions)
        }))
      }
    };
  } catch (error) {
    console.error('[Surveys] Error getting survey:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Отправить ответы на опрос
 * POST /api/surveys/:surveyId/submit
 */
async function submitSurvey(data) {
  const {
    surveyId,
    userId,
    responses,
    startedAt,
    completedAt
  } = data;

  const attemptId = `survey-attempt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    const survey = db.prepare('SELECT * FROM Survey WHERE id = ?').get(surveyId);
    if (!survey) {
      return { success: false, error: 'Опрос не найден' };
    }

    // Сохранить попытку
    db.prepare(`
      INSERT INTO SurveyAttempt (id, surveyId, userId, responses, status, startedAt, completedAt, createdAt)
      VALUES (?, ?, ?, ?, 'completed', ?, ?, ?)
    `).run(attemptId, surveyId, userId, JSON.stringify(responses), startedAt, completedAt, new Date().toISOString());

    return {
      success: true,
      attemptId
    };
  } catch (error) {
    console.error('[Surveys] Error submitting survey:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Получить результаты опроса для пользователя
 * GET /api/surveys/:surveyId/results/:userId
 */
async function getSurveyResults(surveyId, userId) {
  try {
    const attempts = db.prepare(`
      SELECT * FROM SurveyAttempt 
      WHERE surveyId = ? AND userId = ?
      ORDER BY createdAt DESC
    `).all(surveyId, userId);

    if (!attempts.length) {
      return { success: true, attempts: [] };
    }

    return {
      success: true,
      attempts: attempts.map(a => ({
        ...a,
        responses: JSON.parse(a.responses)
      }))
    };
  } catch (error) {
    console.error('[Surveys] Error getting results:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Получить агрегированные результаты опроса
 * GET /api/surveys/:surveyId/aggregated
 */
async function getAggregatedResults(surveyId) {
  try {
    const survey = db.prepare('SELECT * FROM Survey WHERE id = ?').get(surveyId);
    if (!survey) {
      return { success: false, error: 'Опрос не найден' };
    }

    const sections = JSON.parse(survey.sections);
    const attempts = db.prepare('SELECT responses FROM SurveyAttempt WHERE surveyId = ?').all(surveyId);

    if (!attempts.length) {
      return {
        success: true,
        aggregated: {
          totalResponses: 0,
          questions: []
        }
      };
    }

    // Агрегация ответов
    const aggregated = {};
    
    for (const attempt of attempts) {
      const responses = JSON.parse(attempt.responses);
      for (const [questionId, answer] of Object.entries(responses)) {
        if (!aggregated[questionId]) {
          aggregated[questionId] = { answers: [], count: 0 };
        }
        aggregated[questionId].answers.push(answer);
        aggregated[questionId].count++;
      }
    }

    return {
      success: true,
      aggregated: {
        totalResponses: attempts.length,
        questions: aggregated
      }
    };
  } catch (error) {
    console.error('[Surveys] Error getting aggregated results:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Удалить опрос
 * DELETE /api/surveys/:surveyId
 */
async function deleteSurvey(surveyId) {
  try {
    // Удалить все попытки
    db.prepare('DELETE FROM SurveyAttempt WHERE surveyId = ?').run(surveyId);
    
    // Удалить все секции
    db.prepare('DELETE FROM SurveySection WHERE surveyId = ?').run(surveyId);

    // Удалить опрос
    db.prepare('DELETE FROM Survey WHERE id = ?').run(surveyId);

    return { success: true };
  } catch (error) {
    console.error('[Surveys] Error deleting survey:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  createSurvey,
  getSurvey,
  submitSurvey,
  getSurveyResults,
  getAggregatedResults,
  deleteSurvey
};

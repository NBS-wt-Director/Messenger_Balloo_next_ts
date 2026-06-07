/**
 * Quizzes Controller
 * Управление тестами и викторинами
 */

const db = require('better-sqlite3')('./data/app.db');

/**
 * Создать тест
 * POST /api/quizzes
 */
async function createQuiz(data) {
  const {
    chatId,
    creatorId,
    title,
    description,
    questions,
    settings,
    createdAt
  } = data;

  const quizId = `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Вставить тест
    db.prepare(`
      INSERT INTO Quiz (id, chatId, creatorId, title, description, questions, settings, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(quizId, chatId, creatorId, title, description, JSON.stringify(questions), JSON.stringify(settings), createdAt, createdAt);

    // Вставить вопросы
    for (const question of questions) {
      const questionId = `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      db.prepare(`
        INSERT INTO QuizQuestion (id, quizId, question, options, correctAnswers, type, order, points)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(questionId, quizId, question.text, JSON.stringify(question.options), JSON.stringify(question.correctAnswers || []), question.type || 'multiple', question.order || 0, question.points || 1);
    }

    return { success: true, quizId };
  } catch (error) {
    console.error('[Quizzes] Error creating quiz:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Получить тест
 * GET /api/quizzes/:quizId
 */
async function getQuiz(quizId) {
  try {
    const quiz = db.prepare('SELECT * FROM Quiz WHERE id = ?').get(quizId);
    
    if (!quiz) {
      return { success: false, error: 'Тест не найден' };
    }

    const questions = db.prepare(`
      SELECT * FROM QuizQuestion 
      WHERE quizId = ? 
      ORDER BY order ASC
    `).all(quizId);

    return {
      success: true,
      quiz: {
        ...quiz,
        questions: questions.map(q => ({
          ...q,
          options: JSON.parse(q.options),
          correctAnswers: JSON.parse(q.correctAnswers)
        }))
      }
    };
  } catch (error) {
    console.error('[Quizzes] Error getting quiz:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Отправить ответы на тест
 * POST /api/quizzes/:quizId/submit
 */
async function submitQuiz(data) {
  const {
    quizId,
    userId,
    answers,
    startedAt,
    completedAt
  } = data;

  const attemptId = `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    const quiz = db.prepare('SELECT * FROM Quiz WHERE id = ?').get(quizId);
    if (!quiz) {
      return { success: false, error: 'Тест не найден' };
    }

    const quizSettings = JSON.parse(quiz.settings);
    const quizQuestions = db.prepare('SELECT * FROM QuizQuestion WHERE quizId = ?').all(quizId);

    // Подсчёт баллов
    let correctAnswers = 0;
    let totalPoints = 0;

    for (const answer of answers) {
      const question = quizQuestions.find(q => q.id === answer.questionId);
      if (!question) continue;

      const correctAnswersList = JSON.parse(question.correctAnswers);
      const userAnswers = answer.selectedAnswers;

      // Проверка правильности
      let isCorrect = false;
      if (question.type === 'single') {
        isCorrect = userAnswers.length === 1 && correctAnswersList.includes(userAnswers[0]);
      } else if (question.type === 'multiple') {
        isCorrect = userAnswers.length === correctAnswersList.length && 
                    userAnswers.every(ans => correctAnswersList.includes(ans));
      }

      if (isCorrect) {
        correctAnswers++;
        totalPoints += question.points;
      }
    }

    const maxPoints = quizQuestions.reduce((sum, q) => sum + (q.points || 1), 0);
    const score = Math.round((correctAnswers / quizQuestions.length) * 100);

    // Сохранить попытку
    db.prepare(`
      INSERT INTO QuizAttempt (id, quizId, userId, answers, score, correctAnswers, totalQuestions, maxPoints, pointsEarned, status, startedAt, completedAt, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?, ?)
    `).run(attemptId, quizId, userId, JSON.stringify(answers), score, correctAnswers, quizQuestions.length, maxPoints, totalPoints, startedAt, completedAt, new Date().toISOString());

    return {
      success: true,
      attempt: {
        id: attemptId,
        score,
        correctAnswers,
        totalQuestions: quizQuestions.length,
        percentage: Math.round((correctAnswers / quizQuestions.length) * 100)
      }
    };
  } catch (error) {
    console.error('[Quizzes] Error submitting quiz:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Получить результаты теста для пользователя
 * GET /api/quizzes/:quizId/results/:userId
 */
async function getQuizResults(quizId, userId) {
  try {
    const attempts = db.prepare(`
      SELECT * FROM QuizAttempt 
      WHERE quizId = ? AND userId = ?
      ORDER BY createdAt DESC
    `).all(quizId, userId);

    if (!attempts.length) {
      return { success: true, attempts: [] };
    }

    return {
      success: true,
      attempts: attempts.map(a => ({
        ...a,
        answers: JSON.parse(a.answers)
      }))
    };
  } catch (error) {
    console.error('[Quizzes] Error getting results:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Получить статистику теста
 * GET /api/quizzes/:quizId/stats
 */
async function getQuizStats(quizId) {
  try {
    const quiz = db.prepare('SELECT * FROM Quiz WHERE id = ?').get(quizId);
    if (!quiz) {
      return { success: false, error: 'Тест не найден' };
    }

    const attempts = db.prepare('SELECT * FROM QuizAttempt WHERE quizId = ?').all(quizId);
    
    if (!attempts.length) {
      return {
        success: true,
        stats: {
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          completionRate: 0
        }
      };
    }

    const scores = attempts.map(a => a.score);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const bestScore = Math.max(...scores);

    return {
      success: true,
      stats: {
        totalAttempts: attempts.length,
        averageScore: Math.round(averageScore),
        bestScore,
        completionRate: 100
      }
    };
  } catch (error) {
    console.error('[Quizzes] Error getting stats:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Удалить тест
 * DELETE /api/quizzes/:quizId
 */
async function deleteQuiz(quizId) {
  try {
    // Удалить все вопросы
    db.prepare('DELETE FROM QuizQuestion WHERE quizId = ?').run(quizId);
    
    // Удалить все попытки
    db.prepare('DELETE FROM QuizAttempt WHERE quizId = ?').run(quizId);

    // Удалить тест
    db.prepare('DELETE FROM Quiz WHERE id = ?').run(quizId);

    return { success: true };
  } catch (error) {
    console.error('[Quizzes] Error deleting quiz:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  createQuiz,
  getQuiz,
  submitQuiz,
  getQuizResults,
  getQuizStats,
  deleteQuiz
};

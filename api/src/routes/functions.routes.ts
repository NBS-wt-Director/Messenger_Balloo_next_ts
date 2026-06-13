import { Router, Request, Response } from 'express';
import { db } from '../config/database';
import { verifyToken } from '../middleware/auth';
import { logger } from '../config/logger';

const router = Router();

// ==================== PUBLIC ENDPOINTS ====================

/**
 * GET /api/v1/functions
 * Получить список функций (публичные, видимые пользователям)
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { module, category, status, type, search } = _req.query as any;
    
    let query = `
      SELECT 
        function_id,
        name,
        short_description,
        module,
        category,
        status,
        priority,
        completion_percentage,
        icon_url,
        screenshot_url,
        ui_pages,
        ui_tabs,
        attachment_types,
        auth_methods,
        is_visible_to_users,
        created_at
      FROM project_functions
      WHERE is_visible_to_users = 1
    `;
    
    const params: any[] = [];
    
    if (module) {
      query += ' AND module = ?';
      params.push(module);
    }
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (type) {
      query += ' AND function_type = ?';
      params.push(type);
    }
    
    if (search) {
      query += ' AND (name LIKE ? OR short_description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY module, category, sort_order';
    
    const functions = db.prepare(query).all(...params);
    
    // Parse JSON fields
    const parsed = functions.map((f: any) => ({
      ...f,
      ui_pages: f.ui_pages ? JSON.parse(f.ui_pages) : [],
      ui_tabs: f.ui_tabs ? JSON.parse(f.ui_tabs) : [],
      attachment_types: f.attachment_types ? JSON.parse(f.attachment_types) : [],
      auth_methods: f.auth_methods ? JSON.parse(f.auth_methods) : [],
    }));
    
    res.json({
      success: true,
      data: parsed,
      total: parsed.length,
    });
  } catch (error) {
    logger.error('Error getting functions:', error);
    res.status(500).json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to get functions' },
    });
  }
});

/**
 * GET /api/v1/functions/:id
 * Получить детальную информацию о функции
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const func = db.prepare(`
      SELECT * FROM project_functions
      WHERE function_id = ? AND is_visible_to_users = 1
    `).get(id) as any;
    
    if (!func) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Function not found' },
      });
    }
    
    // Parse all JSON fields
    const parsed = {
      ...func,
      components: func.components ? JSON.parse(func.components) : [],
      hooks: func.hooks ? JSON.parse(func.hooks) : [],
      api_endpoints: func.api_endpoints ? JSON.parse(func.api_endpoints) : [],
      database_tables: func.database_tables ? JSON.parse(func.database_tables) : [],
      ui_tabs: func.ui_tabs ? JSON.parse(func.ui_tabs) : [],
      ui_pages: func.ui_pages ? JSON.parse(func.ui_pages) : [],
      ui_buttons: func.ui_buttons ? JSON.parse(func.ui_buttons) : [],
      ui_forms: func.ui_forms ? JSON.parse(func.ui_forms) : [],
      attachment_types: func.attachment_types ? JSON.parse(func.attachment_types) : [],
      supported_formats: func.supported_formats ? JSON.parse(func.supported_formats) : [],
      auth_methods: func.auth_methods ? JSON.parse(func.auth_methods) : [],
      permissions: func.permissions ? JSON.parse(func.permissions) : [],
      roles: func.roles ? JSON.parse(func.roles) : [],
      tags: func.tags ? JSON.parse(func.tags) : [],
      related_functions: func.related_functions ? JSON.parse(func.related_functions) : [],
      changelog: func.changelog ? JSON.parse(func.changelog) : [],
    };
    
    res.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    logger.error('Error getting function:', error);
    res.status(500).json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to get function' },
    });
  }
});

// ==================== PROTECTED ENDPOINTS (Admin/Staff) ====================

/**
 * GET /api/v1/functions/admin/all
 * Получить ВСЕ функции (включая скрытые, для сотрудников)
 */
router.get('/admin/all', verifyToken, async (req: Request, res: Response) => {
  try {
    // Check if user is staff
    const user = (req as any).user;
    if (!user || !user.is_staff) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Staff access required' },
      });
    }
    
    const functions = db.prepare(`
      SELECT * FROM project_functions
      ORDER BY module, category, sort_order
    `).all() as any[];
    
    // Parse all JSON fields
    const parsed = functions.map((f) => ({
      ...f,
      components: f.components ? JSON.parse(f.components) : [],
      hooks: f.hooks ? JSON.parse(f.hooks) : [],
      api_endpoints: f.api_endpoints ? JSON.parse(f.api_endpoints) : [],
      database_tables: f.database_tables ? JSON.parse(f.database_tables) : [],
      ui_tabs: f.ui_tabs ? JSON.parse(f.ui_tabs) : [],
      ui_pages: f.ui_pages ? JSON.parse(f.ui_pages) : [],
      ui_buttons: f.ui_buttons ? JSON.parse(f.ui_buttons) : [],
      ui_forms: f.ui_forms ? JSON.parse(f.ui_forms) : [],
      attachment_types: f.attachment_types ? JSON.parse(f.attachment_types) : [],
      supported_formats: f.supported_formats ? JSON.parse(f.supported_formats) : [],
      auth_methods: f.auth_methods ? JSON.parse(f.auth_methods) : [],
      permissions: f.permissions ? JSON.parse(f.permissions) : [],
      roles: f.roles ? JSON.parse(f.roles) : [],
      tags: f.tags ? JSON.parse(f.tags) : [],
      related_functions: f.related_functions ? JSON.parse(f.related_functions) : [],
      changelog: f.changelog ? JSON.parse(f.changelog) : [],
    }));
    
    res.json({
      success: true,
      data: parsed,
      total: parsed.length,
    });
  } catch (error) {
    logger.error('Error getting all functions:', error);
    res.status(500).json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to get functions' },
    });
  }
});

/**
 * POST /api/v1/functions/admin/create
 * Создать новую функцию (только для сотрудников с паролем)
 */
router.post('/admin/create', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.is_staff) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Staff access required' },
      });
    }
    
    const {
      function_id,
      name,
      short_description,
      long_description,
      technical_description,
      module,
      category,
      subcategory,
      function_type,
      status,
      priority,
      components,
      hooks,
      api_endpoints,
      ui_tabs,
      ui_pages,
      ui_buttons,
      ui_forms,
      attachment_types,
      supported_formats,
      max_file_size,
      auth_methods,
      permissions,
      roles,
      icon_url,
      screenshot_url,
      docs_url,
      planned_quarter,
      estimated_hours,
      tags,
      related_functions,
      parent_function_id,
      is_visible_to_users,
      is_visible_to_staff,
    } = req.body;
    
    // Validate required fields
    if (!function_id || !name || !module || !category) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' },
      });
    }
    
    // Check if function_id already exists
    const existing = db.prepare('SELECT id FROM project_functions WHERE function_id = ?').get(function_id);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE', message: 'Function ID already exists' },
      });
    }
    
    // Insert new function
    const result = db.prepare(`
      INSERT INTO project_functions (
        function_id, name, short_description, long_description, technical_description,
        module, category, subcategory, function_type, status, priority,
        components, hooks, api_endpoints, ui_tabs, ui_pages, ui_buttons, ui_forms,
        attachment_types, supported_formats, max_file_size,
        auth_methods, permissions, roles,
        icon_url, screenshot_url, docs_url,
        planned_quarter, estimated_hours, tags, related_functions, parent_function_id,
        is_visible_to_users, is_visible_to_staff, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      function_id,
      name,
      short_description || null,
      long_description || null,
      technical_description || null,
      module,
      category,
      subcategory || null,
      function_type || 'feature',
      status || 'planned',
      priority || 'medium',
      components ? JSON.stringify(components) : null,
      hooks ? JSON.stringify(hooks) : null,
      api_endpoints ? JSON.stringify(api_endpoints) : null,
      ui_tabs ? JSON.stringify(ui_tabs) : null,
      ui_pages ? JSON.stringify(ui_pages) : null,
      ui_buttons ? JSON.stringify(ui_buttons) : null,
      ui_forms ? JSON.stringify(ui_forms) : null,
      attachment_types ? JSON.stringify(attachment_types) : null,
      supported_formats ? JSON.stringify(supported_formats) : null,
      max_file_size || null,
      auth_methods ? JSON.stringify(auth_methods) : null,
      permissions ? JSON.stringify(permissions) : null,
      roles ? JSON.stringify(roles) : null,
      icon_url || null,
      screenshot_url || null,
      docs_url || null,
      planned_quarter || null,
      estimated_hours || null,
      tags ? JSON.stringify(tags) : null,
      related_functions ? JSON.stringify(related_functions) : null,
      parent_function_id || null,
      is_visible_to_users !== false,
      is_visible_to_staff !== false,
      user.username,
    );
    
    // Log history
    db.prepare(`
      INSERT INTO project_functions_history (function_id, action, new_value, changed_by)
      VALUES (?, 'created', ?, ?)
    `).run(function_id, JSON.stringify({ function_id, name }), user.username);
    
    res.json({
      success: true,
      message: 'Function created successfully',
      data: { id: result.lastInsertRowid, function_id },
    });
  } catch (error) {
    logger.error('Error creating function:', error);
    res.status(500).json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to create function' },
    });
  }
});

/**
 * PUT /api/v1/functions/admin/update/:id
 * Обновить функцию
 */
router.put('/admin/update/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.is_staff) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Staff access required' },
      });
    }
    
    const { id } = req.params;
    const updates = req.body;
    
    // Get existing function
    const existing = db.prepare('SELECT * FROM project_functions WHERE function_id = ?').get(id) as any;
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Function not found' },
      });
    }
    
    // Build update query dynamically
    const allowedFields = [
      'name', 'short_description', 'long_description', 'technical_description',
      'status', 'priority', 'completion_percentage',
      'components', 'hooks', 'api_endpoints',
      'ui_tabs', 'ui_pages', 'ui_buttons', 'ui_forms',
      'attachment_types', 'supported_formats', 'max_file_size',
      'auth_methods', 'permissions', 'roles',
      'icon_url', 'screenshot_url', 'demo_url', 'docs_url',
      'planned_quarter', 'estimated_hours', 'actual_hours',
      'tags', 'related_functions', 'sort_order',
      'is_visible_to_users', 'is_visible_to_staff',
    ];
    
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        // Convert arrays/objects to JSON strings
        if (typeof updates[field] === 'object' && updates[field] !== null) {
          updateValues.push(JSON.stringify(updates[field]));
        } else {
          updateValues.push(updates[field]);
        }
      }
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'No valid fields to update' },
      });
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateFields.push('updated_by = ?');
    updateValues.push(user.username);
    
    updateValues.push(id);
    
    const query = `UPDATE project_functions SET ${updateFields.join(', ')} WHERE function_id = ?`;
    db.prepare(query).run(...updateValues);
    
    // Log history
    db.prepare(`
      INSERT INTO project_functions_history (function_id, action, new_value, changed_by)
      VALUES (?, 'updated', ?, ?)
    `).run(id, JSON.stringify(updates), user.username);
    
    res.json({
      success: true,
      message: 'Function updated successfully',
    });
  } catch (error) {
    logger.error('Error updating function:', error);
    res.status(500).json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to update function' },
    });
  }
});

/**
 * DELETE /api/v1/functions/admin/delete/:id
 * Удалить функцию (soft delete)
 */
router.delete('/admin/delete/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.is_staff) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Staff access required' },
      });
    }
    
    const { id } = req.params;
    
    const existing = db.prepare('SELECT id FROM project_functions WHERE function_id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Function not found' },
      });
    }
    
    // Soft delete - set status to deprecated and hide from users
    db.prepare(`
      UPDATE project_functions
      SET status = 'deprecated',
          is_visible_to_users = 0,
          updated_at = CURRENT_TIMESTAMP,
          updated_by = ?
      WHERE function_id = ?
    `).run(user.username, id);
    
    // Log history
    db.prepare(`
      INSERT INTO project_functions_history (function_id, action, new_value, changed_by)
      VALUES (?, 'deleted', '{"status": "deprecated"}', ?)
    `).run(id, user.username);
    
    res.json({
      success: true,
      message: 'Function deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting function:', error);
    res.status(500).json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to delete function' },
    });
  }
});

// ==================== SETTINGS ENDPOINTS ====================

/**
 * GET /api/v1/settings
 * Получить публичные настройки
 */
router.get('/settings', async (_req: Request, res: Response) => {
  try {
    const settings = db.prepare(`
      SELECT setting_key, setting_value, setting_type, description, category
      FROM system_settings
      WHERE is_public = 1 OR setting_key = 'admin.password'
    `).all() as any[];
    
    const parsed = settings.reduce((acc, s) => {
      acc[s.setting_key] = s.setting_type === 'json' ? JSON.parse(s.setting_value) : s.setting_value;
      return acc;
    }, {} as any);
    
    res.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    logger.error('Error getting settings:', error);
    res.status(500).json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to get settings' },
    });
  }
});

/**
 * PUT /api/v1/settings/update
 * Обновить настройку (только для сотрудников)
 */
router.put('/settings/update', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.is_staff) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Staff access required' },
      });
    }
    
    const { setting_key, setting_value } = req.body;
    
    if (!setting_key || setting_value === undefined) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' },
      });
    }
    
    const existing = db.prepare('SELECT id, setting_type FROM system_settings WHERE setting_key = ?').get(setting_key) as any;
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Setting not found' },
      });
    }
    
    const value = existing.setting_type === 'json' ? JSON.stringify(setting_value) : setting_value;
    
    db.prepare(`
      UPDATE system_settings
      SET setting_value = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ?
      WHERE setting_key = ?
    `).run(value, user.username, setting_key);
    
    res.json({
      success: true,
      message: 'Setting updated successfully',
    });
  } catch (error) {
    logger.error('Error updating setting:', error);
    res.status(500).json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to update setting' },
    });
  }
});

export default router;

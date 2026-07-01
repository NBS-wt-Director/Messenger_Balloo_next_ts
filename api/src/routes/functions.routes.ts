import { Router, Request, Response } from 'express';
import { dbAsync } from '../config/database';
import { authenticate } from '../middleware/auth';
import logger from '../config/logger';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const { module, category, status, type, search } = _req.query as any;
    let query = 'SELECT function_id, name, short_description, module, category, status, priority, completion_percentage, icon_url, screenshot_url, ui_pages, ui_tabs, attachment_types, auth_methods, is_visible_to_users, created_at FROM project_functions WHERE is_visible_to_users = 1';
    const params: any[] = [];
    if (module) { query += ' AND module = ?'; params.push(module); }
    if (category) { query += ' AND category = ?'; params.push(category); }
    if (status) { query += ' AND status = ?'; params.push(status); }
    if (type) { query += ' AND function_type = ?'; params.push(type); }
    if (search) { query += ' AND (name LIKE ? OR short_description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    query += ' ORDER BY module, category, sort_order';
    const functions = await dbAsync.prepare(query).all(...params);
    res.json({ success: true, data: functions, total: functions.length });
  } catch (error) {
    logger.error('Error getting functions:', error);
    res.status(500).json({ success: false, error: { code: 'DATABASE_ERROR', message: 'Failed to get functions' } });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const func = await dbAsync.prepare('SELECT * FROM project_functions WHERE function_id = ? AND is_visible_to_users = 1').get(id);
    if (!func) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Function not found' } });
    res.json({ success: true, data: func });
  } catch (error) {
    logger.error('Error getting function:', error);
    res.status(500).json({ success: false, error: { code: 'DATABASE_ERROR', message: 'Failed to get function' } });
  }
});

router.get('/admin/all', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.isAdmin) return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Staff access required' } });
    const functions = await dbAsync.prepare('SELECT * FROM project_functions ORDER BY module, category, sort_order').all();
    res.json({ success: true, data: functions, total: functions.length });
  } catch (error) {
    logger.error('Error getting all functions:', error);
    res.status(500).json({ success: false, error: { code: 'DATABASE_ERROR', message: 'Failed to get functions' } });
  }
});

router.post('/admin/create', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.isAdmin) return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Staff access required' } });
    const { function_id, name, module, category, short_description, long_description, technical_description, subcategory, function_type, status, priority, components, hooks, api_endpoints, ui_tabs, ui_pages, ui_buttons, ui_forms, attachment_types, supported_formats, max_file_size, auth_methods, permissions, roles, icon_url, screenshot_url, docs_url, planned_quarter, estimated_hours, tags, related_functions, parent_function_id, is_visible_to_users, is_visible_to_staff } = req.body;
    if (!function_id || !name || !module || !category) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } });
    const existing = await dbAsync.prepare('SELECT id FROM project_functions WHERE function_id = ?').get(function_id);
    if (existing) return res.status(409).json({ success: false, error: { code: 'DUPLICATE', message: 'Function ID already exists' } });
    await dbAsync.prepare(`INSERT INTO project_functions (function_id, name, short_description, long_description, technical_description, module, category, subcategory, function_type, status, priority, components, hooks, api_endpoints, ui_tabs, ui_pages, ui_buttons, ui_forms, attachment_types, supported_formats, max_file_size, auth_methods, permissions, roles, icon_url, screenshot_url, docs_url, planned_quarter, estimated_hours, tags, related_functions, parent_function_id, is_visible_to_users, is_visible_to_staff, created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
      function_id, name, short_description || null, long_description || null, technical_description || null, module, category, subcategory || null, function_type || 'feature', status || 'planned', priority || 'medium',
      components ? JSON.stringify(components) : null, hooks ? JSON.stringify(hooks) : null, api_endpoints ? JSON.stringify(api_endpoints) : null, ui_tabs ? JSON.stringify(ui_tabs) : null, ui_pages ? JSON.stringify(ui_pages) : null,
      ui_buttons ? JSON.stringify(ui_buttons) : null, ui_forms ? JSON.stringify(ui_forms) : null, attachment_types ? JSON.stringify(attachment_types) : null, supported_formats ? JSON.stringify(supported_formats) : null, max_file_size || null,
      auth_methods ? JSON.stringify(auth_methods) : null, permissions ? JSON.stringify(permissions) : null, roles ? JSON.stringify(roles) : null, icon_url || null, screenshot_url || null, docs_url || null,
      planned_quarter || null, estimated_hours || null, tags ? JSON.stringify(tags) : null, related_functions ? JSON.stringify(related_functions) : null, parent_function_id || null,
      is_visible_to_users !== false ? 1 : 0, is_visible_to_staff !== false ? 1 : 0, user.id
    );
    res.json({ success: true, message: 'Function created successfully', data: { function_id } });
  } catch (error) {
    logger.error('Error creating function:', error);
    res.status(500).json({ success: false, error: { code: 'DATABASE_ERROR', message: 'Failed to create function' } });
  }
});

router.put('/admin/update/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.isAdmin) return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Staff access required' } });
    const { id } = req.params;
    const updates = req.body;
    const existing = await dbAsync.prepare('SELECT id FROM project_functions WHERE function_id = ?').get(id);
    if (!existing) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Function not found' } });
    const allowedFields = ['name','short_description','long_description','status','priority','completion_percentage','components','hooks','api_endpoints','ui_tabs','ui_pages','ui_buttons','ui_forms','attachment_types','supported_formats','max_file_size','auth_methods','permissions','roles','icon_url','screenshot_url','docs_url','planned_quarter','estimated_hours','tags','related_functions','sort_order','is_visible_to_users','is_visible_to_staff'];
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(typeof updates[field] === 'object' ? JSON.stringify(updates[field]) : updates[field]);
      }
    }
    if (updateFields.length === 0) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'No valid fields to update' } });
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateFields.push('updated_by = ?');
    updateValues.push(user.id);
    updateValues.push(id);
    await dbAsync.prepare(`UPDATE project_functions SET ${updateFields.join(', ')} WHERE function_id = ?`).run(...updateValues);
    res.json({ success: true, message: 'Function updated successfully' });
  } catch (error) {
    logger.error('Error updating function:', error);
    res.status(500).json({ success: false, error: { code: 'DATABASE_ERROR', message: 'Failed to update function' } });
  }
});

router.delete('/admin/delete/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.isAdmin) return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Staff access required' } });
    const { id } = req.params;
    const existing = await dbAsync.prepare('SELECT id FROM project_functions WHERE function_id = ?').get(id);
    if (!existing) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Function not found' } });
    await dbAsync.prepare(`UPDATE project_functions SET status = 'deprecated', is_visible_to_users = 0, updated_at = CURRENT_TIMESTAMP, updated_by = ? WHERE function_id = ?`).run(user.id, id);
    res.json({ success: true, message: 'Function deleted successfully' });
  } catch (error) {
    logger.error('Error deleting function:', error);
    res.status(500).json({ success: false, error: { code: 'DATABASE_ERROR', message: 'Failed to delete function' } });
  }
});

router.get('/settings', async (_req: Request, res: Response) => {
  try {
    const settings = await dbAsync.prepare(`SELECT setting_key, setting_value, setting_type, description, category FROM system_settings WHERE is_public = 1`).all();
    const parsed = settings.reduce((acc: any, s: any) => { acc[s.setting_key] = s.setting_type === 'json' ? JSON.parse(s.setting_value) : s.setting_value; return acc; }, {});
    res.json({ success: true, data: parsed });
  } catch (error) {
    logger.error('Error getting settings:', error);
    res.status(500).json({ success: false, error: { code: 'DATABASE_ERROR', message: 'Failed to get settings' } });
  }
});

router.put('/settings/update', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.isAdmin) return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Staff access required' } });
    const { setting_key, setting_value } = req.body;
    if (!setting_key || setting_value === undefined) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } });
    const existing = await dbAsync.prepare('SELECT id FROM system_settings WHERE setting_key = ?').get(setting_key);
    if (!existing) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Setting not found' } });
    const value = typeof setting_value === 'object' ? JSON.stringify(setting_value) : setting_value;
    await dbAsync.prepare(`UPDATE system_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ? WHERE setting_key = ?`).run(value, user.id, setting_key);
    res.json({ success: true, message: 'Setting updated successfully' });
  } catch (error) {
    logger.error('Error updating setting:', error);
    res.status(500).json({ success: false, error: { code: 'DATABASE_ERROR', message: 'Failed to update setting' } });
  }
});

export default router;




import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface ResponseData {
  success: boolean;
  message: string;
  error?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { filePath, content } = req.body;

    if (!filePath || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'filePath and content are required' 
      });
    }

    // Security: prevent directory traversal
    const normalizedPath = path.normalize(filePath);
    if (normalizedPath.includes('..')) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid file path' 
      });
    }

    const fullPath = path.join(process.cwd(), normalizedPath);
    
    // Verify file is within SUMMARY_DOCS
    if (!fullPath.startsWith(process.cwd())) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    // Write file
    fs.writeFileSync(fullPath, content, 'utf8');

    return res.status(200).json({ 
      success: true, 
      message: 'File saved successfully' 
    });
  } catch (error) {
    console.error('Save error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error saving file',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

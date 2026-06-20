import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const baseDir = path.join(process.cwd(), 'docs', 'app-canonical');
    const files: any[] = [];

    if (!fs.existsSync(baseDir)) {
      return Response.json({ success: true, files: [] });
    }

    function scanDir(dir: string, relativePath: string = '') {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relative = path.join(relativePath, entry.name);

        if (entry.isDirectory()) {
          scanDir(fullPath, relative);
        } else if (entry.name.endsWith('.md') || entry.name.endsWith('.json')) {
          const stat = fs.statSync(fullPath);
          files.push({
            path: relative,
            name: entry.name,
            size: stat.size,
          });
        }
      }
    }

    scanDir(baseDir);

    return Response.json({ success: true, files });
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

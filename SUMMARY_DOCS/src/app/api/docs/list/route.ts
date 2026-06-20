import fs from 'fs';
import path from 'path';

interface DocFile {
  name: string;
  path: string;
  size?: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dirPath = searchParams.get('path');

    if (!dirPath) {
      return Response.json(
        { success: false, message: 'Missing path parameter' },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), dirPath);

    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
      return Response.json(
        { success: true, docs: [] },
        { status: 200 }
      );
    }

    const files = fs.readdirSync(fullPath);
    const docs: DocFile[] = [];

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(path.join(process.cwd(), filePath));
        docs.push({
          name: file,
          path: filePath,
          size: stat.size,
        });
      }
    }

    return Response.json({ success: true, docs });
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

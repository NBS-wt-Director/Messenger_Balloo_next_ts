import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const docPath = searchParams.get('path');

    if (!docPath) {
      return Response.json(
        { success: false, message: 'Missing path parameter' },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), docPath);

    if (!fs.existsSync(fullPath)) {
      return Response.json(
        { success: false, message: 'Document not found' },
        { status: 404 }
      );
    }

    const content = fs.readFileSync(fullPath, 'utf-8');

    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

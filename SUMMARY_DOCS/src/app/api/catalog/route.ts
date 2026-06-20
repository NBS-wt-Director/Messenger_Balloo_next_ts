import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const manifestPath = path.join(process.cwd(), 'MANIFEST.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    return Response.json({
      success: true,
      documents: manifest.documents,
      categories: manifest.categories,
    });
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

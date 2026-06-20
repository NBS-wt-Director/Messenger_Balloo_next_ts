import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const baseDir = path.join(process.cwd(), 'docs', 'app-canonical');
    const apps: any[] = [];

    if (!fs.existsSync(baseDir)) {
      return Response.json({ success: true, apps: [] });
    }

    const nodes = fs.readdirSync(baseDir);

    for (const nodeId of nodes) {
      const nodeDir = path.join(baseDir, nodeId);
      if (!fs.statSync(nodeDir).isDirectory()) continue;

      const appsDir = path.join(nodeDir);
      const appFolders = fs.readdirSync(appsDir).filter(f => {
        const fullPath = path.join(appsDir, f);
        return fs.statSync(fullPath).isDirectory();
      });

      for (const appId of appFolders) {
        const appDir = path.join(appsDir, appId);
        const manifestPath = path.join(appDir, 'manifest.json');
        const linkedViewPath = path.join(appDir, 'maps', 'linked-view.json');

        let title = '';
        let status = 'active';
        let objectCount = 0;

        if (fs.existsSync(manifestPath)) {
          try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            title = manifest.title || '';
            status = manifest.status || 'active';
          } catch { /* ignore */ }
        }

        if (fs.existsSync(linkedViewPath)) {
          try {
            const linkedView = JSON.parse(fs.readFileSync(linkedViewPath, 'utf-8'));
            objectCount =
              (linkedView.counters?.screens || 0) +
              (linkedView.counters?.transitions || 0) +
              (linkedView.counters?.scenarios || 0) +
              (linkedView.counters?.integrations || 0);
          } catch { /* ignore */ }
        }

        apps.push({
          nodeId,
          appId,
          title,
          status,
          objectCount,
        });
      }
    }

    return Response.json({ success: true, apps });
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

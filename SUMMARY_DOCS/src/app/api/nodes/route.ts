import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const nodesDir = path.join(process.cwd(), 'SUMMARY_DOCS', 'project', 'nodes');
    const nodes: any[] = [];

    if (!fs.existsSync(nodesDir)) {
      return Response.json({ success: true, nodes: [] });
    }

    // Read NODETREE_INDEX.md for node registry
    const indexFile = path.join(nodesDir, 'Nodes', 'NODETREE_INDEX.md');
    if (fs.existsSync(indexFile)) {
      const index = fs.readFileSync(indexFile, 'utf-8');
      
      // Parse nodes from index
      const nodeSections = index.match(/### [^\n]+\n(?:[^\n]+\n)*/g) || [];
      
      for (const section of nodeSections) {
        const titleMatch = section.match(/^### (.+)$/m);
        if (titleMatch) {
          const title = titleMatch[1];
          const idMatch = title.match(/([a-z0-9-]+)/i);
          if (idMatch) {
            const nodeId = idMatch[1];
            const nodeDir = path.join(nodesDir, nodeId);
            const docs: any[] = [];
            
            if (fs.existsSync(nodeDir) && fs.statSync(nodeDir).isDirectory()) {
              const files = fs.readdirSync(nodeDir);
              for (const file of files) {
                if (file.endsWith('.md')) {
                  const filePath = path.join(nodeDir, file);
                  const stat = fs.statSync(filePath);
                  docs.push({
                    name: file,
                    path: `Nodes/${nodeId}/${file}`,
                    size: stat.size,
                  });
                }
              }
            }
            
            nodes.push({
              id: nodeId,
              title: title,
              docs: docs,
              docCount: docs.length,
            });
          }
        }
      }
    }

    // Fallback: scan directories directly
    if (nodes.length === 0) {
      const dirs = fs.readdirSync(nodesDir);
      for (const dir of dirs) {
        const dirPath = path.join(nodesDir, dir);
        if (fs.statSync(dirPath).isDirectory()) {
          const files = fs.readdirSync(dirPath);
          const mdFiles = files.filter(f => f.endsWith('.md'));
          const docs = mdFiles.map(file => ({
            name: file,
            path: `Nodes/${dir}/${file}`,
          }));
          
          nodes.push({
            id: dir,
            title: dir,
            docs: docs,
            docCount: docs.length,
          });
        }
      }
    }

    return Response.json({ success: true, nodes });
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

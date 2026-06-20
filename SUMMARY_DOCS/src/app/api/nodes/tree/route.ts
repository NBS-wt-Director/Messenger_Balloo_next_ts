import fs from 'fs';
import path from 'path';

interface NodeInfo {
  nodeId: string;
  canonicalName: string;
  branch: string;
  nodeType: string;
  domain: string | null;
  localDevIdentity: string | null;
  technical: boolean;
  codegenPriority: number;
  status: string;
  notes: string;
  summaryDoc?: string;
  contractDoc?: string;
}

export async function GET() {
  try {
    const manifestPath = path.join(process.cwd(), 'SUMMARY_DOCS', 'project', 'nodes', 'Nodes', 'NODETREE_MANIFEST.json');
    
    if (!fs.existsSync(manifestPath)) {
      return Response.json(
        { success: false, message: 'NODETREE_MANIFEST.json not found' },
        { status: 404 }
      );
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const nodes: NodeInfo[] = manifest.nodes.map((node: any) => ({
      nodeId: node.nodeId,
      canonicalName: node.canonicalName,
      branch: node.branch,
      nodeType: node.nodeType,
      domain: node.domain,
      localDevIdentity: node.localDevIdentity,
      technical: node.technical,
      codegenPriority: node.codegenPriority,
      status: node.status,
      notes: node.notes,
      summaryDoc: node.summaryDoc,
      contractDoc: node.contractDoc,
    }));

    return Response.json({ success: true, nodes });
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

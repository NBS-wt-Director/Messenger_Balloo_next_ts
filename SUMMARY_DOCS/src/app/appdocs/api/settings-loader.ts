import fs from 'fs';
import path from 'path';

export interface Settings {
  generalPassword?: string;
}

export async function readSettings(settingsPath: string): Promise<Settings> {
  const candidates = [
    path.join(settingsPath, '.env'),
    path.join(settingsPath, '.env.prod'),
    path.join(settingsPath, '.env.example.dev'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      const content = fs.readFileSync(candidate, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('GENERAL_PASSWORD=')) {
          const value = trimmed.split('=', 2)[1].trim().replace(/^["']|["']$/g, '');
          return { generalPassword: value };
        }
      }
    }
  }

  if (process.env.GENERAL_PASSWORD) {
    return { generalPassword: process.env.GENERAL_PASSWORD };
  }

  return {};
}

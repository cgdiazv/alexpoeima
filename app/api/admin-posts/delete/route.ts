import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

function normalizeToken(token: string): string {
  return token.trim().replace(/^(Bearer|token)\s+/i, '');
}

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug no proporcionado' }, { status: 400 });
    }

    // 1. Delete local JSON post file and uploaded image if present
    const postsDirectory = path.join(process.cwd(), 'data/posts');
    const filePath = path.join(postsDirectory, `${slug}.json`);

    let imagePath: string | null = null;
    if (fs.existsSync(filePath)) {
      try {
        const rawData = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(rawData) as { image?: string };
        if (typeof parsed.image === 'string' && parsed.image.startsWith('/uploads/blog/')) {
          imagePath = path.join(process.cwd(), 'public', parsed.image.replace(/^\//, ''));
        }
      } catch (err) {
        console.error('Error al leer metadatos de imagen:', err);
      }

      fs.unlinkSync(filePath);
    }

    if (imagePath && fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error('Error al eliminar imagen asociada:', err);
      }
    }

    // 2. If GitHub integration configured, sync delete to GitHub repository
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (token && repo) {
      const gitJsonPath = `data/posts/${slug}.json`;
      const url = `https://api.github.com/repos/${repo}/contents/${gitJsonPath}`;
      const headers = {
        Authorization: `token ${normalizeToken(token)}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      };

      const getRes = await fetch(`${url}?ref=${encodeURIComponent(branch)}`, { method: 'GET', headers });
      if (getRes.ok) {
        const fileData = await getRes.json();
        const sha = fileData.sha;

        await fetch(url, {
          method: 'DELETE',
          headers,
          body: JSON.stringify({
            message: `Delete blog post: ${slug}`,
            sha,
            branch,
          }),
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Artículo eliminado correctamente' });
  } catch (error: any) {
    console.error('Error al eliminar el artículo:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}

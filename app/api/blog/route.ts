import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

type GitHubErrorPayload = {
  message?: string;
  errors?: Array<{ message?: string }>;
};

function normalizeToken(rawToken: string): string {
  return rawToken
    .trim()
    .replace(/^Bearer\s+/i, '')
    .replace(/^token\s+/i, '');
}

function getGitHubAuthHeader(rawToken: string): string {
  return `token ${normalizeToken(rawToken)}`;
}

async function parseGitHubError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as GitHubErrorPayload;
    const nested = payload.errors?.map((err) => err.message).filter(Boolean).join(', ');
    return [payload.message, nested].filter(Boolean).join(' | ') || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

async function upsertRepoFile({
  repo,
  branch,
  token,
  path: filePath,
  message,
  content,
}: {
  repo: string;
  branch: string;
  token: string;
  path: string;
  message: string;
  content: string;
}) {
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const headers = {
    Authorization: getGitHubAuthHeader(token),
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const existingRes = await fetch(`${url}?ref=${encodeURIComponent(branch)}`, {
    method: 'GET',
    headers,
  });

  let sha: string | undefined;
  if (existingRes.ok) {
    const existingData = (await existingRes.json()) as { sha?: string };
    sha = existingData.sha;
  }

  const putBody: {
    message: string;
    content: string;
    branch: string;
    sha?: string;
  } = {
    message,
    content,
    branch,
  };

  if (sha) {
    putBody.sha = sha;
  }

  const putRes = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(putBody),
  });

  if (!putRes.ok) {
    const details = await parseGitHubError(putRes);
    throw new Error(`GitHub error writing ${filePath}: ${details}`);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug: customSlug,
      originalSlug,
      category,
      excerpt,
      content,
      author,
      date,
      readTime,
      imageName,
      imageBase64,
      image: existingImage,
    } = body;

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: 'El título, resumen (excerpt) y contenido son obligatorios.' },
        { status: 400 }
      );
    }

    // Clean and normalize slug
    const finalSlug = (customSlug || title)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!finalSlug) {
      return NextResponse.json({ error: 'El URL Slug no es válido.' }, { status: 400 });
    }

    let publicImagePath = existingImage || '/headers/header-home.webp';

    // Save image if base64 provided
    if (imageBase64 && imageName) {
      const fileExtension = imageName.split('.').pop() || 'webp';
      const finalImageName = `${finalSlug}.${fileExtension}`;
      publicImagePath = `/uploads/blog/${finalImageName}`;

      const uploadDir = path.join(process.cwd(), 'public/uploads/blog');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const buffer = Buffer.from(imageBase64, 'base64');
      const localImagePath = path.join(uploadDir, finalImageName);
      fs.writeFileSync(localImagePath, buffer);

      // GitHub sync for image
      const token = process.env.GITHUB_TOKEN;
      const repo = process.env.GITHUB_REPO;
      const branch = process.env.GITHUB_BRANCH || 'main';

      if (token && repo) {
        const gitImagePath = `public/uploads/blog/${finalImageName}`;
        try {
          await upsertRepoFile({
            repo,
            branch,
            token,
            path: gitImagePath,
            message: `Media: blog image for ${title}`,
            content: imageBase64,
          });
        } catch (err) {
          console.error('GitHub image sync error:', err);
        }
      }
    }

    // Process content into array format if passed as string
    let contentArray: string[] = [];
    if (Array.isArray(content)) {
      contentArray = content;
    } else if (typeof content === 'string') {
      contentArray = content
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
    }

    // Calculate read time if not provided
    let calculatedReadTime = readTime;
    if (!calculatedReadTime) {
      const totalWords = contentArray.join(' ').split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(totalWords / 200));
      calculatedReadTime = `${minutes} min read`;
    }

    const postData = {
      id: finalSlug,
      slug: finalSlug,
      title,
      excerpt,
      category: category || 'Studio Journal',
      author: author || 'Alexandra Robles',
      date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: calculatedReadTime,
      image: publicImagePath,
      content: contentArray,
    };

    // Save JSON post locally
    const postsDir = path.join(process.cwd(), 'data/posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    const jsonPath = path.join(postsDir, `${finalSlug}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(postData, null, 2), 'utf8');

    // Remove old JSON if slug was renamed during edit
    if (originalSlug && originalSlug !== finalSlug) {
      const oldJsonPath = path.join(postsDir, `${originalSlug}.json`);
      if (fs.existsSync(oldJsonPath)) {
        fs.unlinkSync(oldJsonPath);
      }
    }

    // Sync JSON to GitHub if configured
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (token && repo) {
      const gitJsonPath = `data/posts/${finalSlug}.json`;
      const contentBase64 = Buffer.from(JSON.stringify(postData, null, 2)).toString('base64');
      try {
        await upsertRepoFile({
          repo,
          branch,
          token,
          path: gitJsonPath,
          message: `Feat: publish/update blog post - ${title}`,
          content: contentBase64,
        });
      } catch (err) {
        console.error('GitHub JSON sync error:', err);
      }
    }

    return NextResponse.json({ success: true, slug: finalSlug, post: postData });
  } catch (error: any) {
    console.error('Error saving post:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor.' }, { status: 500 });
  }
}

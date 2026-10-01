import { NextResponse } from 'next/server';
import { getAllBlogPostsServer } from '@/lib/blogServer';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const posts = getAllBlogPostsServer();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error cargando posts en panel admin:', error);
    return NextResponse.json({ error: 'Error al obtener artículos' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, published } = body;
    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'title, slug, and content are required' }, { status: 400 });
    }
    const post = await prisma.blogPost.create({
      data: { title, slug, content, excerpt: excerpt || null, published: published ?? false },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    const isUnique = error instanceof Error && error.message.includes('Unique constraint');
    if (isUnique) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

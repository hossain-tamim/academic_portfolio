import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, published } = body;
    const post = await prisma.blogPost.update({
      where: { id },
      data: { title, slug, content, excerpt: excerpt || null, published },
    });
    return NextResponse.json(post);
  } catch (error: unknown) {
    console.error(error);
    const isUnique = error instanceof Error && error.message.includes('Unique constraint');
    if (isUnique) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

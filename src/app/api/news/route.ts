import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const news = await prisma.news.findMany({
      where: published === 'true' ? { published: true } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(news);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.date) {
      return NextResponse.json({ error: 'title and date are required' }, { status: 400 });
    }
    const news = await prisma.news.create({
      data: {
        title: body.title,
        url: body.url || null,
        date: body.date,
        published: body.published ?? true,
        featured: body.featured ?? false,
      }
    });
    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const photos = await prisma.photo.findMany({
      where: tag ? { tag } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(photos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const photo = await prisma.photo.create({
      data: {
        url: body.url,
        publicId: body.publicId,
        title: body.title || null,
        tag: body.tag || 'other',
        width: body.width || null,
        height: body.height || null,
      },
    });
    return NextResponse.json(photo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save photo' }, { status: 500 });
  }
}

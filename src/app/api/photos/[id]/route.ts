import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(photo.publicId);

    // Delete from DB
    await prisma.photo.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const photo = await prisma.photo.update({
      where: { id },
      data: {
        title: body.title || null,
        tag: body.tag || 'other',
        featured: body.featured ?? false,
      },
    });
    return NextResponse.json(photo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const tag = (formData.get('tag') as string) || 'other';
    const title = (formData.get('title') as string) || null;
    const featured = formData.get('featured') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      width: number;
      height: number;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'photography', resource_type: 'image' },
        (error, result) => {
          if (error || !result) reject(error || new Error('Upload failed'));
          else resolve(result as { secure_url: string; public_id: string; width: number; height: number });
        }
      );
      stream.end(buffer);
    });

    const photo = await prisma.photo.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        title: title || null,
        tag,
        featured,
        width: result.width,
        height: result.height,
      },
    });

    return NextResponse.json(photo);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Upload error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

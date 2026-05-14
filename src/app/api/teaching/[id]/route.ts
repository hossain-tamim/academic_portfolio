import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const course = await prisma.teaching.update({
      where: { id },
      data: {
        code: body.code,
        name: body.name,
        semester: body.semester,
        creditHours: body.creditHours ? parseFloat(body.creditHours) : null,
        description: body.description || null,
        syllabus: body.syllabus || null,
        featured: body.featured || false,
      }
    });
    return NextResponse.json(course);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.teaching.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

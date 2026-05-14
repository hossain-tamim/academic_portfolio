import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.teaching.findMany({
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }]
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const course = await prisma.teaching.create({
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
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

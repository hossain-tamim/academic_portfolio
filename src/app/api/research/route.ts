import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all research projects
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const projects = await prisma.project.findMany({
      where: status ? { status } : {},
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST - Create new research project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status || 'ONGOING',
        featured: body.featured || false,
        imageUrl: body.imageUrl || null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        githubUrl: body.githubUrl || null,
        datasetUrl: body.datasetUrl || null,
        paperUrl: body.paperUrl || null,
        tags: body.tags || null,
      }
    });
    
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all publications
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const type = searchParams.get('type');
    
    const publications = await prisma.publication.findMany({
      where: {
        ...(year && { year: parseInt(year) }),
        ...(type && { type }),
      },
      orderBy: [
        { year: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    return NextResponse.json(publications);
  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch publications' },
      { status: 500 }
    );
  }
}

// POST - Create new publication
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const publication = await prisma.publication.create({
      data: {
        title: body.title,
        authors: body.authors,
        year: parseInt(body.year),
        venue: body.venue,
        publisher: body.publisher || null,
        doi: body.doi || null,
        pdfUrl: body.pdfUrl || null,
        abstract: body.abstract || null,
        type: body.type,
        badge: body.badge || null,
        volume: body.volume || null,
        issue: body.issue || null,
        pages: body.pages || null,
        featured: body.featured || false,
      }
    });
    
    return NextResponse.json(publication, { status: 201 });
  } catch (error) {
    console.error('Error creating publication:', error);
    return NextResponse.json(
      { error: 'Failed to create publication' },
      { status: 500 }
    );
  }
}
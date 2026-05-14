import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single publication
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const publication = await prisma.publication.findUnique({
      where: { id }
    });

    if (!publication) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(publication);
  } catch (error) {
    console.error('Error fetching publication:', error);
    return NextResponse.json(
      { error: 'Failed to fetch publication' },
      { status: 500 }
    );
  }
}

// PUT - Update publication
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const publication = await prisma.publication.update({
      where: { id },
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
        featured: body.featured,
      }
    });

    return NextResponse.json(publication);
  } catch (error) {
    console.error('Error updating publication:', error);
    return NextResponse.json(
      { error: 'Failed to update publication' },
      { status: 500 }
    );
  }
}

// DELETE publication
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.publication.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting publication:', error);
    return NextResponse.json(
      { error: 'Failed to delete publication' },
      { status: 500 }
    );
  }
}

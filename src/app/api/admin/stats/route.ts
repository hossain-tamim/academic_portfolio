import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [publications, projects, courses, news, photos, messages, unreadMessages, posts] = await Promise.all([
      prisma.publication.count(),
      prisma.project.count(),
      prisma.teaching.count(),
      prisma.news.count({ where: { published: true } }),
      prisma.photo.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.blogPost.count(),
    ]);
    return NextResponse.json({ publications, projects, courses, news, photos, messages, unreadMessages, posts });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({
      publications: 0, projects: 0, courses: 0, news: 0,
      photos: 0, messages: 0, unreadMessages: 0, posts: 0,
    });
  }
}

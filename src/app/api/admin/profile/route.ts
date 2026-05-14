import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, email, currentPassword, newPassword } = body;

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const updateData: { name?: string; email?: string; password?: string } = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined && email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      updateData.email = email;
    }
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password required to set a new password' }, { status: 400 });
      }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

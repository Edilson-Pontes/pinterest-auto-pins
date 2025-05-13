import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 400 }
      );
    }

    // Find and validate token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 400 }
      );
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token }
      });
      return NextResponse.json(
        { error: 'Token expirado' },
        { status: 400 }
      );
    }

    // Update user email verification status
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() }
    });

    // Delete used token
    await prisma.verificationToken.delete({
      where: { token }
    });

    // Redirect to login page with success message
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/?verified=true`
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar email' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar token
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

    // Hash nova senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Atualizar senha do usuário
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { password: hashedPassword }
    });

    // Deletar token usado
    await prisma.verificationToken.delete({
      where: { token }
    });

    return NextResponse.json(
      { message: 'Senha alterada com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Erro ao redefinir senha' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email é obrigatório' },
                { status: 400 }
            );
        }

        // Verificar se o usuário existe
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        // Gerar token de recuperação
        const token = crypto.randomBytes(32).toString('hex');
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires: new Date(Date.now() + 3600000) // 1 hora
            }
        });

        // Enviar email
        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Recuperação de Senha - Pinterest Auto Pins',
            html: `
        <h1>Recuperação de Senha</h1>
        <p>Você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
      `
        });

        return NextResponse.json(
            { message: 'Email de recuperação enviado com sucesso' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Password recovery error:', error);
        return NextResponse.json(
            { error: 'Erro ao processar recuperação de senha' },
            { status: 500 }
        );
    }
} 
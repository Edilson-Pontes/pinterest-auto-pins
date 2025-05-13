import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    // Configure your email service here
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, cpf, password } = body;

        // Validate required fields
        if (!name || !email || !phone || !cpf || !password) {
            return NextResponse.json(
                { error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { cpf }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Usuário já cadastrado com este email ou CPF' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                cpf,
                password: hashedPassword,
            },
        });

        // Create verification token
        const token = crypto.randomBytes(32).toString('hex');
        await prisma.verificationToken.create({
            data: {
                identifier: user.email,
                token,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            },
        });

        // Send verification email
        const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: user.email,
            subject: 'Verifique seu email - Pinterest Auto Pins',
            html: `
        <h1>Bem-vindo ao Pinterest Auto Pins!</h1>
        <p>Clique no link abaixo para verificar seu email:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>Este link expira em 24 horas.</p>
      `,
        });

        return NextResponse.json(
            { message: 'Usuário cadastrado com sucesso. Verifique seu email.' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Erro ao cadastrar usuário' },
            { status: 500 }
        );
    }
} 
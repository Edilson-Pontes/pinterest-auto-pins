import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

const PLAN_DURATIONS = {
    'StartPin': 30, // 30 dias
    'TurboPin': 60, // 60 dias
    'MasterPin': 180 // 180 dias
};

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { planType } = body;

        if (!planType || !PLAN_DURATIONS[planType as keyof typeof PLAN_DURATIONS]) {
            return NextResponse.json(
                { error: 'Plano inválido' },
                { status: 400 }
            );
        }

        // Calcular data de término com base no tipo do plano
        const durationInDays = PLAN_DURATIONS[planType as keyof typeof PLAN_DURATIONS];
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + durationInDays);

        // Verificar se já existe uma assinatura ativa
        const existingSubscription = await prisma.subscription.findFirst({
            where: {
                userId: session.user.id,
                status: 'active'
            }
        });

        if (existingSubscription) {
            return NextResponse.json(
                { error: 'Você já possui uma assinatura ativa' },
                { status: 400 }
            );
        }

        // Criar nova assinatura
        const subscription = await prisma.subscription.create({
            data: {
                userId: session.user.id,
                planType,
                endDate,
                status: 'active'
            }
        });

        return NextResponse.json(subscription, { status: 201 });
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json(
            { error: 'Erro ao processar assinatura' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: session.user.id,
                status: 'active'
            }
        });

        return NextResponse.json(subscription || { status: 'none' });
    } catch (error) {
        console.error('Subscription fetch error:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar assinatura' },
            { status: 500 }
        );
    }
} 
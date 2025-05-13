'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    const advantages = [
        {
            title: 'Rapidez na Criação',
            description: 'Crie dezenas de Pins em questão de minutos, economizando horas do seu tempo.',
            icon: '⚡'
        },
        {
            title: 'Constância na Execução',
            description: 'Mantenha sua conta ativa com publicações regulares e programadas.',
            icon: '🎯'
        },
        {
            title: 'Crescimento Exponencial',
            description: 'Alcance mais seguidores com uma presença consistente e profissional.',
            icon: '📈'
        },
        {
            title: 'Automação Inteligente',
            description: 'Deixe o sistema trabalhar por você, focando no que realmente importa.',
            icon: '🤖'
        }
    ];

    const plans = [
        {
            name: 'StartPin',
            price: 'R$ 59,90',
            duration: '30 dias',
            features: [
                'Criação de até 100 Pins por mês',
                'Agendamento básico',
                'Suporte por email'
            ],
            color: 'blue'
        },
        {
            name: 'TurboPin',
            price: 'R$ 109,90',
            duration: '60 dias',
            features: [
                'Criação de até 300 Pins por mês',
                'Agendamento avançado',
                'Suporte prioritário',
                'Analytics básico'
            ],
            color: 'purple'
        },
        {
            name: 'MasterPin',
            price: 'R$ 269,90',
            duration: '180 dias',
            features: [
                'Criação ilimitada de Pins',
                'Agendamento premium',
                'Suporte VIP 24/7',
                'Analytics completo',
                'Recursos exclusivos'
            ],
            color: 'green'
        }
    ];

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-2xl text-blue-600">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Bem-vindo, {session?.user?.name}!
                    </h1>
                </div>
            </header>

            {/* Vantagens */}
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Vantagens do Pinterest Auto Pins
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                        Descubra como nossa plataforma pode revolucionar sua presença no Pinterest
                    </p>
                </div>

                <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {advantages.map((advantage) => (
                        <div
                            key={advantage.title}
                            className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="text-4xl mb-4">{advantage.icon}</div>
                            <h3 className="text-lg font-medium text-gray-900">{advantage.title}</h3>
                            <p className="mt-2 text-gray-600">{advantage.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Planos */}
            <div className="bg-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Escolha seu Plano
                        </h2>
                        <p className="mt-4 text-xl text-gray-600">
                            Comece hoje mesmo a automatizar seus Pins
                        </p>
                    </div>

                    <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div className={`bg-${plan.color}-600 px-6 py-4`}>
                                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                                    <div className="mt-2">
                                        <span className="text-3xl font-bold text-white">{plan.price}</span>
                                        <span className="text-white ml-2">/{plan.duration}</span>
                                    </div>
                                </div>
                                <div className="px-6 py-8">
                                    <ul className="space-y-4">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center">
                                                <svg
                                                    className={`h-5 w-5 text-${plan.color}-500`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span className="ml-2 text-gray-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        className={`mt-8 w-full bg-${plan.color}-600 text-white py-2 px-4 rounded-md hover:bg-${plan.color}-700 transition-colors`}
                                    >
                                        Começar Agora
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 
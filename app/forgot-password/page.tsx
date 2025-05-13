'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
            } else {
                setStatus('error');
                setMessage(data.error || 'Erro ao enviar email de recuperação.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Erro ao processar sua solicitação.');
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-700">Recuperar Senha</h1>
                    <p className="text-gray-600 mt-2">
                        Digite seu email para receber as instruções de recuperação
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            E-mail
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={status === 'loading'}
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-md ${status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Enviando...' : 'Enviar Email de Recuperação'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm text-blue-600 hover:text-blue-500"
                    >
                        Voltar para o login
                    </Link>
                </div>
            </div>
        </main>
    );
} 
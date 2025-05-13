import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { SessionProvider } from './providers/SessionProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Pinterest Auto Pins',
    description: 'Automatize a criação de Pins no Pinterest',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();

    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                <SessionProvider session={session}>
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
} 
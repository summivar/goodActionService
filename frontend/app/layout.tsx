import './globals.scss';
import {Inter} from 'next/font/google';
import {Header} from '@/components/header/header';
import ProviderComponent from '@/components/provider-component/provider-component';

const inter = Inter({subsets: ['latin']});


export const metadata = {
  title: 'Good Action Service',
  description: 'test task',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body className="body">
    <ProviderComponent>
      <Header/>
      <main>{children}</main>
    </ProviderComponent>
    </body>
    </html>
  );
}

import { Inter } from 'next/font/google';
import React from 'react';
import './globals.css';
import { ProjectProvider } from '@/context/ProjectContext';
import ProjectSelector from "@/components/ProjectSelector";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'プロジェクトアシスタント',
  description: 'プロジェクトの運営をアシストするツールです',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ProjectProvider>
          <div className="p-4 bg-blue-400">
            <ProjectSelector />
          </div>
          <main>{children}</main>
        </ProjectProvider>
      </body>
    </html>
  );
}

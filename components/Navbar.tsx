'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AboutModal from '@/components/AboutModal';

interface NavbarProps {
  title?: string;
}

export default function Navbar({ title = 'OVNI EXPLORER' }: NavbarProps) {
  const pathname = usePathname();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-tech-dark border-b border-tech flex items-center justify-between px-6 py-3">
        <div className="text-tech-white font-bold text-lg terminal-text">
          {title}
        </div>
        <div className="flex gap-4">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'nav-link-active' : ''}`}
          >
            [DASHBOARD]
          </Link>
          <Link
            href="/map/list"
            className={`nav-link ${pathname === '/map/list' ? 'nav-link-active' : ''}`}
          >
            [LIST VIEW]
          </Link>
          <Link
            href="/map"
            className={`nav-link ${pathname === '/map' ? 'nav-link-active' : ''}`}
          >
            [MAP VIEW]
          </Link>
          <button
            onClick={() => setIsAboutOpen(true)}
            className="nav-link"
          >
            [ABOUT]
          </button>
        </div>
      </nav>
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
}

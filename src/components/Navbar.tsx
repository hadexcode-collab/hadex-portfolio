import { useState } from 'react';

interface NavLinkItem {
  label: string;
  href: string;
  target?: string;
  rel?: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: 'WORK', href: '#work' },
  { label: 'ABOUT', href: '#about' },
  { label: 'LAB', href: '#lab' },
  {
    label: 'CONTACT',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=hadex.code@gmail.com',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
];

interface NavbarProps {
  onEnterKage?: () => void;
}

export function Navbar({ onEnterKage }: NavbarProps = {}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="absolute top-0 left-0 right-0 w-full z-30 pointer-events-none">
      <nav
        id="main-navbar"
        aria-label="Main Navigation"
        className="w-full px-6 sm:px-10 lg:px-16 py-6 sm:py-8 flex justify-between items-center pointer-events-auto"
      >
        {/* Logo (left) */}
        <a
          id="navbar-brand-logo"
          href="#"
          className="flex items-center gap-2 text-white select-none group"
        >
          <span
            className="text-[19px] sm:text-[22px] tracking-tight font-medium leading-none"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            AVINASH TT
          </span>
        </a>

        {/* Desktop nav links (center/right, hidden below md) */}
        <div
          id="desktop-nav-links"
          className="hidden md:flex items-center gap-8 lg:gap-10 text-[12px] sm:text-[13px] tracking-[0.12em] font-medium text-white/70"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.target}
              rel={link.rel}
              onClick={(e) => {
                if (link.href === '#work' && onEnterKage) {
                  e.preventDefault();
                  onEnterKage();
                }
              }}
              className="text-white/70 hover:text-white transition-colors duration-200 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger button (visible below md) */}
        <button
          id="mobile-menu-button"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={toggleMenu}
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] cursor-pointer z-40 focus:outline-none"
        >
          <span
            className={`w-6 h-[1.5px] bg-white transition-transform duration-300 origin-center ${
              isOpen ? 'rotate-45 translate-y-[6.5px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[1.5px] bg-white transition-opacity duration-300 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-6 h-[1.5px] bg-white transition-transform duration-300 origin-center ${
              isOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile overlay (z-index: 35) */}
      <div
        id="mobile-navigation-overlay"
        className={`fixed inset-0 bg-black/95 text-white backdrop-blur-xl z-35 flex flex-col justify-center items-start px-8 sm:px-12 gap-6 transition-all duration-300 md:hidden ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
          Navigation
        </div>
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.target}
            rel={link.rel}
            onClick={(e) => {
              closeMenu();
              if (link.href === '#work' && onEnterKage) {
                e.preventDefault();
                onEnterKage();
              }
            }}
            className="text-[26px] tracking-[0.08em] font-medium text-white hover:text-white/70 transition-colors"
          >
            {link.label}
          </a>
        ))}
        <div className="mt-8 pt-6 border-t border-white/10 w-full text-xs text-white/50 tracking-wider">
          HADEX® · ENGINEER · BUILDER · OBSERVER
        </div>
      </div>
    </header>
  );
}

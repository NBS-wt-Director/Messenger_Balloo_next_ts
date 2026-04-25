'use client';

import Link from 'next/link';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { Logo } from './ui/Logo';
import './layout/Footer.css';

export function Footer() {
  const { language } = useSettingsStore();
  const translations = getTranslations(language);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Логотип и название компании */}
        <div className="footer-brand">
          <Link href="/" className="footer-logo-link">
            <Logo 
              src="/logo.jpg" 
              alt="Balloo Messenger" 
              size="sm"
              showText={false}
            />
          </Link>
          <div className="footer-company">
            <span className="footer-company-name">NBS - web-tech</span>
            <span className="footer-company-slogan">Системы для Ваших Новых Начинаний.</span>
          </div>
        </div>

        {/* Ссылки */}
        <nav className="footer-links">
          <Link href="/downloads" className="footer-link">
            {translations.downloads}
          </Link>
          <span className="footer-divider">|</span>
          <Link href="/about-balloo" className="footer-link">
            {translations.aboutBalloo}
          </Link>
          <span className="footer-divider">|</span>
          <Link href="/about-company" className="footer-link">
            {translations.aboutCompany}
          </Link>
          <span className="footer-divider">|</span>
          <Link href="/features" className="footer-link">
            {translations.features}
          </Link>
          <span className="footer-divider">|</span>
          <Link href="/support" className="footer-link">
            {translations.supportProject}
          </Link>
          <span className="footer-divider">|</span>
          <Link href="/terms" className="footer-link">
            {translations.termsOfService}
          </Link>
          <span className="footer-divider">|</span>
          <Link href="/privacy" className="footer-link">
            {translations.privacyPolicy}
          </Link>
        </nav>

        {/* Версия */}
        <div className="footer-version">
          v1.0.0
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import MobileMenu from "../components/MobileMenu";
import "./globals.css";
import "../styles/form-overrides.css";
import "../styles/home.css";
import "../styles/home-overrides.css";
import "../styles/readability-overrides.css";
import "../styles/content-readability.css";
import "../styles/mobile.css";

export const metadata: Metadata = {
  title: "LiverGuard — NAFLD risk screening",
  description: "A transparent, educational NAFLD risk-prediction prototype.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container nav-wrap">
            <Link className="brand" href="/">
              <span className="brand-mark">✦</span>
              <span>
                Liver<span className="brand-accent">Guard</span>
              </span>
            </Link>
            <nav aria-label="Main navigation">
              <Link href="/about-model">About the model</Link>
              <Link href="/privacy">Privacy</Link>
            </nav>
            <MobileMenu />
            {/*
              <summary aria-label="Open navigation menu">⋮</summary>
              <div className="mobile-menu-panel">
                <Link href="/about-model">About the model</Link>
                <Link href="/privacy">Privacy</Link>
              </div>
            */}
            <Link className="button button-small" href="/predict">
              Start check <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <div className="brand footer-brand">
                <span className="brand-mark">✦</span>
                <span>
                  Liver<span className="brand-accent">Guard</span>
                </span>
              </div>
              <p>
                A transparent risk-prediction prototype built for education and
                portfolio demonstration.
              </p>
            </div>
            <div>
              <p className="footer-label">Explore</p>
              <Link href="/predict">Prediction check</Link>
              <Link href="/about-model">How it works</Link>
              <Link href="/privacy">Privacy & disclaimer</Link>
            </div>
            <div>
              <p className="footer-label">Important</p>
              <p>
                This tool does not diagnose disease or replace advice from a
                qualified healthcare professional.
              </p>
            </div>
          </div>
          <div className="container footer-bottom">
            <span>© {new Date().getFullYear()} LiverGuard</span>
            <span>Designed for clarity, built for trust.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}

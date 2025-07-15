import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/globals.css';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Davinto - Freelance Web Developer</title>
        <meta name="description" content="Davinto - Freelance web developer creating modern, responsive websites for clients" />
        <meta name="keywords" content="freelance web developer, portfolio, Davinto, Nigeria" />
      </Head>
      <header className="header">
        <div className="logo">Davinto</div>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>
      <main>
        <section className="hero">
          <h1>Hi, I'm Davinto</h1>
          <p>Freelance Web Developer Building Affordable, Responsive Websites</p>
          <Link href="/contact" className="cta-button">Hire Me</Link>
        </section>
        <section className="intro">
          <h2>Need a Website?</h2>
          <p>I create user-friendly websites for businesses and individuals. Check my services for pricing and explore my projects!</p>
        </section>
      </main>
      <footer className="footer">
        <p>© 2025 Davinto. All rights reserved.</p>
      </footer>
    </div>
  );
    }

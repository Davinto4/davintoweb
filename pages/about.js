import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <div>
      <Head>
        <title>About - Davinto</title>
        <meta name="description" content="About Davinto, freelance web developer in Nigeria" />
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
        <section className="about">
          <h1>About Davinto</h1>
          <img src="/images/profile.jpg" alt="Davinto Profile" className="profile-img" />
          <p>I'm Davinto (Chimdindu Macdonald), a freelance web developer based in Nigeria. I build modern, responsive websites to help businesses grow online.</p>
          <p>Contact me at +2348169045105 or macdinodavinto@gmail.com to start your project!</p>
        </section>
      </main>
      <footer className="footer">
        <p>© 2025 Davinto. All rights reserved.</p>
      </footer>
    </div>
  );
}

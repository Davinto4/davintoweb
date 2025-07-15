import Head from 'next/head';
import Link from 'next/link';

export default function Services() {
  return (
    <div>
      <Head>
        <title>Services - Davinto</title>
        <meta name="description" content="Freelance web development services and prices by Davinto" />
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
        <section className="services">
          <h1>My Services</h1>
          <p>Affordable web development solutions for your business.</p>
          <div className="services-grid">
            <div className="service-item">
              <h3>Custom Website (3–5 Pages)</h3>
              <p>Professional, responsive website tailored to your brand.</p>
              <p><strong>Price:</strong> $100–$300 (₦150,000–₦450,000)</p>
            </div>
            <div className="service-item">
              <h3>Landing Page</h3>
              <p>High-converting single-page site for campaigns or products.</p>
              <p><strong>Price:</strong> $50–$150 (₦75,000–₦225,000)</p>
            </div>
            <div className="service-item">
              <h3>Website Maintenance</h3>
              <p>Monthly updates and fixes to keep your site running.</p>
              <p><strong>Price:</strong> $30–$100/month (₦45,000–₦150,000/month)</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <p>© 2025 Davinto. All rights reserved.</p>
      </footer>
    </div>
  );
}

import Head from 'next/head';
import Link from 'next/link';

export default function Blog() {
  const posts = [
    { slug: 'first-post', title: 'My Web Development Journey', excerpt: 'How I started building websites for clients.' },
    { slug: 'why-vercel', title: 'Why Choose Vercel?', excerpt: 'Benefits of Vercel for fast, modern websites.' },
  ];

  return (
    <div>
      <Head>
        <title>Blog - Davinto</title>
        <meta name="description" content="Davinto’s blog on web development" />
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
        <section className="blog">
          <h1>My Blog</h1>
          <p>Insights and tips on web development.</p>
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post.slug} className="post-item">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="post-link">Read More</Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="footer">
        <p>© 2025 Davinto. All rights reserved.</p>
      </footer>
    </div>
  );
}

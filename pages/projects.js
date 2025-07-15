import Head from 'next/head';
import Link from 'next/link';

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: 'Client Portfolio',
      description: 'A responsive portfolio for a creative professional.',
      image: '/images/project1.jpg',
      url: 'https://example.com',
    },
    {
      id: 2,
      title: 'Business Landing Page',
      description: 'A high-converting landing page for a local business.',
      image: '/images/project2.jpg',
      url: 'https://example.com',
    },
    {
      id: 3,
      title: 'Personal Blog',
      description: 'A blog site showcasing articles and insights.',
      image: '/images/project3.jpg',
      url: 'https://example.com',
    },
  ];

  return (
    <div>
      <Head>
        <title>Projects - Davinto</title>
        <meta name="description" content="Portfolio of websites built by Davinto" />
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
        <section className="projects">
          <h1>My Projects</h1>
          <p>Websites I’ve built for clients and personal projects.</p>
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-item">
                <img src={project.image} alt={project.title} />
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <a href={project.url} target="_blank" className="project-link">View Live</a>
              </div>
            ))}
          </div>
        </section>
        <section className="testimonials">
          <h2>Testimonials</h2>
          <div className="testimonials-grid">
            <div className="testimonial-item">
              <p>"Davinto delivered a fantastic website for my business!"</p>
              <p><strong>- Client A</strong></p>
            </div>
            <div className="testimonial-item">
              <p>"Affordable and professional. Highly recommend!"</p>
              <p><strong>- Client B</strong></p>
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

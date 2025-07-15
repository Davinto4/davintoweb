import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      setStatus('Message sent! I’ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } else {
      setStatus('Error sending message. Try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Head>
        <title>Contact - Davinto</title>
        <meta name="description" content="Contact Davinto for web development projects" />
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
        <section className="contact">
          <h1>Contact Davinto</h1>
          <p>Start your project today! Reach me via form, phone, or email.</p>
          <div className="contact-info">
            <p><strong>Phone/WhatsApp/Telegram:</strong> +2348169045105</p>
            <p><strong>Email:</strong> <a href="mailto:macdinodavinto@gmail.com">macdinodavinto@gmail.com</a></p>
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project"
              required
            ></textarea>
            <button type="submit">Send Message</button>
            {status && <p>{status}</p>}
          </form>
        </section>
      </main>
      <footer className="footer">
        <p>© 2025 Davinto. All rights reserved.</p>
      </footer>
    </div>
  );
}

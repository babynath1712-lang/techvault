import React from 'react';
import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const FOOTER_LINKS = {
  Categories: [
    { label: 'Mobiles',      path: '/products?cat=mobiles' },
    { label: 'Laptops',      path: '/products?cat=laptops' },
    { label: 'Tablets',      path: '/products?cat=tablets' },
    { label: 'Headphones',   path: '/products?cat=headphones' },
    { label: 'Earbuds',      path: '/products?cat=earbuds' },
    { label: 'Smartwatches', path: '/products?cat=smartwatches' },
  ],
  Company: [
    { label: 'About Us',     path: '/#about' },
    { label: 'Careers',      path: '/' },
    { label: 'Blog',         path: '/' },
    { label: 'Press',        path: '/' },
  ],
  Support: [
    { label: 'Help Center',  path: '/' },
    { label: 'Contact Us',   path: '/' },
    { label: 'Returns',      path: '/' },
    { label: 'Track Order',  path: '/dashboard' },
  ],
};

const SOCIALS = [
  { icon: FaGithub,   href: '#', label: 'GitHub' },
  { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FaTwitter,  href: '#', label: 'Twitter' },
  { icon: FaInstagram,href: '#', label: 'Instagram' },
];

const Footer = () => (
  <footer style={{
    background: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border)',
    marginTop: 'auto',
  }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px 32px' }}>
      {/* Top Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
        gap: 40, marginBottom: 48,
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, color: '#fff',
            }}>⚡</div>
            <span style={{
              fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif",
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>TechVault</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20, maxWidth: 220 }}>
            Your premium destination for cutting-edge technology. Curated products, unbeatable prices.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label} style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)', transition: 'all 0.2s ease', fontSize: 16,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h4 style={{
              fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16,
            }}>{title}</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {links.map(({ label, path }) => (
                <li key={label}>
                  <Link to={path} style={{
                    fontSize: 14, color: 'var(--text-secondary)',
                    transition: 'color 0.15s ease',
                    textDecoration: 'none',
                  }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Contact</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: HiMail, text: 'support@techvault.in' },
              { icon: HiPhone, text: '+91 98765 43210' },
              { icon: HiLocationMarker, text: 'Bangalore, Karnataka, India' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Icon style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} size={16} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--border),transparent)', marginBottom: 24 }} />

      {/* Bottom */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} TechVault. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
            <a key={t} href="#" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-secondary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >{t}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

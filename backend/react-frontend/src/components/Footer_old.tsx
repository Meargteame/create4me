import React from 'react'
import { 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaFacebook, 
  FaEnvelope 
} from './icons'

export default function Footer() {
  const footerLinks = {
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press', href: '#press' },
      { name: 'Contact', href: '#contact' },
    ],
    platform: [
      { name: 'How it Works', href: '#how-it-works' },
      { name: 'For Brands', href: '#brands' },
      { name: 'For Creators', href: '#creators' },
      { name: 'Pricing', href: '#pricing' },
    ],
    resources: [
      { name: 'Blog', href: '#blog' },
      { name: 'Help Center', href: '#help' },
      { name: 'Creator Guidelines', href: '#guidelines' },
      { name: 'Success Stories', href: '#stories' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'GDPR', href: '#gdpr' },
    ],
  }

  const socialLinks = [
    { icon: <FaTwitter />, name: 'Twitter', href: '#twitter' },
    { icon: <FaInstagram />, name: 'Instagram', href: '#instagram' },
    { icon: <FaLinkedin />, name: 'LinkedIn', href: '#linkedin' },
    { icon: <FaFacebook />, name: 'Facebook', href: '#facebook' },
  ]

  return (
    <footer style={{ 
      background: 'linear-gradient(135deg, #111827 0%, #000000 100%)', 
      color: 'white' 
    }}>
      {/* Newsletter Section */}
      <div style={{ borderBottom: '1px solid #374151' }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '4rem 1rem' 
        }}>
          <div style={{ 
            maxWidth: '1024px', 
            margin: '0 auto', 
            textAlign: 'center' 
          }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem' 
            }}>
              Stay in the Loop
            </h2>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#d1d5db', 
              marginBottom: '2rem',
              lineHeight: '1.7'
            }}>
              Get the latest Ethiopian influencer marketing insights, platform updates, and success stories delivered to your inbox.
            </p>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem', 
              maxWidth: '512px', 
              margin: '0 auto'
            }}>
              <div style={{ 
                flex: 1, 
                position: 'relative' 
              }}>
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '1.25rem'
                }}>
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  style={{
                    width: '100%',
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid #6b7280',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563eb'
                    e.target.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.2)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#6b7280'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              <button style={{ 
                backgroundColor: '#2563eb', 
                color: 'white', 
                padding: '1rem 2rem', 
                borderRadius: '0.5rem', 
                border: 'none', 
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb'
                e.currentTarget.style.transform = 'scale(1)'
              }}>
                Subscribe →
              </button>
            </div>
            
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#9ca3af', 
              marginTop: '1rem' 
            }}>
              Join 2,500+ Ethiopian marketers getting weekly insights. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '4rem 1rem' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem' 
        }}>
          {/* Brand Column */}
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#2563eb',
              marginBottom: '1rem'
            }}>
              Create4Me
            </h3>
            <p style={{ 
              color: '#d1d5db', 
              marginBottom: '1.5rem',
              lineHeight: '1.7',
              maxWidth: '400px'
            }}>
              The leading platform connecting Ethiopian businesses with top local content creators and influencers. 
              Grow your brand with authentic partnerships that drive real results in Ethiopia.
            </p>
            
            {/* Contact Info */}
            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '0.75rem' 
              }}>
                <span style={{ marginRight: '0.75rem' }}>📧</span>
                <span>hello@create4me.et</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '0.75rem' 
              }}>
                <span style={{ marginRight: '0.75rem' }}>📱</span>
                <span>+251 11 123 4567</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center' 
              }}>
                <span style={{ marginRight: '0.75rem' }}>📍</span>
                <span>Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                textTransform: 'capitalize'
              }}>
                {category}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {links.map((link) => (
                  <li key={link.name} style={{ marginBottom: '0.75rem' }}>
                    <a
                      href={link.href}
                      style={{
                        color: '#9ca3af',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div style={{ 
          paddingTop: '3rem', 
          marginTop: '3rem', 
          borderTop: '1px solid #374151' 
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* Copyright */}
            <div style={{ 
              color: '#9ca3af', 
              fontSize: '0.875rem' 
            }}>
              © 2024 Create4Me. All rights reserved.
            </div>

            {/* Social Links */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem' 
            }}>
              <span style={{ 
                color: '#9ca3af', 
                fontSize: '0.875rem' 
              }}>
                Follow us:
              </span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundColor: '#374151',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    fontSize: '1.25rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.backgroundColor = '#2563eb'
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#9ca3af'
                    e.currentTarget.style.backgroundColor = '#374151'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Additional Legal Info */}
          <div style={{ 
            marginTop: '2rem', 
            paddingTop: '2rem', 
            borderTop: '1px solid #374151',
            textAlign: 'center'
          }}>
            <p style={{ 
              color: '#9ca3af', 
              fontSize: '0.875rem',
              lineHeight: '1.6'
            }}>
              Create4Me is a registered trademark. All creator profiles and campaign data are protected by industry-leading security measures.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
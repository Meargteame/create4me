import React from 'react'
import { 
  FaRocket, 
  FaSearch, 
  FaHandshake, 
  FaChartBar 
} from './icons'

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Create Your Campaign",
      description: "Define your campaign goals, target audience, budget, and content requirements. Our team helps optimize your campaign strategy for the Ethiopian market.",
      icon: <FaRocket />,
      features: ["Campaign brief creation", "Audience targeting", "Budget planning", "Content guidelines"]
    },
    {
      step: "02", 
      title: "Discover Perfect Creators",
      description: "Browse our verified network of Ethiopian creators or let our AI match you with creators whose audiences align with your brand values and target demographics.",
      icon: <FaSearch />,
      features: ["Smart creator matching", "Audience analytics", "Portfolio review", "Performance history"]
    },
    {
      step: "03",
      title: "Collaborate & Create",
      description: "Work directly with selected creators to develop authentic content that resonates with Ethiopian audiences while maintaining your brand guidelines.",
      icon: <FaHandshake />,
      features: ["Direct messaging", "Content approval", "Brand guidelines", "Creative collaboration"]
    },
    {
      step: "04",
      title: "Track & Optimize",
      description: "Monitor campaign performance in real-time with detailed analytics. Track reach, engagement, conversions, and ROI across all platforms and optimize as needed.",
      icon: <FaChartBar />,
      features: ["Real-time analytics", "Performance tracking", "ROI measurement", "Campaign optimization"]
    }
  ]

  return (
    <section style={{ backgroundColor: '#f8fafc', padding: '5rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            padding: '0.5rem 1rem', 
            backgroundColor: '#fef3c7', 
            borderRadius: '9999px', 
            color: '#92400e', 
            fontSize: '0.875rem', 
            fontWeight: '500',
            marginBottom: '1.5rem'
          }}>
            → Simple Process
          </div>
          
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: '1rem' 
          }}>
            How Create4Me Works
          </h2>
          
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#6b7280', 
            maxWidth: '600px', 
            margin: '0 auto' 
          }}>
            From campaign creation to performance tracking, we make influencer marketing simple and effective
          </p>
        </div>

        {/* Steps */}
        <div style={{ position: 'relative' }}>
          {/* Connection Line */}
          <div style={{
            position: 'absolute',
            top: '3rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '2px',
            height: 'calc(100% - 6rem)',
            backgroundColor: '#e5e7eb',
            zIndex: 1
          }} />

          {steps.map((step, index) => (
            <div key={index} style={{ 
              display: 'grid',
              gridTemplateColumns: index % 2 === 0 ? '1fr auto 1fr' : '1fr auto 1fr',
              gap: '2rem',
              alignItems: 'center',
              marginBottom: index === steps.length - 1 ? 0 : '4rem',
              position: 'relative'
            }}>
              {/* Left Content (for even indices) or Empty (for odd) */}
              <div style={{ 
                textAlign: index % 2 === 0 ? 'right' : 'left',
                opacity: index % 2 === 0 ? 1 : 0
              }}>
                {index % 2 === 0 && (
                  <div style={{ 
                    backgroundColor: 'white', 
                    padding: '2rem', 
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '60px',
                      height: '60px',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#475569',
                      marginBottom: '1rem'
                    }}>
                      {step.icon}
                    </div>
                    
                    <h3 style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: '#111827', 
                      marginBottom: '1rem' 
                    }}>
                      {step.title}
                    </h3>
                    
                    <p style={{ 
                      color: '#6b7280', 
                      marginBottom: '1.5rem',
                      lineHeight: '1.6'
                    }}>
                      {step.description}
                    </p>
                    
                    <ul style={{ 
                      listStyle: 'none', 
                      padding: 0, 
                      margin: 0 
                    }}>
                      {step.features.map((feature, i) => (
                        <li key={i} style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '0.5rem',
                          fontSize: '0.875rem',
                          color: '#374151'
                        }}>
                          <span style={{ 
                            color: '#10b981', 
                            marginRight: '0.5rem' 
                          }}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Center Step Number */}
              <div style={{ 
                width: '4rem',
                height: '4rem',
                backgroundColor: '#2563eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                position: 'relative',
                zIndex: 2,
                border: '4px solid white',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                {step.step}
              </div>

              {/* Right Content (for odd indices) or Empty (for even) */}
              <div style={{ 
                textAlign: index % 2 === 1 ? 'left' : 'right',
                opacity: index % 2 === 1 ? 1 : 0
              }}>
                {index % 2 === 1 && (
                  <div style={{ 
                    backgroundColor: 'white', 
                    padding: '2rem', 
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '60px',
                      height: '60px',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#475569',
                      marginBottom: '1rem'
                    }}>
                      {step.icon}
                    </div>
                    
                    <h3 style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: '#111827', 
                      marginBottom: '1rem' 
                    }}>
                      {step.title}
                    </h3>
                    
                    <p style={{ 
                      color: '#6b7280', 
                      marginBottom: '1.5rem',
                      lineHeight: '1.6'
                    }}>
                      {step.description}
                    </p>
                    
                    <ul style={{ 
                      listStyle: 'none', 
                      padding: 0, 
                      margin: 0 
                    }}>
                      {step.features.map((feature, i) => (
                        <li key={i} style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '0.5rem',
                          fontSize: '0.875rem',
                          color: '#374151'
                        }}>
                          <span style={{ 
                            color: '#10b981', 
                            marginRight: '0.5rem' 
                          }}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '4rem',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: '1rem' 
          }}>
            Ready to Get Started?
          </h3>
          
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#6b7280', 
            marginBottom: '2rem' 
          }}>
            Launch your first Ethiopian influencer campaign in minutes
          </p>
          
          <button style={{ 
            backgroundColor: '#2563eb', 
            color: 'white', 
            padding: '1rem 2rem', 
            borderRadius: '0.5rem', 
            border: 'none', 
            fontWeight: '600', 
            fontSize: '1.125rem',
            cursor: 'pointer'
          }}>
            Create Campaign →
          </button>
        </div>
      </div>
    </section>
  )
}
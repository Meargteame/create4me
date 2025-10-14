import { useState } from 'react'

export default function VideoBanner() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  return (
    <section style={{ 
      padding: '5rem 0', 
      background: 'linear-gradient(135deg, #111827 0%, #000000 100%)', 
      color: 'white',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem' 
          }}>
            See Create4Me in Action
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#d1d5db', 
            maxWidth: '768px', 
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            Watch how leading Ethiopian brands are using our platform to connect with local creators 
            and drive unprecedented growth through authentic partnerships.
          </p>
        </div>

        {/* Video Container */}
        <div style={{ 
          position: 'relative', 
          maxWidth: '1024px', 
          margin: '0 auto' 
        }}>
          <div style={{ 
            position: 'relative', 
            borderRadius: '1rem', 
            overflow: 'hidden', 
            backgroundColor: '#374151',
            aspectRatio: '16/9',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Video Background */}
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '6rem', 
                  height: '6rem', 
                  margin: '0 auto 1.5rem', 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer'
                }}
                onClick={() => setIsPlaying(!isPlaying)}>
                  <span style={{ 
                    fontSize: '3rem',
                    marginLeft: isPlaying ? '0' : '0.25rem'
                  }}>
                    {isPlaying ? '⏸️' : '▶️'}
                  </span>
                </div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem' 
                }}>
                  Ethiopian Market Demo
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  See how Create4Me transforms Ethiopian influencer marketing
                </p>
              </div>
            </div>

            {/* Video Controls Overlay */}
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              opacity: 0,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'opacity 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
            onClick={() => setIsPlaying(!isPlaying)}>
              <div style={{ 
                width: '5rem', 
                height: '5rem', 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                e.currentTarget.style.transform = 'scale(1)'
              }}>
                <span style={{ 
                  fontSize: '2rem',
                  marginLeft: isPlaying ? '0' : '0.25rem'
                }}>
                  {isPlaying ? '⏸️' : '▶️'}
                </span>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)',
              padding: '1.5rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)',
                      color: 'white'
                    }}>
                    <span style={{ 
                      fontSize: '1.25rem',
                      marginLeft: isPlaying ? '0' : '0.125rem'
                    }}>
                      {isPlaying ? '⏸️' : '▶️'}
                    </span>
                  </button>

                  <div style={{ fontSize: '0.875rem', color: 'white' }}>
                    {isPlaying ? '1:23' : '0:00'} / 3:45
                  </div>
                </div>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    color: 'white'
                  }}>
                  <span style={{ fontSize: '1.25rem' }}>
                    {isMuted ? '🔇' : '🔊'}
                  </span>
                </button>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ 
                  width: '100%', 
                  height: '0.25rem', 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: '9999px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    backgroundColor: '#60a5fa', 
                    borderRadius: '9999px',
                    width: isPlaying ? '35%' : '0%',
                    transition: isPlaying ? 'width 10s linear' : 'none'
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Video Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '2rem', 
            marginTop: '3rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#60a5fa', 
                marginBottom: '0.5rem' 
              }}>
                2M+
              </div>
              <div style={{ color: '#d1d5db' }}>Video Views</div>
            </div>
            <div>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#60a5fa', 
                marginBottom: '0.5rem' 
              }}>
                3:45
              </div>
              <div style={{ color: '#d1d5db' }}>Average Watch Time</div>
            </div>
            <div>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#60a5fa', 
                marginBottom: '0.5rem' 
              }}>
                95%
              </div>
              <div style={{ color: '#d1d5db' }}>Completion Rate</div>
            </div>
          </div>

          {/* Call to Action */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button style={{ 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '1rem 2rem', 
              borderRadius: '0.5rem', 
              border: 'none', 
              fontWeight: '600', 
              fontSize: '1.125rem',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}>
              Get Started Today
            </button>
            <p style={{ color: '#d1d5db' }}>
              Join hundreds of Ethiopian brands already growing with Create4Me
            </p>
          </div>
        </div>

        {/* Background Decoration */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '-8rem',
          width: '16rem',
          height: '16rem',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '-8rem',
          width: '16rem',
          height: '16rem',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />
      </div>
    </section>
  )
}
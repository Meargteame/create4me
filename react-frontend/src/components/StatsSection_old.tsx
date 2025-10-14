export default function StatsSection() {
  const stats = [
    {
      number: "2,500+",
      label: "Verified Creators",
      description: "Active Ethiopian content creators across all major platforms",
      icon: "👥",
      growth: "+25% this month"
    },
    {
      number: "500+",
      label: "Brand Partners", 
      description: "Leading Ethiopian and international brands trust our platform",
      icon: "BUILDING",
      growth: "+15% this month"
    },
    {
      number: "180%",
      label: "Average ROI",
      description: "Brands see significant returns on their influencer investments",
      icon: "GROWTH",
      growth: "+30% vs traditional marketing"
    },
    {
      number: "98%",
      label: "Success Rate",
      description: "Campaigns that meet or exceed brand expectations",
      icon: "TARGET",
      growth: "Industry leading"
    }
  ]

  const platforms = [
    { name: "Instagram", users: "1.2M+", icon: "📷" },
    { name: "TikTok", users: "800K+", icon: "🎵" },
    { name: "YouTube", users: "600K+", icon: "📺" }, 
    { name: "Facebook", users: "2.1M+", icon: "👥" },
    { name: "Twitter", users: "450K+", icon: "🐦" },
    { name: "LinkedIn", users: "300K+", icon: "PROFESSIONAL" }
  ]

  return (
    <section style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      padding: '5rem 0',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            padding: '0.5rem 1rem', 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            borderRadius: '9999px', 
            color: 'white', 
            fontSize: '0.875rem', 
            fontWeight: '500',
            marginBottom: '1.5rem'
          }}>
            📊 Platform Statistics
          </div>
          
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem' 
          }}>
            Ethiopia's Largest Creator Network
          </h2>
          
          <p style={{ 
            fontSize: '1.25rem', 
            opacity: 0.9, 
            maxWidth: '600px', 
            margin: '0 auto' 
          }}>
            Connect with the most engaged and authentic Ethiopian audience across all major social platforms
          </p>
        </div>

        {/* Main Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              padding: '2rem', 
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
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
                fontSize: '12px',
                fontWeight: '700',
                color: '#475569',
                marginBottom: '1rem'
              }}>
                {stat.icon}
              </div>
              
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem' 
              }}>
                {stat.number}
              </div>
              
              <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem' 
              }}>
                {stat.label}
              </div>
              
              <div style={{ 
                fontSize: '0.875rem', 
                opacity: 0.8, 
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                {stat.description}
              </div>
              
              <div style={{ 
                fontSize: '0.75rem', 
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                color: '#10b981',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontWeight: '600',
                display: 'inline-block'
              }}>
                {stat.growth}
              </div>
            </div>
          ))}
        </div>

        {/* Platform Coverage */}
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
          padding: '3rem', 
          borderRadius: '1rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            textAlign: 'center',
            marginBottom: '2rem' 
          }}>
            Multi-Platform Creator Network
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {platforms.map((platform, index) => (
              <div key={index} style={{ 
                textAlign: 'center',
                padding: '1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '0.5rem'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  fontSize: '10px',
                  fontWeight: '600',
                  color: '#475569',
                  marginBottom: '0.5rem'
                }}>
                  {platform.icon}
                </div>
                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  marginBottom: '0.25rem' 
                }}>
                  {platform.name}
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  opacity: 0.8 
                }}>
                  {platform.users} Ethiopian users
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ 
            fontSize: '1.125rem', 
            marginBottom: '2rem',
            opacity: 0.9
          }}>
            Ready to tap into Ethiopia's most engaged creator community?
          </p>
          
          <button style={{ 
            backgroundColor: 'white', 
            color: '#2563eb', 
            padding: '1rem 2rem', 
            borderRadius: '0.5rem', 
            border: 'none', 
            fontWeight: '600', 
            fontSize: '1.125rem',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            Get Started Today →
          </button>
        </div>
      </div>
    </section>
  )
}
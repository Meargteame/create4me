export default function TrustSection() {
  const testimonials = [
    {
      name: "Meron Tadesse",
      company: "EthioTech Solutions",
      role: "Marketing Director",
      content: "Create4Me helped us connect with authentic Ethiopian creators who truly understand our market. Our campaign reach increased by 250%.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b882?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Dawit Bekele", 
      company: "AddisLife",
      role: "Content Creator",
      content: "The platform made it so easy to find brand partnerships that align with my values. I've worked with 12 brands this year alone.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Sara Alemayehu",
      company: "Blue Nile Coffee",
      role: "Brand Manager", 
      content: "Working with Ethiopian creators through Create4Me has been game-changing for our local market penetration.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ]

  const stats = [
    { label: "Campaign Success Rate", value: "98%" },
    { label: "Average ROI Increase", value: "180%" }, 
    { label: "Satisfied Clients", value: "500+" },
    { label: "Creator Network", value: "2,500+" }
  ]

  return (
    <section style={{ backgroundColor: '#f9fafb', padding: '5rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            padding: '0.5rem 1rem', 
            backgroundColor: '#dbeafe', 
            borderRadius: '9999px', 
            color: '#1d4ed8', 
            fontSize: '0.875rem', 
            fontWeight: '500',
            marginBottom: '1.5rem'
          }}>
            🛡️ Trusted by Ethiopia's Leading Brands
          </div>
          
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: '1rem' 
          }}>
            Join Ethiopia's Most Trusted Creator Platform
          </h2>
          
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#6b7280', 
            maxWidth: '600px', 
            margin: '0 auto' 
          }}>
            See why hundreds of Ethiopian brands and creators choose Create4Me for authentic partnerships
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '2rem', 
          marginBottom: '4rem' 
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '1rem', 
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#2563eb', 
                marginBottom: '0.5rem' 
              }}>
                {stat.value}
              </div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280', 
                fontWeight: '500' 
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {testimonials.map((testimonial, index) => (
            <div key={index} style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '1rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              {/* Stars */}
              <div style={{ display: 'flex', marginBottom: '1rem' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} style={{ color: '#fbbf24', fontSize: '1.25rem' }}>★</span>
                ))}
              </div>
              
              {/* Content */}
              <p style={{ 
                color: '#374151', 
                marginBottom: '1.5rem', 
                lineHeight: '1.6',
                fontStyle: 'italic'
              }}>
                "{testimonial.content}"
              </p>
              
              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  style={{ 
                    width: '3rem', 
                    height: '3rem', 
                    borderRadius: '50%', 
                    marginRight: '1rem' 
                  }}
                />
                <div>
                  <div style={{ fontWeight: '600', color: '#111827' }}>
                    {testimonial.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
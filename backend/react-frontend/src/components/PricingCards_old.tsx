export default function PricingCards() {
  const plans = [
    {
      name: "Starter",
      price: "5,000",
      currency: "ETB",
      period: "/month",
      description: "Perfect for small businesses and startups looking to try influencer marketing",
      features: [
        "Up to 5 creator collaborations/month",
        "Basic analytics dashboard", 
        "Email support",
        "Campaign templates",
        "Content approval workflow",
        "Payment processing"
      ],
      limitations: [
        "Limited to Instagram & Facebook",
        "Basic audience insights"
      ],
      popular: false,
      cta: "Start Free Trial"
    },
    {
      name: "Professional", 
      price: "15,000",
      currency: "ETB",
      period: "/month",
      description: "Ideal for growing brands ready to scale their influencer marketing efforts",
      features: [
        "Up to 20 creator collaborations/month",
        "Advanced analytics & reporting",
        "Priority support",
        "Custom campaign strategies",
        "Multi-platform campaigns",
        "A/B testing tools",
        "ROI tracking",
        "Dedicated account manager"
      ],
      limitations: [],
      popular: true,
      cta: "Get Started"
    },
    {
      name: "Enterprise",
      price: "Custom",
      currency: "",
      period: "",
      description: "For large brands and agencies needing full-scale influencer marketing solutions",
      features: [
        "Unlimited creator collaborations",
        "White-label platform options",
        "Custom integrations",
        "Advanced API access",
        "Dedicated success team",
        "Custom reporting",
        "Priority creator matching",
        "Contract management",
        "Multi-brand management"
      ],
      limitations: [],
      popular: false,
      cta: "Contact Sales"
    }
  ]

  const addOns = [
    { name: "Premium Analytics", price: "2,000 ETB/month", description: "Advanced reporting and insights" },
    { name: "Content Creation", price: "500 ETB/post", description: "Professional content creation support" },
    { name: "Campaign Strategy", price: "5,000 ETB/campaign", description: "Expert campaign planning and optimization" }
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
            ▶ Transparent Pricing
          </div>
          
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: '1rem' 
          }}>
            Choose the Perfect Plan for Your Brand
          </h2>
          
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#6b7280', 
            maxWidth: '600px', 
            margin: '0 auto',
            marginBottom: '2rem'
          }}>
            Start free, scale as you grow. All plans include access to our verified Ethiopian creator network.
          </p>

          {/* Toggle */}
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#e5e7eb',
            borderRadius: '0.5rem',
            padding: '0.25rem'
          }}>
            <button style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Monthly
            </button>
            <button style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#6b7280',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {plans.map((plan, index) => (
            <div key={index} style={{ 
              backgroundColor: 'white', 
              padding: '2.5rem', 
              borderRadius: '1rem',
              boxShadow: plan.popular ? '0 20px 25px rgba(37, 99, 235, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.05)',
              border: plan.popular ? '2px solid #2563eb' : '1px solid #e5e7eb',
              position: 'relative',
              transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}>
              {/* Popular Badge */}
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-0.75rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#111827', 
                  marginBottom: '0.5rem' 
                }}>
                  {plan.name}
                </h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ 
                    fontSize: '3rem', 
                    fontWeight: 'bold', 
                    color: plan.popular ? '#2563eb' : '#111827'
                  }}>
                    {plan.price}
                  </span>
                  {plan.currency && (
                    <span style={{ 
                      fontSize: '1.125rem', 
                      color: '#6b7280', 
                      marginLeft: '0.25rem' 
                    }}>
                      {plan.currency}{plan.period}
                    </span>
                  )}
                </div>
                
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '0.875rem',
                  lineHeight: '1.5'
                }}>
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: '#111827', 
                  marginBottom: '1rem' 
                }}>
                  What's included:
                </h4>
                
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginBottom: '0.75rem',
                      fontSize: '0.875rem',
                      color: '#374151'
                    }}>
                      <span style={{ 
                        color: '#10b981', 
                        marginRight: '0.75rem',
                        marginTop: '0.125rem'
                      }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    {plan.limitations.map((limitation, i) => (
                      <div key={i} style={{ 
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '0.5rem',
                        fontSize: '0.75rem',
                        color: '#9ca3af'
                      }}>
                        <span style={{ 
                          color: '#f59e0b', 
                          marginRight: '0.5rem',
                          marginTop: '0.125rem'
                        }}>⚠</span>
                        {limitation}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <button style={{ 
                width: '100%',
                backgroundColor: plan.popular ? '#2563eb' : 'white',
                color: plan.popular ? 'white' : '#2563eb',
                border: plan.popular ? 'none' : '2px solid #2563eb',
                padding: '1rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!plan.popular) {
                  e.currentTarget.style.backgroundColor = '#2563eb'
                  e.currentTarget.style.color = 'white'
                }
              }}
              onMouseLeave={(e) => {
                if (!plan.popular) {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.color = '#2563eb'
                }
              }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Optional Add-ons
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {addOns.map((addon, index) => (
              <div key={index} style={{ 
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#111827', 
                  marginBottom: '0.5rem' 
                }}>
                  {addon.name}
                </div>
                <div style={{ 
                  fontSize: '1rem', 
                  color: '#2563eb', 
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  {addon.price}
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280' 
                }}>
                  {addon.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom FAQ */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#6b7280', 
            marginBottom: '1rem' 
          }}>
            Questions about pricing? 
          </p>
          <button style={{
            backgroundColor: 'transparent',
            color: '#2563eb',
            border: 'none',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}>
            Contact our sales team →
          </button>
        </div>
      </div>
    </section>
  )
}
interface LogoProps {
  className?: string
  variant?: 'default' | 'large' | 'minimal'
}

export default function Logo({ className = "", variant = 'default' }: LogoProps) {
  const config = {
    default: { iconSize: '40px', textSize: '20px', showTagline: true },
    large: { iconSize: '64px', textSize: '30px', showTagline: true },
    minimal: { iconSize: '32px', textSize: '18px', showTagline: false }
  }[variant]

  return (
    <div 
      className={className}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        cursor: 'pointer'
      }}
    >
      {/* Logo Icon - MODERN ROUNDED DESIGN */}
      <div
        style={{
          width: config.iconSize,
          height: config.iconSize,
          background: '#2563eb',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
          color: 'white',
          fontWeight: '900',
          fontSize: variant === 'large' ? '22px' : '16px',
          letterSpacing: '-0.5px'
        }}
      >
        C4M
      </div>

      {/* Logo Text */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div 
          style={{
            fontWeight: '800',
            fontSize: config.textSize,
            background: '#1e293b',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Create4Me
        </div>
        {config.showTagline && (
          <div 
            style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}
          >
            Creators × Brands
          </div>
        )}
      </div>
    </div>
  )
}
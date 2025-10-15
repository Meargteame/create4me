interface LogoProps {
  className?: string
  variant?: 'default' | 'large' | 'minimal'
}

export default function Logo({ className = "", variant = 'default' }: LogoProps) {
  const config = {
    default: { textSize: '28px', iconSize: '32px', showTagline: true, spacing: '4px' },
    large: { textSize: '40px', iconSize: '48px', showTagline: true, spacing: '6px' },
    minimal: { textSize: '24px', iconSize: '28px', showTagline: false, spacing: '3px' }
  }[variant]

  return (
    <div 
      className={className}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      {/* Creative Icon - Sparkle/Star representing creation */}
      <div
        style={{
          position: 'relative',
          width: config.iconSize,
          height: config.iconSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Outer glow effect */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
        
        {/* Main sparkle/star icon */}
        <svg
          width={config.iconSize}
          height={config.iconSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* Center star */}
          <path
            d="M16 2L18.5 13.5L30 16L18.5 18.5L16 30L13.5 18.5L2 16L13.5 13.5L16 2Z"
            fill="url(#blueGradient)"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(37, 99, 235, 0.5))' }}
          />
          {/* Small accent stars */}
          <circle cx="8" cy="8" r="1.5" fill="#60a5fa" opacity="0.8" />
          <circle cx="24" cy="8" r="1.5" fill="#60a5fa" opacity="0.8" />
          <circle cx="8" cy="24" r="1.5" fill="#60a5fa" opacity="0.8" />
          <circle cx="24" cy="24" r="1.5" fill="#60a5fa" opacity="0.8" />
          
          <defs>
            <linearGradient id="blueGradient" x1="2" y1="2" x2="30" y2="30">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Logo Text with Gradient */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: config.spacing }}>
        <div 
          style={{
            fontWeight: '800',
            fontSize: config.textSize,
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
            lineHeight: '1',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          Create<span style={{ 
            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>4</span>Me
        </div>
        {config.showTagline && (
          <div 
            style={{
              fontSize: variant === 'large' ? '13px' : '11px',
              color: '#64748b',
              fontWeight: '600',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          >
            Creators × Brands
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
        `}
      </style>
    </div>
  )
}
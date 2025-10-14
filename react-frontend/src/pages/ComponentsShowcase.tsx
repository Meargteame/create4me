import { useState } from 'react'
import Header from '../components/Header'
import { Button, Card, Input, Badge, SkeletonCard } from '../components/ui'

export default function ComponentsShowcase() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (!email.includes('@')) {
        setError('Please enter a valid email')
      } else {
        setError('')
      }
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-16" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            UI Components Showcase
          </h1>
          <p className="text-xl text-gray-600">
            Explore our premium, modern UI components
          </p>
        </div>

        <div className="space-y-12">
          {/* Buttons Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Buttons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Primary Variants</h3>
                <div className="space-y-3">
                  <Button variant="primary" size="lg" glow fullWidth>
                    Primary Button
                  </Button>
                  <Button variant="secondary" size="lg" fullWidth>
                    Secondary Button
                  </Button>
                  <Button variant="outline" size="lg" fullWidth>
                    Outline Button
                  </Button>
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">With Icons</h3>
                <div className="space-y-3">
                  <Button 
                    variant="primary" 
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    }
                    fullWidth
                  >
                    Add Item
                  </Button>
                  <Button 
                    variant="secondary" 
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    }
                    iconPosition="right"
                    fullWidth
                  >
                    Download
                  </Button>
                  <Button 
                    variant="danger" 
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    }
                    fullWidth
                  >
                    Delete
                  </Button>
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">States</h3>
                <div className="space-y-3">
                  <Button variant="primary" loading fullWidth>
                    Loading...
                  </Button>
                  <Button variant="secondary" disabled fullWidth>
                    Disabled
                  </Button>
                  <Button variant="ghost" fullWidth>
                    Ghost Button
                  </Button>
                </div>
              </Card>
            </div>
          </section>

          {/* Cards Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="default" glow>
                <h3 className="font-semibold text-gray-900 mb-2">Default Card</h3>
                <p className="text-gray-600">
                  This is a default card with hover effects and subtle shadows.
                </p>
              </Card>

              <Card variant="glass">
                <h3 className="font-semibold text-gray-900 mb-2">Glass Card</h3>
                <p className="text-gray-600">
                  Glassmorphism effect with backdrop blur and transparency.
                </p>
              </Card>

              <Card variant="gradient">
                <h3 className="font-semibold text-gray-900 mb-2">Gradient Card</h3>
                <p className="text-gray-600">
                  Card with gradient border and clean white background.
                </p>
              </Card>
            </div>
          </section>

          {/* Inputs Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Input Fields</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Floating Labels</h3>
                <div className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error}
                    fullWidth
                  />
                  <Input
                    label="Password"
                    type="password"
                    helperText="Must be at least 8 characters"
                    fullWidth
                  />
                  <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    loading={loading}
                    fullWidth
                  >
                    Submit
                  </Button>
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">With Icons</h3>
                <div className="space-y-4">
                  <Input
                    label="Search"
                    placeholder="Search..."
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    }
                    fullWidth
                  />
                  <Input
                    label="Username"
                    placeholder="@username"
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                    fullWidth
                  />
                </div>
              </Card>
            </div>
          </section>

          {/* Badges Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Badges</h2>
            <Card>
              <div className="flex flex-wrap gap-4">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success" dot>Active</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger" dot>Error</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="success" size="lg">Large Badge</Badge>
                <Badge variant="primary" size="sm">Small</Badge>
              </div>
            </Card>
          </section>

          {/* Skeletons Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Skeleton Loaders</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

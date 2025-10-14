import { useState } from 'react'
import Header from '../components/Header'
import { Button, Card, Dialog, ConfirmDialog, SlideOver } from '../components/ui'

export default function ModalsShowcase() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [slideOverPosition, setSlideOverPosition] = useState<'left' | 'right'>('right')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-16" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Modals & Overlays Showcase
          </h1>
          <p className="text-xl text-gray-600">
            Beautiful dialogs, slide-overs, and command palette
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 <strong>Pro Tip:</strong> Press <kbd className="px-2 py-1 text-xs font-semibold bg-white border border-blue-300 rounded">⌘K</kbd> or <kbd className="px-2 py-1 text-xs font-semibold bg-white border border-blue-300 rounded">Ctrl+K</kbd> to open the Command Palette from anywhere!
            </p>
          </div>
        </div>

        <div className="space-y-12">
          {/* Dialog Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dialog Modals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <h3 className="font-semibold text-gray-900 mb-2">Basic Dialog</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Simple centered modal with backdrop blur
                </p>
                <Button variant="primary" onClick={() => setIsDialogOpen(true)} fullWidth>
                  Open Dialog
                </Button>
              </Card>

              <Card>
                <h3 className="font-semibold text-gray-900 mb-2">Confirm Dialog</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Pre-styled confirmation dialog with actions
                </p>
                <Button variant="danger" onClick={() => setIsConfirmOpen(true)} fullWidth>
                  Delete Item
                </Button>
              </Card>

              <Card>
                <h3 className="font-semibold text-gray-900 mb-2">Command Palette</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Quick navigation and search (⌘K)
                </p>
                <Button variant="outline" onClick={() => {
                  const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    metaKey: true,
                    bubbles: true
                  });
                  document.dispatchEvent(event);
                }} fullWidth>
                  Open Palette
                </Button>
              </Card>
            </div>
          </section>

          {/* Slide-over Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Slide-over Panels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold text-gray-900 mb-2">Right Slide-over</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Panel slides in from the right side
                </p>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSlideOverPosition('right')
                    setIsSlideOverOpen(true)
                  }}
                  fullWidth
                >
                  Open Right Panel
                </Button>
              </Card>

              <Card>
                <h3 className="font-semibold text-gray-900 mb-2">Left Slide-over</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Panel slides in from the left side
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSlideOverPosition('left')
                    setIsSlideOverOpen(true)
                  }}
                  fullWidth
                >
                  Open Left Panel
                </Button>
              </Card>
            </div>
          </section>

          {/* Features Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card variant="glass">
                <div className="text-3xl mb-3">⌨️</div>
                <h3 className="font-semibold text-gray-900 mb-2">Keyboard Shortcuts</h3>
                <p className="text-sm text-gray-600">
                  ⌘K for search, ESC to close, ↑↓ to navigate
                </p>
              </Card>

              <Card variant="glass">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="font-semibold text-gray-900 mb-2">Beautiful Design</h3>
                <p className="text-sm text-gray-600">
                  Glassmorphism, backdrop blur, smooth animations
                </p>
              </Card>

              <Card variant="glass">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
                <p className="text-sm text-gray-600">
                  Responsive design that works on all devices
                </p>
              </Card>

              <Card variant="glass">
                <div className="text-3xl mb-3">♿</div>
                <h3 className="font-semibold text-gray-900 mb-2">Accessible</h3>
                <p className="text-sm text-gray-600">
                  ARIA labels, focus management, keyboard navigation
                </p>
              </Card>
            </div>
          </section>

          {/* Code Examples */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Usage Examples</h2>
            <div className="space-y-6">
              <Card padding="lg">
                <h3 className="font-semibold text-gray-900 mb-3">Dialog Component</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<Dialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Dialog Title"
  description="Optional description"
  size="md"
  footer={
    <>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onConfirm}>
        Confirm
      </Button>
    </>
  }
>
  {/* Your content here */}
</Dialog>`}
                </pre>
              </Card>

              <Card padding="lg">
                <h3 className="font-semibold text-gray-900 mb-3">Slide-over Component</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<SlideOver
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Panel Title"
  position="right"
  size="md"
  footer={
    <Button variant="primary" fullWidth>
      Save Changes
    </Button>
  }
>
  {/* Your content here */}
</SlideOver>`}
                </pre>
              </Card>

              <Card padding="lg">
                <h3 className="font-semibold text-gray-900 mb-3">Command Palette</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Already integrated in Header.tsx
// Just press ⌘K or Ctrl+K to open!

<CommandPalette
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>`}
                </pre>
              </Card>
            </div>
          </section>
        </div>
      </div>

      {/* Dialog Modal */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Example Dialog"
        description="This is a beautiful dialog modal with smooth animations"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsDialogOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This dialog demonstrates the glassmorphic design with backdrop blur,
            smooth animations, and proper focus management.
          </p>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 You can close this dialog by clicking outside, pressing ESC, or clicking the close button.
            </p>
          </div>
        </div>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          alert('Item deleted!')
        }}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Slide-over Panel */}
      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        title="Slide-over Panel"
        description="This panel slides in smoothly from the side"
        position={slideOverPosition}
        size="md"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="ghost" onClick={() => setIsSlideOverOpen(false)} fullWidth>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsSlideOverOpen(false)} fullWidth>
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Panel Content</h3>
            <p className="text-gray-600">
              Slide-over panels are great for forms, details, and actions that don't need
              the full attention of a modal dialog.
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-lg">
            <p className="text-sm text-primary-900">
              ✨ This panel has smooth slide-in animations and can be positioned on either side!
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-white border border-gray-200 rounded-lg">
              <div className="font-medium text-gray-900">Feature 1</div>
              <div className="text-sm text-gray-600">Beautiful animations</div>
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-lg">
              <div className="font-medium text-gray-900">Feature 2</div>
              <div className="text-sm text-gray-600">Keyboard shortcuts</div>
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-lg">
              <div className="font-medium text-gray-900">Feature 3</div>
              <div className="text-sm text-gray-600">Mobile responsive</div>
            </div>
          </div>
        </div>
      </SlideOver>
    </div>
  )
}

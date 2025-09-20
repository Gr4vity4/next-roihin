'use client'

import Button from '@/components/Button'
import Typography from '@/components/ui/Typography'
import { ArrowRight, Download, Heart, ShoppingCart } from 'lucide-react'

export default function ButtonDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-mixed-lang font-bold text-center mb-12">Button Component Showcase</h1>
        
        {/* Typography Color Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Typography Color Test</h2>
          <div className="space-y-4">
            <Typography variant="h3" color="primary">Primary Color (Green) - This should be green #006039</Typography>
            <Typography variant="h3" color="highlight">Highlight Color (Gold) - This should be gold #D4AF37</Typography>
            <Typography variant="body">Normal text without color prop</Typography>
          </div>
        </section>

        {/* Variants */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="gold">Gold Button</Button>
            <Button variant="green">Green Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </section>

        {/* Sizes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Button Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
        </section>

        {/* With Icons */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Buttons with Icons</h2>
          <div className="flex flex-wrap gap-4">
            <Button leftIcon={<Heart size={18} />}>Like</Button>
            <Button rightIcon={<ArrowRight size={18} />}>Continue</Button>
            <Button variant="green" leftIcon={<ShoppingCart size={18} />} rightIcon={<ArrowRight size={18} />}>
              Checkout
            </Button>
            <Button variant="outline" leftIcon={<Download size={18} />}>
              Download
            </Button>
          </div>
        </section>

        {/* States */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Button States</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button isLoading>Loading</Button>
            <Button variant="green" isLoading>Loading</Button>
          </div>
        </section>

        {/* Full Width */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Full Width Buttons</h2>
          <div className="max-w-md space-y-4">
            <Button fullWidth variant="gold">Full Width Gold</Button>
            <Button fullWidth variant="green">Full Width Green</Button>
            <Button fullWidth variant="outline">Full Width Outline</Button>
          </div>
        </section>

        {/* Interactive Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Interactive Examples</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => alert('Gold button clicked!')}
              variant="gold"
              leftIcon={<Heart size={18} />}
            >
              Click Me
            </Button>
            <Button
              onClick={() => alert('Green button clicked!')}
              variant="green"
              rightIcon={<ArrowRight size={18} />}
            >
              Proceed
            </Button>
          </div>
        </section>

        {/* Accessibility Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Accessibility Features</h2>
          <p className="text-gray-600 mb-4">All buttons include:</p>
          <ul className="list-disc list-inside text-gray-600 mb-6">
            <li>Keyboard navigation support (Tab, Enter, Space)</li>
            <li>Focus indicators with ring styling</li>
            <li>Proper ARIA labels</li>
            <li>Disabled state handling</li>
            <li>Loading state with spinner</li>
          </ul>
          <div className="flex gap-4">
            <Button aria-label="Save document">Save</Button>
            <Button variant="green" aria-label="Submit form">Submit</Button>
          </div>
        </section>
      </div>
    </div>
  )
}
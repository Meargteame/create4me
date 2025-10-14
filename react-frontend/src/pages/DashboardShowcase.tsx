import { useState } from 'react'
import DashboardLayout, { Section } from '../components/layouts/DashboardLayout'
import StatCard, { StatCardGrid, CompactStatCard } from '../components/ui/StatCard'
import { Button, Card } from '../components/ui'
import { 
  FaRocket,
  FaUsers,
  FaChartLine,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
  FaPlus
} from '../components/icons'

export default function DashboardShowcase() {
  const [loading, setLoading] = useState(false)

  return (
    <DashboardLayout
      title="Dashboard Components"
      subtitle="Modern dashboard components showcase"
      actions={
        <>
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button size="sm">
            <FaPlus className="mr-2" />
            Add New
          </Button>
        </>
      }
    >
      {/* Stat Cards Section */}
      <Section 
        title="Stat Cards" 
        subtitle="Animated metric cards with trends and icons"
      >
        <StatCardGrid className="mb-8">
          <StatCard
            title="Total Revenue"
            value="$45,231"
            change={12.5}
            trend="up"
            changeLabel="vs last month"
            icon={<FaDollarSign size={24} />}
            color="success"
          />
          <StatCard
            title="Active Users"
            value="2,345"
            change={8.3}
            trend="up"
            changeLabel="vs last week"
            icon={<FaUsers size={24} />}
            color="primary"
          />
          <StatCard
            title="Pending Tasks"
            value="23"
            change={-5.2}
            trend="down"
            changeLabel="vs yesterday"
            icon={<FaClock size={24} />}
            color="warning"
          />
          <StatCard
            title="Completion Rate"
            value="94%"
            change={2.1}
            trend="up"
            changeLabel="this quarter"
            icon={<FaCheckCircle size={24} />}
            color="info"
          />
        </StatCardGrid>

        {/* Loading State */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Loading State</h4>
          <StatCardGrid>
            <StatCard
              title="Loading..."
              value="0"
              loading={true}
            />
            <StatCard
              title="Loading..."
              value="0"
              loading={true}
            />
            <StatCard
              title="Loading..."
              value="0"
              loading={true}
            />
            <StatCard
              title="Loading..."
              value="0"
              loading={true}
            />
          </StatCardGrid>
        </div>
      </Section>

      {/* Compact Stat Cards */}
      <Section 
        title="Compact Stat Cards"
        subtitle="Smaller variants for sidebars and tight spaces"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <CompactStatCard
            label="Projects"
            value="127"
            icon={<FaRocket size={20} />}
            color="primary"
          />
          <CompactStatCard
            label="Team Members"
            value="48"
            icon={<FaUsers size={20} />}
            color="success"
          />
          <CompactStatCard
            label="Growth"
            value="+15%"
            icon={<FaChartLine size={20} />}
            color="warning"
          />
          <CompactStatCard
            label="Revenue"
            value="$12.5K"
            icon={<FaDollarSign size={20} />}
            color="danger"
          />
        </div>
      </Section>

      {/* Color Variants */}
      <Section 
        title="Color Variants"
        subtitle="Different color schemes for various metrics"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Primary"
            value="1,234"
            change={10}
            trend="up"
            icon={<FaRocket size={24} />}
            color="primary"
          />
          <StatCard
            title="Success"
            value="98%"
            change={5}
            trend="up"
            icon={<FaCheckCircle size={24} />}
            color="success"
          />
          <StatCard
            title="Warning"
            value="12"
            change={-3}
            trend="down"
            icon={<FaClock size={24} />}
            color="warning"
          />
          <StatCard
            title="Danger"
            value="5"
            change={-8}
            trend="down"
            icon={<FaChartLine size={24} />}
            color="danger"
          />
          <StatCard
            title="Info"
            value="456"
            change={0}
            trend="neutral"
            icon={<FaUsers size={24} />}
            color="info"
          />
        </div>
      </Section>

      {/* Interactive Demo */}
      <Section 
        title="Interactive Demo"
        subtitle="Click the button to toggle loading state"
        actions={
          <Button 
            onClick={() => setLoading(!loading)}
            size="sm"
            variant="outline"
          >
            {loading ? 'Stop Loading' : 'Show Loading'}
          </Button>
        }
      >
        <StatCardGrid>
          <StatCard
            title="Interactive Card 1"
            value={loading ? "..." : "5,234"}
            change={12}
            trend="up"
            icon={<FaRocket size={24} />}
            color="primary"
            loading={loading}
          />
          <StatCard
            title="Interactive Card 2"
            value={loading ? "..." : "89%"}
            change={8}
            trend="up"
            icon={<FaCheckCircle size={24} />}
            color="success"
            loading={loading}
          />
          <StatCard
            title="Interactive Card 3"
            value={loading ? "..." : "432"}
            change={-3}
            trend="down"
            icon={<FaUsers size={24} />}
            color="warning"
            loading={loading}
          />
          <StatCard
            title="Interactive Card 4"
            value={loading ? "..." : "$21K"}
            change={15}
            trend="up"
            icon={<FaDollarSign size={24} />}
            color="info"
            loading={loading}
          />
        </StatCardGrid>
      </Section>

      {/* Integration Example */}
      <Section 
        title="Dashboard Layout Example"
        subtitle="How it all comes together"
      >
        <Card variant="glass" padding="lg">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Usage Example</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import DashboardLayout, { Section } from '../components/layouts/DashboardLayout'
import StatCard, { StatCardGrid } from '../components/ui/StatCard'

export default function MyDashboard() {
  return (
    <DashboardLayout
      title="My Dashboard"
      subtitle="Welcome back!"
      actions={<Button>New Item</Button>}
    >
      <StatCardGrid>
        <StatCard
          title="Total Sales"
          value="$45,231"
          change={12.5}
          trend="up"
          icon={<IconDollar />}
          color="success"
        />
        {/* More cards... */}
      </StatCardGrid>

      <Section title="My Section">
        {/* Your content */}
      </Section>
    </DashboardLayout>
  )
}`}
            </pre>
          </div>
        </Card>
      </Section>
    </DashboardLayout>
  )
}

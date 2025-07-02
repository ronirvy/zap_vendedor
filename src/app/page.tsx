import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ZapVendedor Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Products" 
          description="Manage your product catalog"
          link="/admin/products"
          icon="📱"
        />
        
        <DashboardCard 
          title="Conversations" 
          description="View customer conversations"
          link="/admin/conversations"
          icon="💬"
        />
        
        <DashboardCard 
          title="Settings" 
          description="Configure WhatsApp and AI settings"
          link="/admin/settings"
          icon="⚙️"
        />
      </div>
    </div>
  )
}

function DashboardCard({ 
  title, 
  description, 
  link, 
  icon 
}: { 
  title: string; 
  description: string; 
  link: string; 
  icon: string;
}) {
  return (
    <Link href={link}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="text-4xl mb-4">{icon}</div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}
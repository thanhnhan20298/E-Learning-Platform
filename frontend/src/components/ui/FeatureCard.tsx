interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}

export default function FeatureCard({ icon, title, description, onClick }: FeatureCardProps) {
  return (
    <div 
      className="bg-white p-6 rounded-xl shadow-lg card-hover cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-lg mb-4 mx-auto">
        <div className="text-primary-600">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-center leading-relaxed">{description}</p>
    </div>
  )
}

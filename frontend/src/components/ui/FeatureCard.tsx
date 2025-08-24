interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  onClick,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`bg-white p-4 md:p-6 rounded-xl shadow-lg card-hover cursor-pointer border border-gray-100 min-h-[160px] md:min-h-[180px] ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-primary-100 rounded-lg mb-3 md:mb-4 mx-auto">
        <div className="text-primary-600 [&>svg]:w-6 [&>svg]:h-6 md:[&>svg]:w-8 md:[&>svg]:h-8">
          {icon}
        </div>
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3 text-center">
        {title}
      </h3>
      <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed">
        {description}
      </p>
    </div>
  );
}

import type { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}

export const FeatureCard = ({
  title,
  description,
  icon,
  iconBg,
  iconColor,
}: FeatureCardProps) => (
  <div className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center mb-6`}>
      <div className={`w-6 h-6 ${iconColor}`}>
        {icon}
      </div>
    </div>
    <h4 className="text-xl font-semibold text-gray-900 mb-3">{title}</h4>
    <p className="text-gray-600">{description}</p>
  </div>
);

import React from 'react';
import { StatsCard } from './StatsCard';
import { FileText, CheckCircle, FileBarChart2 } from 'lucide-react';

interface StatsSectionProps {
  totalForms: number;
  activeForms: number;
  totalSubmissions: number;
  loading: boolean;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  totalForms,
  activeForms,
  totalSubmissions,
  loading,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <StatsCard
        title="Total Forms"
        value={totalForms}
        icon={<FileText className="h-5 w-5 text-blue-600" />}
        color="blue"
        loading={loading}
      />
      <StatsCard
        title="Active Forms"
        value={activeForms}
        icon={<CheckCircle className="h-5 w-5 text-green-600" />}
        color="green"
        loading={loading}
      />
      <StatsCard
        title="Total Submissions"
        value={totalSubmissions}
        icon={<FileBarChart2 className="h-5 w-5 text-purple-600" />}
        color="purple"
        loading={loading}
      />
    </div>
  );
};

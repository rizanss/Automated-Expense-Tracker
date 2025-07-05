import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <div className="financial-stats-card group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-slate-100 mb-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-3">
              <span className={`text-sm font-semibold ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}
              </span>
              <span className="text-xs text-slate-500 ml-2">from last month</span>
            </div>
          )}
        </div>
        <div className={`flex items-center justify-center w-14 h-14 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200 ${color}`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
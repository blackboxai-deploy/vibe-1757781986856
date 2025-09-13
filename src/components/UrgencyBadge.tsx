'use client';

import { UrgencyLevel } from '@/types/medical';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function UrgencyBadge({ urgency, size = 'md', showIcon = true }: UrgencyBadgeProps) {
  const urgencyConfig = {
    [UrgencyLevel.CRITICAL]: {
      label: 'Crítico',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      icon: '🚨',
      description: 'Requer ação imediata'
    },
    [UrgencyLevel.URGENT]: {
      label: 'Urgente', 
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-200',
      icon: '⚠️',
      description: 'Atenção em 2 horas'
    },
    [UrgencyLevel.ATTENTION]: {
      label: 'Atenção',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800', 
      borderColor: 'border-yellow-200',
      icon: '📋',
      description: 'Seguimento em 24h'
    },
    [UrgencyLevel.NORMAL]: {
      label: 'Normal',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      icon: '✅',
      description: 'Sem achados críticos'
    }
  };

  const config = urgencyConfig[urgency];
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div 
      className={`
        inline-flex items-center space-x-1.5 rounded-full border font-medium
        ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]}
      `}
      title={config.description}
    >
      {showIcon && <span className="text-xs">{config.icon}</span>}
      <span>{config.label}</span>
    </div>
  );
}

export function UrgencyIndicator({ urgency }: { urgency: UrgencyLevel }) {
  const urgencyOrder = {
    [UrgencyLevel.CRITICAL]: 4,
    [UrgencyLevel.URGENT]: 3, 
    [UrgencyLevel.ATTENTION]: 2,
    [UrgencyLevel.NORMAL]: 1
  };

  const level = urgencyOrder[urgency];
  const maxLevel = 4;
  
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxLevel }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-6 rounded-sm ${
            i < level 
              ? urgency === UrgencyLevel.CRITICAL ? 'bg-red-500'
                : urgency === UrgencyLevel.URGENT ? 'bg-orange-500'  
                : urgency === UrgencyLevel.ATTENTION ? 'bg-yellow-500'
                : 'bg-green-500'
              : 'bg-slate-200'
          }`}
        />
      ))}
    </div>
  );
}
import React from 'react';

const StatCard = ({ title, value, prefix = '', suffix = '', icon, trend, trendDirection = 'up', description, progress }) => {
  const isUp = trendDirection === 'up';
  
  return (
    <div className="premium-card rounded-2xl p-6 flex flex-col justify-between group cursor-default">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-[0.15em] leading-tight">{title}</h3>
        {icon && (
          <div className="text-text-muted group-hover:text-primary transition-colors duration-500 material-symbols-outlined optical-align">
            {icon}
          </div>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-1 mb-2 tabular-nums w-full">
          {prefix && <span className="text-xl font-medium text-text-muted shrink-0">{prefix}</span>}
          <span className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none whitespace-nowrap">{value}</span>
          {suffix && <span className="text-sm font-medium text-text-muted ml-1 shrink-0">{suffix}</span>}
        </div>
        
        {progress !== undefined ? (
          <div className="mt-4">
            <div className="w-full bg-[#18181B] h-1.5 rounded-full overflow-hidden mb-2 ring-1 ring-inset ring-white/5">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{progress}% of target reach</span>
          </div>
        ) : (trend || description) && (
          <div className="mt-2 flex items-center gap-2">
            {trend && (
              <span className={`text-xs font-bold flex items-center gap-1 ${isUp ? 'text-success' : 'text-danger'}`}>
                <span className="material-symbols-outlined text-[16px]">
                  {isUp ? 'trending_up' : 'trending_down'}
                </span>
                {trend}
              </span>
            )}
            {description && (
              <span className="text-xs text-text-muted font-medium tracking-tight">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

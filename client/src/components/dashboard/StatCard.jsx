import React from 'react';

const StatCard = ({ title, value, prefix = '', suffix = '', icon, trend, trendDirection = 'up', description, progress }) => {
  const isUp = trendDirection === 'up';
  
  return (
    <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-6 flex flex-col justify-between hover:border-primary/30 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] leading-tight">{title}</h3>
        {icon && (
          <div className="text-text-muted group-hover:text-primary transition-colors duration-300">
            {icon}
          </div>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-1 mb-2">
          {prefix && <span className="text-xl font-medium text-text-muted">{prefix}</span>}
          <span className="text-3xl font-bold text-white tracking-tight leading-none">{value}</span>
          {suffix && <span className="text-sm font-medium text-text-muted ml-1">{suffix}</span>}
        </div>
        
        {progress !== undefined ? (
          <div className="mt-4">
            <div className="w-full bg-[#1E1E1E] h-1 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{progress}% of target reach</span>
          </div>
        ) : (trend || description) && (
          <div className="mt-2 flex items-center gap-2">
            {trend && (
              <span className={`text-xs font-bold flex items-center gap-0.5 ${isUp ? 'text-success' : 'text-error'}`}>
                <span className="material-symbols-outlined text-[14px]">
                  {isUp ? 'trending_up' : 'trending_down'}
                </span>
                {trend}
              </span>
            )}
            {description && (
              <span className="text-[10px] text-text-muted font-bold tracking-tight">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

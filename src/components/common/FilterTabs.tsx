import React from 'react';

export interface FilterTabItem<T extends string = string> {
  key: T;
  label: string;
  count?: number;
}

interface FilterTabsProps<T extends string = string> {
  tabs: FilterTabItem<T>[];
  active: T;
  onChange: (key: T) => void;
  className?: string;
}

export function FilterTabs<T extends string = string>({
  tabs,
  active,
  onChange,
  className = '',
}: FilterTabsProps<T>) {
  return (
    <div className={`flex items-center gap-1.5 bg-slate-200/60 p-1.5 rounded-2xl w-fit overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              isActive ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`min-w-[20px] h-5 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-300/70 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

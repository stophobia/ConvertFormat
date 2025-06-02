import React from 'react';
import type { TabState } from '../types';

interface TabBarProps {
  tabs: TabState[];
  activeTabId: string | null;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onAddTab: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTabId, onSelectTab, onCloseTab }) => {
  return (
    <div className="bg-secondary-200 dark:bg-secondary-700/50 shadow-sm flex items-center overflow-x-auto no-scrollbar">
      <nav className="flex-grow flex space-x-1 p-1.5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center justify-between min-w-[120px] max-w-[200px] px-3 py-1.5 rounded-t-md text-sm transition-colors
              ${activeTabId === tab.id 
                ? 'bg-secondary-50 dark:bg-secondary-800/50 text-primary-600 dark:text-primary-400 font-medium border-b-2 border-primary-500' 
                : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-300/50 dark:hover:bg-secondary-600/70'
              }`}
          >
            <span className="truncate" title={tab.name}>{tab.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onCloseTab(tab.id); }}
              className="ml-2 p-0.5 rounded hover:bg-red-200 dark:hover:bg-red-700 text-secondary-500 hover:text-red-600 dark:hover:text-red-400"
              aria-label={`${tab.name} 탭 닫기`}
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          </button>
        ))}
      </nav>
    </div>
  );
};
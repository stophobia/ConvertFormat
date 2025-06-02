import React from 'react';
import type { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onLoadHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  history, 
  onLoadHistoryItem, 
  onClearHistory, 
  onClose 
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="w-72 bg-white dark:bg-secondary-800 flex flex-col h-screen shadow-lg border-l border-secondary-200 dark:border-secondary-700">
      <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200">변환 기록</h2>
        <button 
          onClick={onClose}
          className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200"
          aria-label="기록 패널 닫기"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-4 text-center text-secondary-500 dark:text-secondary-400">
            <p>아직 기록이 없습니다.</p>
          </div>
        ) : (
          <ul className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {history.map((item) => (
              <li key={item.id} className="p-3 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 cursor-pointer" onClick={() => onLoadHistoryItem(item)}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-primary-600 dark:text-primary-400 text-sm">
                    {item.toolType}
                  </span>
                  <span className="text-xs text-secondary-500 dark:text-secondary-400">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <div className="text-xs text-secondary-600 dark:text-secondary-300 line-clamp-1">
                  <span className="font-medium mr-1">입력:</span>
                  {item.input.slice(0, 50)}{item.input.length > 50 ? '...' : ''}
                </div>
                <div className="text-xs text-secondary-600 dark:text-secondary-300 line-clamp-1">
                  <span className="font-medium mr-1">출력:</span>
                  {item.output.slice(0, 50)}{item.output.length > 50 ? '...' : ''}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {history.length > 0 && (
        <div className="p-3 border-t border-secondary-200 dark:border-secondary-700">
          <button 
            onClick={onClearHistory}
            className="w-full py-2 px-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition-colors dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400"
          >
            모든 기록 지우기
          </button>
        </div>
      )}
    </div>
  );
}; 